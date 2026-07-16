import { useEffect, useState } from 'react'
import fallbackHeroImg from './assets/hero.png'
import { weddingImages } from './data/imageLibrary'
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
  const venueImage = weddingImages.venue[0]
  const saveDateItems =
    weddingImages.saveTheDate.length > 0
      ? weddingImages.saveTheDate
      : siteData.saveTheDate.photos
  const marqueePhotos = [...saveDateItems, ...saveDateItems]

  const getDressImages = (title: string) => {
    const normalized = title.toLowerCase()
    if (normalized.includes('ladies')) {
      return weddingImages.dressLadies
    }
    return weddingImages.dressGentlemen
  }

  return (
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
        <img src={heroImage} alt="Couple prenup preview" loading="lazy" />
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
              {weddingImages.story.length > 0 ? (
                <img
                  src={weddingImages.story[index % weddingImages.story.length]}
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
        {venueImage ? (
          <img src={venueImage} alt={siteData.venue.name} className="venue-photo-img" loading="lazy" />
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
        <div className="marquee-wrap" aria-label="Save the date gallery">
          <div className="marquee-track">
            {marqueePhotos.map((photo, idx) => (
              <div className="marquee-item" key={`${photo}-${idx}`}>
                {weddingImages.saveTheDate.length > 0 ? (
                  <img
                    src={photo}
                    alt={`Save the date ${idx + 1}`}
                    className="marquee-photo"
                    loading="lazy"
                  />
                ) : (
                  photo
                )}
              </div>
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

      <section className="panel contacts" id="contacts">
        <h2>{siteData.contacts.title}</h2>
        <div className="info-grid">
          {siteData.contacts.items.map((item) => (
            <article key={item.role}>
              <h3>{item.role}</h3>
              <p>{item.name}</p>
              <p>{item.phone}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel faq" id="faq">
        <h2>{siteData.faqs.title}</h2>
        {siteData.faqs.items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>

      <section className="panel closing" id="closing">
        <p className="eyebrow">{siteData.footer.line}</p>
        <h2>{siteData.footer.names}</h2>
        <p>{siteData.hero.date}</p>
      </section>
    </main>
  )
}

export default App
