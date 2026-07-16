import { useEffect } from 'react'
import heroImg from './assets/hero.png'
import { siteData } from './data/siteData'
import './App.css'

function App() {
  useEffect(() => {
    document.title = siteData.hero.title
  }, [])

  return (
    <main className="site-shell">
      <section className="hero" id="home">
        <p className="eyebrow">{siteData.hero.eyebrow}</p>
        <h1>{siteData.hero.title}</h1>
        <p className="date">{siteData.hero.date}</p>
        <p className="hero-copy">{siteData.hero.intro}</p>
        <a className="cta" href="#rsvp">
          {siteData.hero.ctaLabel}
        </a>
      </section>

      <section className="photo-band" aria-label="Prenup photo preview">
        <img src={heroImg} alt="Couple prenup preview" loading="lazy" />
      </section>

      <section className="details" id="details">
        {siteData.details.map((item) => (
          <article key={item.title}>
            <h2>{item.title}</h2>
            {item.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {item.mapUrl && item.mapLabel ? (
              <p>
                <a href={item.mapUrl} target="_blank" rel="noreferrer">
                  {item.mapLabel}
                </a>
              </p>
            ) : null}
          </article>
        ))}
      </section>

      <section className="story" id="story">
        <h2>{siteData.story.title}</h2>
        {siteData.story.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="gallery" id="gallery">
        <h2>{siteData.gallery.title}</h2>
        <div className="gallery-grid">
          {siteData.gallery.items.map((item) => (
            <div className="tile" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rsvp" id="rsvp">
        <h2>{siteData.rsvp.title}</h2>
        <p>{siteData.rsvp.description}</p>
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
    </main>
  )
}

export default App
