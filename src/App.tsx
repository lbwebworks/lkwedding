import { useEffect, useRef, useState } from 'react'
import fallbackHeroImg from './assets/hero.png'
import calendarDayImage from './assets/wedding/calendar/sept_20.png'
import { weddingImageEntries, weddingImages } from './data/imageLibrary'
import { siteData } from './data/siteData'
import './App.css'

const SAVE_DATE_VISIBLE_COUNT = 6
const SAVE_DATE_MIN_SWAP_DELAY_MS = 5000
const SAVE_DATE_MAX_SWAP_DELAY_MS = 10000
const SAVE_DATE_FADE_DURATION_MS = 3000

function getCountdownParts(targetDateISO: string) {
  const now = new Date().getTime()
  const target = new Date(targetDateISO).getTime()
  const diff = Math.max(target - now, 0)

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}

function getRandomSaveDateDelay() {
  return (
    SAVE_DATE_MIN_SWAP_DELAY_MS +
    Math.floor(Math.random() * (SAVE_DATE_MAX_SWAP_DELAY_MS - SAVE_DATE_MIN_SWAP_DELAY_MS + 1))
  )
}

// Module-level counter shared across all tiles. Each tile claims the next
// value when it swaps, guaranteeing no two tiles ever show the same image.
let saveDateGlobalCounter = 0

type SaveDateTileProps = {
  thumbnails: string[]
  fullSizeImages: string[]
  showAsImage: boolean
  slotIndex: number
  onOpenImage?: (imageSrc: string) => void
}

function SaveDateTile({
  thumbnails,
  fullSizeImages,
  showAsImage,
  slotIndex,
  onOpenImage,
}: SaveDateTileProps) {
  const [imageIndex, setImageIndex] = useState(() => {
    const idx = saveDateGlobalCounter % Math.max(fullSizeImages.length, 1)
    saveDateGlobalCounter += 1
    return idx
  })
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (fullSizeImages.length === 0) {
      return
    }

    let cancelled = false
    let hideTimerId: number | undefined
    let swapTimerId: number | undefined

    const scheduleNextSwap = () => {
      hideTimerId = window.setTimeout(() => {
        if (cancelled) return
        setIsVisible(false)

        swapTimerId = window.setTimeout(() => {
          if (cancelled) return
          setImageIndex(() => {
            const next = saveDateGlobalCounter % fullSizeImages.length
            saveDateGlobalCounter += 1
            return next
          })
          setIsVisible(true)
          scheduleNextSwap()
        }, SAVE_DATE_FADE_DURATION_MS)
      }, getRandomSaveDateDelay())
    }

    scheduleNextSwap()

    return () => {
      cancelled = true
      if (hideTimerId !== undefined) window.clearTimeout(hideTimerId)
      if (swapTimerId !== undefined) window.clearTimeout(swapTimerId)
    }
  }, [fullSizeImages.length])

  const currentFullSizeImage = fullSizeImages[imageIndex] ?? ''
  const currentThumbnail = thumbnails[imageIndex] ?? currentFullSizeImage

  return (
    <button
      type="button"
      className={`save-date-card${isVisible ? '' : ' is-hidden'}`}
      onClick={() => onOpenImage?.(currentFullSizeImage)}
      disabled={!showAsImage || !onOpenImage}
      aria-label={`Open save the date image ${slotIndex + 1}`}
    >
      {showAsImage ? (
        <img
          src={currentThumbnail}
          alt={`Save the date ${slotIndex + 1}`}
          className="save-date-photo"
          loading="lazy"
        />
      ) : (
        <div className="save-date-label">{currentFullSizeImage}</div>
      )}
    </button>
  )
}

