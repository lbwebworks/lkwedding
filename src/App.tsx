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

function getInitialSaveDateIndex(length: number, seedIndex: number) {
  if (length <= 0) {
    return 0
  }

  return (seedIndex + Math.floor(Math.random() * length)) % length
}

function getNextSaveDateIndex(length: number, currentIndex: number) {
  if (length <= 1) {
    return 0
  }

  let nextIndex = currentIndex

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length)
  }

  return nextIndex
}

type SaveDateTileProps = {
  items: string[]
  showAsImage: boolean
  seedIndex: number
  onOpenImage?: (imageSrc: string) => void
}

function SaveDateTile({ items, showAsImage, seedIndex, onOpenImage }: SaveDateTileProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    getInitialSaveDateIndex(items.length, seedIndex),
  )
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      return
    }

    let cancelled = false
    let hideTimerId: number | undefined
    let swapTimerId: number | undefined

    const scheduleNextSwap = () => {
      hideTimerId = window.setTimeout(() => {
        if (cancelled) {
          return
        }

        setIsVisible(false)

        swapTimerId = window.setTimeout(() => {
          if (cancelled) {
            return
          }

          setCurrentIndex((current) => getNextSaveDateIndex(items.length, current))
          setIsVisible(true)
          scheduleNextSwap()
        }, SAVE_DATE_FADE_DURATION_MS)
      }, getRandomSaveDateDelay())
    }

    scheduleNextSwap()

    return () => {
      cancelled = true

      if (hideTimerId !== undefined) {
        window.clearTimeout(hideTimerId)
      }

      if (swapTimerId !== undefined) {
        window.clearTimeout(swapTimerId)
      }
    }
  }, [items.length])

  const currentItem = items[currentIndex % items.length] ?? ''

  return (
    <button
      type="button"
      className={`save-date-card${isVisible ? '' : ' is-hidden'}`}
      onClick={() => onOpenImage?.(currentItem)}
      disabled={!showAsImage || !onOpenImage}
      aria-label={`Open save the date image ${seedIndex + 1}`}
    >
      {showAsImage ? (
        <img
          src={currentItem}
          alt={`Save the date ${seedIndex + 1}`}
          className="save-date-photo"
          loading="lazy"
        />
      ) : (
        <div className="save-date-label">{currentItem}</div>
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
  const [showStickyRsvpButton, setShowStickyRsvpButton] = useState(true)
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
    if (activeSaveDateIndex === null) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSaveDateIndex(null)
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveSaveDateIndex((current) => {
          if (current === null || saveDateEntries.length === 0) {
            return current
          }

          return (current - 1 + saveDateEntries.length) % saveDateEntries.length
        })
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
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
  }, [activeSaveDateIndex])

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

  const openSaveDateViewer = (imageSrc: string) => {
    if (saveDateEntries.length === 0) {
      return
    }

    const nextIndex = saveDateEntries.findIndex((entry) => entry.src === imageSrc)
    setActiveSaveDateIndex(nextIndex >= 0 ? nextIndex : 0)
  }

  const closeSaveDateViewer = () => {
    setActiveSaveDateIndex(null)
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

      <section className="panel story" id="story">
        <h2>{siteData.story.title}</h2>
        <div className="story-grid">
          {siteData.story.chapters.map((chapter, index) => (
            <article
              key={chapter.title}
              className={`story-card${activeStoryIndex === index ? ' is-active' : ''}`}
              tabIndex={0}
              onPointerDown={(event) => {
                if (event.pointerType === 'touch') {
                  setActiveStoryIndex(index)
                }
              }}
              onPointerUp={(event) => {
                if (event.pointerType === 'touch') {
                  setActiveStoryIndex(null)
                }
              }}
              onPointerCancel={() => setActiveStoryIndex(null)}
              onPointerLeave={(event) => {
                if (event.pointerType === 'touch') {
                  setActiveStoryIndex(null)
                }
              }}
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
            </article>
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
                <h3>{item.title}</h3>
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
                    <img
                      src={formalEntry.src}
                      alt={`${section.title} formal sample`}
                      className="sample-photo"
                      loading="lazy"
                    />
                  ) : (
                    <span>{section.samples[0]}</span>
                  )}
                </figure>

                <div className="sample-stack">
                  {casualSampleEntries.slice(0, 2).map((sample, idx) => (
                    <figure className="sample-card sample-card--casual" key={`${section.title}-${sample.fileName}-${idx}`}>
                      <img
                        src={sample.src}
                        alt={`${section.title} casual sample ${idx + 1}`}
                        className="sample-photo"
                        loading="lazy"
                      />
                    </figure>
                  ))}
                </div>
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
                items={saveDateItems}
                showAsImage={saveDateUsesImages}
                seedIndex={idx}
                onOpenImage={saveDateUsesImages ? openSaveDateViewer : undefined}
              />
            ),
          )}
        </div>
      </section>

      <section className="panel entourage" id="entourage">
        <h2>{siteData.entourage.title}</h2>
        <div className="entourage-grid">
          {siteData.entourage.groups.map((group) => (
            <article key={group.title}>
              <h3>{group.title}</h3>
              {group.names.map((name) => (
                <p key={name}>{name}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="panel details" id="details">
        <h2>{siteData.details.title}</h2>
        <div className="info-grid">
          {siteData.details.items.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel faq" id="faq">
        <h2>{siteData.faqs.title}</h2>
        {siteData.faqs.items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
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

      {activeSaveDateEntry ? (
        <div className="image-viewer-backdrop" role="presentation" onClick={closeSaveDateViewer}>
          <div
            className="image-viewer"
            role="dialog"
            aria-modal="true"
            aria-label="Save the date image viewer"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="secondary image-viewer-close"
              onClick={closeSaveDateViewer}
              aria-label="Close image viewer"
            >
              Close
            </button>

            <button
              type="button"
              className="image-viewer-nav image-viewer-nav--prev"
              onClick={showPreviousSaveDateImage}
              aria-label="Previous image"
            >
              &lt;
            </button>

            <div className="image-viewer-frame">
              <img
                src={activeSaveDateEntry.src}
                alt={activeSaveDateEntry.fileName}
                className="image-viewer-image"
              />
              <div className="image-viewer-meta">
                <span>{activeSaveDateEntry.fileName}</span>
                <span>
                  {activeSaveDateViewerIndex + 1} / {saveDateEntries.length}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="image-viewer-nav image-viewer-nav--next"
              onClick={showNextSaveDateImage}
              aria-label="Next image"
            >
              &gt;
            </button>
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
