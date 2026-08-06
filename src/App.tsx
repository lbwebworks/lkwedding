import { useEffect, useState } from 'react'
import fallbackHeroImg from './assets/hero.png'
import { weddingImageEntries, weddingImages } from './data/imageLibrary'
import { siteData } from './data/siteData'
import './App.css'

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

function App() {
  const [countdown, setCountdown] = useState(() =>
    getCountdownParts(siteData.hero.weddingDateISO),
  )

  useEffect(() => {
    document.title = siteData.hero.title
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(siteData.hero.weddingDateISO))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const heroImage = weddingImages.hero[0] ?? fallbackHeroImg
  const venueImages = weddingImageEntries.venue
  const saveDateItems =
    weddingImages.saveTheDate.length > 0
      ? weddingImages.saveTheDate
      : siteData.saveTheDate.photos
  const saveDateCards = [...saveDateItems, ...saveDateItems]

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

  const getDressImages = (title: string) => {
    const normalized = title.toLowerCase()
    if (normalized.includes('ladies')) {
      return weddingImages.dressLadies
    }
    return weddingImages.dressGentlemen
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
        <div className="hero-actions">
          <a className="cta" href="#rsvp">
            {siteData.hero.ctaLabel}
          </a>
          <a className="secondary" href="#details">
            View Details
          </a>
        </div>
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
          {siteData.calendar.weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="calendar-grid days">
          {siteData.calendar.dayCells.map((day, idx) => (
            <span
              key={`cell-${idx}-${day ?? 'empty'}`}
              className={day === siteData.calendar.highlightDay ? 'calendar-highlight' : ''}
            >
              {day ?? ''}
            </span>
          ))}
        </div>
      </section>

      <section className="panel story" id="story">
        <h2>{siteData.story.title}</h2>
        <div className="story-grid">
          {siteData.story.chapters.map((chapter, index) => (
            <article key={chapter.title} className="story-card">
              {weddingImageEntries.story.length > 0 ? (
                <img
                  src={pickStoryImage(chapter.title, index)}
                  alt={chapter.title}
                  className="story-photo"
                  loading="lazy"
                />
              ) : (
                <div className="placeholder-img">{chapter.imageLabel}</div>
              )}
              <div>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
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
          const dressImages = getDressImages(section.title)
          const sectionSamples = dressImages.length > 0 ? dressImages : section.samples

          return (
            <article key={section.title} className="dress-block">
            <h3>{section.title}</h3>
            <div className="swatches" aria-label={`${section.title} motif colors`}>
              {section.palette.map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </div>
            <p>{section.note}</p>
            <div className="sample-slider" aria-label={`${section.title} outfit samples`}>
              {sectionSamples.map((sample, idx) => (
                <div className="sample-card" key={`${section.title}-${idx}`}>
                  {dressImages.length > 0 ? (
                    <img
                      src={sample}
                      alt={`${section.title} sample ${idx + 1}`}
                      className="sample-photo"
                      loading="lazy"
                    />
                  ) : (
                    sample
                  )}
                </div>
              ))}
            </div>
            </article>
          )
        })}
      </section>

      <section className="panel venue" id="venue">
        <h2>{siteData.venue.title}</h2>
        <p className="eyebrow">{siteData.venue.subtitle}</p>
        <h3>{siteData.venue.name}</h3>
        <p>{siteData.venue.address}</p>
        {orderedVenueImages.length > 0 ? (
          <div className="venue-photo-list">
            {orderedVenueImages.map((entry, index) => {
              const caption = entry.fileName.toLowerCase().includes('church')
                ? 'Church'
                : entry.fileName.toLowerCase().includes('venue')
                  ? 'Reception Venue'
                  : `Location ${index + 1}`

              return (
                <figure key={entry.fileName} className="venue-photo-row">
                  <img src={entry.src} alt={caption} className="venue-photo-img" loading="lazy" />
                  <figcaption>{caption}</figcaption>
                </figure>
              )
            })}
          </div>
        ) : (
          <div className="placeholder-img venue-photo">{siteData.venue.photoLabel}</div>
        )}
        <a href={siteData.venue.mapUrl} target="_blank" rel="noreferrer">
          {siteData.venue.mapLabel}
        </a>
      </section>

      <section className="panel save-date" id="save-the-date">
        <h2>{siteData.saveTheDate.title}</h2>
        <p>{siteData.saveTheDate.subtitle}</p>
        <div className="save-date-slider" aria-label="Save the date gallery">
          <div className="save-date-track">
            {saveDateCards.map((photo, idx) => (
              <article className="save-date-card" key={`${photo}-${idx}`}>
                {weddingImages.saveTheDate.length > 0 ? (
                  <img
                    src={photo}
                    alt={`Save the date ${idx + 1}`}
                    className="save-date-photo"
                    loading="lazy"
                  />
                ) : (
                  photo
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel rsvp" id="rsvp">
        <h2>{siteData.rsvp.title}</h2>
        <p>{siteData.rsvp.description}</p>
        <p className="rsvp-deadline">{siteData.rsvp.deadline}</p>
        <a
          className="secondary"
          href={siteData.rsvp.buttonUrl}
          aria-disabled={siteData.rsvp.buttonDisabled}
          target={siteData.rsvp.buttonDisabled ? undefined : '_blank'}
          rel={siteData.rsvp.buttonDisabled ? undefined : 'noreferrer'}
        >
          {siteData.rsvp.buttonLabel}
        </a>
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

      <section className="panel closing" id="closing">
        <p className="eyebrow">{siteData.footer.line}</p>
        <h2>{siteData.footer.names}</h2>
        <p>{siteData.hero.date}</p>
      </section>
      </main>
    </>
  )
}

export default App