function App() {
  const [countdown, setCountdown] = useState(() =>
    getCountdownParts(siteData.hero.weddingDateISO),
  )
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  const [activeSaveDateIndex, setActiveSaveDateIndex] = useState<number | null>(null)
  const [dressViewer, setDressViewer] = useState<{ images: { src: string; alt: string }[]; index: number } | null>(
    null,
  )
  const [showStickyRsvpButton, setShowStickyRsvpButton] = useState(true)
  const storySectionRef = useRef<HTMLElement | null>(null)
  const rsvpSectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    document.title = siteData.hero.title
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(siteData.hero.weddingDateISO))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const section = rsvpSectionRef.current

    if (!section) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyRsvpButton(!entry.isIntersecting)
      },
      {
        threshold: 0.15,
      },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = storySectionRef.current

    if (!section) {
      return
    }

    const cards = Array.from(section.querySelectorAll<HTMLElement>('.story-card'))
    let frameId = 0

    const updateStoryVisibility = () => {
      frameId = 0
      const viewportCenter = window.innerHeight / 2
      const fadeDistance = Math.max(window.innerHeight * 0.48, 220)

      cards.forEach((card) => {
        const bounds = card.getBoundingClientRect()
        const cardCenter = bounds.top + bounds.height / 2
        const distanceFromCenter = Math.abs(cardCenter - viewportCenter)
        const visibility = Math.max(0.16, 1 - distanceFromCenter / fadeDistance)

        card.style.setProperty('--story-opacity', visibility.toFixed(3))
      })
    }

    const scheduleStoryVisibilityUpdate = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(updateStoryVisibility)
      }
    }

    updateStoryVisibility()
    window.addEventListener('scroll', scheduleStoryVisibilityUpdate, { passive: true })
    window.addEventListener('resize', scheduleStoryVisibilityUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleStoryVisibilityUpdate)
      window.removeEventListener('resize', scheduleStoryVisibilityUpdate)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  useEffect(() => {
    if (activeStoryIndex === null && activeSaveDateIndex === null && dressViewer === null) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveStoryIndex(null)
        setActiveSaveDateIndex(null)
        setDressViewer(null)
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (activeStoryIndex !== null) {
          setActiveStoryIndex((current) => {
            if (current === null) {
              return current
            }

            return (current - 1 + siteData.story.chapters.length) % siteData.story.chapters.length
          })
          return
        }

        if (dressViewer !== null) {
          setDressViewer((current) => {
            if (current === null || current.images.length === 0) {
              return current
            }

            return { ...current, index: (current.index - 1 + current.images.length) % current.images.length }
          })
          return
        }

        setActiveSaveDateIndex((current) => {
          if (current === null || saveDateEntries.length === 0) {
            return current
          }

          return (current - 1 + saveDateEntries.length) % saveDateEntries.length
        })
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (activeStoryIndex !== null) {
          setActiveStoryIndex((current) => {
            if (current === null) {
              return current
            }

            return (current + 1) % siteData.story.chapters.length
          })
          return
        }

        if (dressViewer !== null) {
          setDressViewer((current) => {
            if (current === null || current.images.length === 0) {
              return current
            }

            return { ...current, index: (current.index + 1) % current.images.length }
          })
          return
        }

        setActiveSaveDateIndex((current) => {
          if (current === null || saveDateEntries.length === 0) {
            return current
          }

          return (current + 1) % saveDateEntries.length
        })
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeSaveDateIndex, activeStoryIndex, dressViewer])

  const heroImage = weddingImages.hero[0] ?? fallbackHeroImg
  const venueImages = weddingImageEntries.venue
  const dressImageEntries = {
    Ladies: weddingImageEntries.dressLadies,
    Gentlemen: weddingImageEntries.dressGentlemen,
  }
  const saveDateItems =
    weddingImageEntries.saveTheDate.length > 0
      ? weddingImageEntries.saveTheDate.map((entry) => entry.src)
      : siteData.saveTheDate.photos
  const saveDateEntries = weddingImageEntries.saveTheDate
  const saveDateUsesImages = saveDateEntries.length > 0
  const saveDateThumbnailImages = saveDateEntries.map((entry) => entry.thumbnailSrc)
  const saveDateFullImages = saveDateEntries.map((entry) => entry.src)

  const openSaveDateViewer = (imageSrc: string) => {
    if (saveDateEntries.length === 0) {
      return
    }

    const nextIndex = saveDateEntries.findIndex((entry) => entry.src === imageSrc)
    setActiveSaveDateIndex(nextIndex >= 0 ? nextIndex : 0)
    setDressViewer(null)
  }

  const openStoryViewer = (index: number) => {
    setActiveSaveDateIndex(null)
    setDressViewer(null)
    setActiveStoryIndex(index)
  }

  const openDressViewer = (images: { src: string; alt: string }[], index: number) => {
    if (images.length === 0) {
      return
    }

    setActiveStoryIndex(null)
    setActiveSaveDateIndex(null)
    setDressViewer({ images, index })
  }

  const closeSaveDateViewer = () => {
    setActiveStoryIndex(null)
    setActiveSaveDateIndex(null)
    setDressViewer(null)
  }

  const showPreviousSaveDateImage = () => {
    if (saveDateEntries.length === 0) {
      return
    }

    setActiveSaveDateIndex((current) => {
      if (current === null) {
        return current
      }

      return (current - 1 + saveDateEntries.length) % saveDateEntries.length
    })
  }

  const showNextSaveDateImage = () => {
    if (saveDateEntries.length === 0) {
      return
    }

    setActiveSaveDateIndex((current) => {
      if (current === null) {
        return current
      }

      return (current + 1) % saveDateEntries.length
    })
  }

  const showPreviousDressImage = () => {
    setDressViewer((current) => {
      if (current === null || current.images.length === 0) {
        return current
      }

      return { ...current, index: (current.index - 1 + current.images.length) % current.images.length }
    })
  }

  const showNextDressImage = () => {
    setDressViewer((current) => {
      if (current === null || current.images.length === 0) {
        return current
      }

      return { ...current, index: (current.index + 1) % current.images.length }
    })
  }

  const activeSaveDateEntry =
    activeSaveDateIndex !== null && saveDateEntries.length > 0
      ? saveDateEntries[activeSaveDateIndex % saveDateEntries.length]
      : null
  const activeSaveDateViewerIndex = activeSaveDateIndex ?? 0

  const getVenuePriority = (fileName: string) => {
    const lower = fileName.toLowerCase()
    if (lower.includes('church')) {
      return 0
    }
    if (lower.includes('venue') || lower.includes('reception')) {
      return 1
    }
    return 2
  }

  const orderedVenueImages = [...venueImages].sort(
    (a, b) => getVenuePriority(a.fileName) - getVenuePriority(b.fileName),
  )

  const pickStoryImage = (chapterTitle: string, index: number): string => {
    if (weddingImageEntries.story.length === 0) {
      return ''
    }

    const title = chapterTitle.toLowerCase()
    const keywords =
      title.includes('proposal')
        ? ['proposal']
        : title.includes('distance')
          ? ['distance', 'long']
          : ['coffee', 'meet', 'tim']

    const matched = weddingImageEntries.story.find((entry) => {
      const lowerFileName = entry.fileName.toLowerCase()
      return keywords.some((keyword) => lowerFileName.includes(keyword))
    })

    return matched?.src ?? weddingImageEntries.story[index % weddingImageEntries.story.length].src
  }

  const activeStoryChapter =
    activeStoryIndex !== null ? siteData.story.chapters[activeStoryIndex % siteData.story.chapters.length] : null
  const activeStoryImage = activeStoryChapter
    ? pickStoryImage(activeStoryChapter.title, activeStoryIndex ?? 0)
    : ''
  const isStoryViewerOpen = activeStoryChapter !== null

  return (
    <>
      <div className="photo-band-fixed-layer" aria-hidden="true">
        <img src={heroImage} alt="" className="photo-band-fixed-image" />
      </div>

      <main className="site-shell">
      <section className="panel hero" id="home">
        <p className="eyebrow">{siteData.hero.eyebrow}</p>
        <h1>{siteData.hero.title}</h1>
        <p className="hero-subtitle">{siteData.hero.subtitle}</p>
        <p className="date">{siteData.hero.date}</p>
        <p className="hero-copy">{siteData.hero.intro}</p>
      </section>

      <section className="panel photo-band" aria-label="Prenup photo preview">
        <div className="photo-band-overlay" aria-hidden="true" />
      </section>

      <section className="panel countdown" id="countdown">
        <h2>Until Our Wedding Day</h2>
        <div className="count-grid" aria-label="Wedding countdown">
          <div>
            <strong>{countdown.days}</strong>
            <span>Days</span>
          </div>
          <div>
            <strong>{countdown.hours}</strong>
            <span>Hours</span>
          </div>
          <div>
            <strong>{countdown.minutes}</strong>
            <span>Min</span>
          </div>
          <div>
            <strong>{countdown.seconds}</strong>
            <span>Sec</span>
          </div>
        </div>
      </section>

      <section className="panel calendar" id="calendar">
        <h2>{siteData.calendar.month}</h2>
        <div className="calendar-grid headings">
          {siteData.calendar.weekDays.map((day, idx) => (
            <span
              key={day}
              className={idx === 0 ? 'calendar-weekend calendar-sunday' : idx === 6 ? 'calendar-weekend calendar-saturday' : ''}
            >
              {day}
            </span>
          ))}
        </div>
        <div className="calendar-grid days">
          {siteData.calendar.dayCells.map((day, idx) => (
            <span
              key={`cell-${idx}-${day ?? 'empty'}`}
              aria-label={day === siteData.calendar.highlightDay ? `Wedding day ${day}` : day ? `Day ${day}` : undefined}
              className={[
                day === null ? 'calendar-empty' : '',
                idx % 7 === 0 ? 'calendar-weekend calendar-sunday' : '',
                idx % 7 === 6 ? 'calendar-weekend calendar-saturday' : '',
                day === siteData.calendar.highlightDay ? 'calendar-wedding-day' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={day === siteData.calendar.highlightDay ? { backgroundImage: `url(${calendarDayImage})` } : undefined}
            >
              {day === siteData.calendar.highlightDay ? '' : day ?? ''}
            </span>
          ))}
        </div>
      </section>

      <section className="panel story" id="story" ref={storySectionRef}>
        <h2>{siteData.story.title}</h2>
        <div className="story-grid">
          {siteData.story.chapters.map((chapter, index) => (
            <button
              type="button"
              key={chapter.title}
              className="story-card"
              onClick={() => openStoryViewer(index)}
              aria-label={`Open ${chapter.title} story image`}
            >
              <div className="story-media">
                {weddingImageEntries.story.length > 0 ? (
                  <img
                    src={pickStoryImage(chapter.title, index)}
                    alt={chapter.title}
                    className="story-photo"
                    loading="lazy"
                  />
                ) : (
                  <div className="placeholder-img story-fallback">{chapter.imageLabel}</div>
                )}
                <div className="story-caption">
                  <h3>{chapter.title}</h3>
                  <p>{chapter.body}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel program" id="program">
        <h2>{siteData.program.title}</h2>
        <div className="timeline">
          {siteData.program.items.map((item) => (
            <article key={`${item.time}-${item.title}`}>
              <p className="time">{item.time}</p>
              <div>
                <h3>
                  <svg className="timeline-icon" aria-hidden="true">
                    <use href={`${import.meta.env.BASE_URL}icons.svg#${item.icon}`} />
                  </svg>
                  {item.title}
                </h3>
                <p>{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel dress" id="dress-code">
        <h2>{siteData.dressCode.title}</h2>
        <p>{siteData.dressCode.summary}</p>
        {siteData.dressCode.sections.map((section) => {
          const sectionDressEntries = dressImageEntries[section.title as keyof typeof dressImageEntries] ?? []
          const formalEntry =
            sectionDressEntries.find((entry) => entry.fileName.toLowerCase().includes('formal')) ??
            sectionDressEntries[0]
          const casualEntries = sectionDressEntries.filter((entry) => entry.fileName.toLowerCase().includes('casual'))
          const fallbackSamples = section.samples.map((sample) => ({ src: sample, fileName: sample }))
          const casualSampleEntries = casualEntries.length > 0 ? casualEntries : fallbackSamples
          const visibleCasualEntries = casualSampleEntries.slice(0, 2)
          const sectionGalleryImages = [
            ...(formalEntry ? [{ src: formalEntry.src, alt: `${section.title} formal sample` }] : []),
            ...visibleCasualEntries.map((sample, idx) => ({
              src: sample.src,
              alt: `${section.title} casual sample ${idx + 1}`,
            })),
          ]

          return (
            <article key={section.title} className={`dress-block dress-block--${section.title.toLowerCase()}`}>
              <h3>{section.title}</h3>
              <div className="swatches" aria-label={`${section.title} motif colors`}>
                {section.palette.map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </div>
              <p>{section.note}</p>
              <div className="dress-layout" aria-label={`${section.title} outfit samples`}>
                <figure className="sample-card sample-card--formal">
                  {formalEntry ? (
                    <button
                      type="button"
                      className="sample-photo-button"
                      onClick={() => openDressViewer(sectionGalleryImages, 0)}
                      aria-label={`View ${section.title} formal sample`}
                    >
                      <img
                        src={formalEntry.src}
                        alt={`${section.title} formal sample`}
                        className="sample-photo"
                        loading="lazy"
                      />
                    </button>
                  ) : (
                    <span>{section.samples[0]}</span>
                  )}
                </figure>

                {visibleCasualEntries.map((sample, idx) => (
                  <figure
                    className={`sample-card sample-card--casual sample-card--casual-${idx + 1}`}
                    key={`${section.title}-${sample.fileName}-${idx}`}
                  >
                    <button
                      type="button"
                      className="sample-photo-button"
                      onClick={() => openDressViewer(sectionGalleryImages, (formalEntry ? 1 : 0) + idx)}
                      aria-label={`View ${section.title} casual sample ${idx + 1}`}
                    >
                      <img
                        src={sample.src}
                        alt={`${section.title} casual sample ${idx + 1}`}
                        className="sample-photo"
                        loading="lazy"
                      />
                    </button>
                  </figure>
                ))}
              </div>
            </article>
          )
        })}
      </section>

      <section className="panel venue" id="venue">
        <h2>{siteData.venue.title}</h2>
        <div className="venue-location-list" aria-label="Wedding venue maps">
          {siteData.venue.locations.map((location, index) => {
            const entry = orderedVenueImages[index]
            const caption = location.title
            const externalUrl = location.mapUrl

            return (
              <article className="venue-location-card" key={location.title}>
                <h4>{location.title}</h4>
                <div className="venue-location-grid">
                  <div className="venue-location-row venue-location-row--media">
                    {entry ? (
                      <figure className="venue-media venue-media--image">
                        <img src={entry.src} alt={caption} className="venue-photo-img" loading="lazy" />
                      </figure>
                    ) : (
                      <div className="placeholder-img venue-media venue-media--image">{siteData.venue.photoLabel}</div>
                    )}

                    <div className="venue-map-frame venue-media venue-media--map">
                      <iframe
                        title={`${location.title} map`}
                        src={location.mapEmbedUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  <div className="venue-location-row venue-location-row--meta">
                    <div className="venue-location-address">{location.query}</div>

                    <a href={externalUrl} target="_blank" rel="noreferrer">
                      {location.linkLabel}
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="panel save-date" id="save-the-date">
        <h2>{siteData.saveTheDate.title}</h2>
        <p>{siteData.saveTheDate.subtitle}</p>
        <div className="save-date-grid" aria-label="Save the date gallery">
          {Array.from({ length: Math.min(SAVE_DATE_VISIBLE_COUNT, saveDateItems.length) }).map(
            (_, idx) => (
              <SaveDateTile
                key={`save-date-tile-${idx}`}
                thumbnails={saveDateUsesImages ? saveDateThumbnailImages : saveDateItems}
                fullSizeImages={saveDateUsesImages ? saveDateFullImages : saveDateItems}
                showAsImage={saveDateUsesImages}
                slotIndex={idx}
                onOpenImage={saveDateUsesImages ? openSaveDateViewer : undefined}
              />
            ),
          )}
        </div>
      </section>

      <section className="panel entourage" id="entourage">
        <h2>{siteData.entourage.title}</h2>
        <div className="entourage-grid">
          {siteData.entourage.groups.map((group, groupIdx) => (
            <article key={groupIdx}>
              <h3>{group.title}</h3>
              {group.names.map((name) => {
                const marchesInChurch = !group.church?.length || group.church.includes(name)
                const churchIcon = (
                  <span
                    className="church-icon"
                    aria-hidden="true"
                    style={{ maskImage: `url(${import.meta.env.BASE_URL}star.svg)` }}
                  />
                )

                return (
                  <p key={name} className="entourage-name">
                    {marchesInChurch && groupIdx % 2 === 0 ? churchIcon : null}
                    {name}
                    {marchesInChurch && groupIdx % 2 !== 0 ? churchIcon : null}
                  </p>
                )
              })}
            </article>
          ))}
        </div>
      </section>


      <section className="panel faq" id="faq">
        <h2>{siteData.faqs.title}</h2>
        {siteData.faqs.items.map((item) => (
          <details key={item.question}>
            <summary>
              <svg className="faq-icon" aria-hidden="true">
                <use href={`${import.meta.env.BASE_URL}icons.svg#${item.icon}`} />
              </svg>
              {item.question}
            </summary>
            {item.answer.map((paragraph, index) => (
              <p key={`${item.question}-${index}`}>{paragraph}</p>
            ))}
          </details>
        ))}
      </section>

      <section className="panel rsvp" id="rsvp" ref={rsvpSectionRef}>
        <h2>{siteData.rsvp.title}</h2>
        <p>{siteData.rsvp.description}</p>
        <p className="rsvp-deadline">{siteData.rsvp.deadline}</p>
        <div className="rsvp-actions">
          <a
            className="secondary rsvp-button"
            href={siteData.rsvp.buttonUrl}
            aria-disabled={siteData.rsvp.buttonDisabled}
            target={siteData.rsvp.buttonDisabled ? undefined : '_blank'}
            rel={siteData.rsvp.buttonDisabled ? undefined : 'noreferrer'}
          >
            {siteData.rsvp.buttonLabel}
          </a>
        </div>
      </section>

      <section className="panel closing" id="closing">
        <p className="eyebrow">{siteData.footer.line}</p>
        <h2>{siteData.footer.names}</h2>
        <p>{siteData.hero.date}</p>
      </section>
      </main>

      {activeSaveDateEntry || isStoryViewerOpen || dressViewer ? (
        <div className="image-viewer-backdrop" role="presentation" onClick={closeSaveDateViewer}>
          <div
            className={`image-viewer${isStoryViewerOpen ? ' image-viewer--story' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={
              isStoryViewerOpen
                ? 'Our Story image viewer'
                : dressViewer
                  ? 'Dress code image viewer'
                  : 'Save the date image viewer'
            }
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="image-viewer-header">
              <span className="image-viewer-counter">
                {isStoryViewerOpen
                  ? `${(activeStoryIndex ?? 0) + 1} / ${siteData.story.chapters.length}`
                  : dressViewer
                    ? `${dressViewer.index + 1} / ${dressViewer.images.length}`
                    : `${activeSaveDateViewerIndex + 1} / ${saveDateEntries.length}`}
              </span>
              <button
                type="button"
                className="image-viewer-close"
                onClick={closeSaveDateViewer}
                aria-label="Close image viewer"
              >
                ✕
              </button>
            </div>

            {/* Image + meta */}
            <div className="image-viewer-frame">
              <img
                src={
                  isStoryViewerOpen
                    ? activeStoryImage
                    : dressViewer
                      ? dressViewer.images[dressViewer.index]?.src ?? ''
                      : activeSaveDateEntry?.viewerSrc ?? ''
                }
                alt={
                  isStoryViewerOpen
                    ? activeStoryChapter?.title ?? ''
                    : dressViewer
                      ? dressViewer.images[dressViewer.index]?.alt ?? ''
                      : activeSaveDateEntry?.fileName ?? ''
                }
                className="image-viewer-image"
              />
              {isStoryViewerOpen && (
                <div className="image-viewer-story-meta">
                  <h2>{activeStoryChapter?.title}</h2>
                  <p>{activeStoryChapter?.body}</p>
                </div>
              )}
            </div>

            {/* Footer toolbar */}
            <div className="image-viewer-toolbar">
              <button
                type="button"
                className="image-viewer-nav image-viewer-nav--prev"
                onClick={
                  isStoryViewerOpen
                    ? () =>
                        setActiveStoryIndex((current) =>
                          current === null
                            ? current
                            : (current - 1 + siteData.story.chapters.length) % siteData.story.chapters.length,
                        )
                    : dressViewer
                      ? showPreviousDressImage
                      : showPreviousSaveDateImage
                }
                aria-label="Previous image"
              >
                ‹
              </button>

              <div className="image-viewer-toolbar-meta">
                {!isStoryViewerOpen && (
                  <div className="image-viewer-meta">
                    <span>
                      {dressViewer
                        ? dressViewer.images[dressViewer.index]?.alt
                        : activeSaveDateEntry?.fileName}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="image-viewer-nav image-viewer-nav--next"
                onClick={
                  isStoryViewerOpen
                    ? () =>
                        setActiveStoryIndex((current) =>
                          current === null ? current : (current + 1) % siteData.story.chapters.length,
                        )
                    : dressViewer
                      ? showNextDressImage
                      : showNextSaveDateImage
                }
                aria-label="Next image"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showStickyRsvpButton ? (
        <a
          className="secondary rsvp-sticky-button"
          href={siteData.rsvp.buttonUrl}
          aria-disabled={siteData.rsvp.buttonDisabled}
          target={siteData.rsvp.buttonDisabled ? undefined : '_blank'}
          rel={siteData.rsvp.buttonDisabled ? undefined : 'noreferrer'}
        >
          {siteData.rsvp.buttonLabel}
        </a>
      ) : null}
    </>
  )
}

export default App
