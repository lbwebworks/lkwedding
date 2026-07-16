import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <main className="site-shell">
      <section className="hero" id="home">
        <p className="eyebrow">Wedding Invitation</p>
        <h1>Liam & Kate</h1>
        <p className="date">Saturday, 28 November 2026</p>
        <p className="hero-copy">
          We are excited to celebrate our love with the people who matter most.
          Please join us for our wedding day.
        </p>
        <a className="cta" href="#rsvp">
          RSVP Now
        </a>
      </section>

      <section className="photo-band" aria-label="Prenup photo preview">
        <img src={heroImg} alt="Couple prenup preview" loading="lazy" />
      </section>

      <section className="details" id="details">
        <article>
          <h2>Ceremony</h2>
          <p>2:00 PM</p>
          <p>St. Mary Chapel</p>
        </article>
        <article>
          <h2>Reception</h2>
          <p>5:30 PM</p>
          <p>Garden Pavilion Hall</p>
        </article>
        <article>
          <h2>Dress Code</h2>
          <p>Formal</p>
          <p>Earth tones preferred</p>
        </article>
      </section>

      <section className="story" id="story">
        <h2>Our Story</h2>
        <p>
          From college friends to life partners, every chapter brought us closer
          to this day. We cannot wait to begin this new journey with you by our
          side.
        </p>
      </section>

      <section className="gallery" id="gallery">
        <h2>Photo Highlights</h2>
        <div className="gallery-grid">
          <div className="tile">Prenup 01</div>
          <div className="tile">Prenup 02</div>
          <div className="tile">Highlight 01</div>
          <div className="tile">Highlight 02</div>
        </div>
      </section>

      <section className="rsvp" id="rsvp">
        <h2>RSVP</h2>
        <p>
          RSVP form integration is ready for Google Forms. We can connect it in
          the next step.
        </p>
        <a className="secondary" href="#" aria-disabled="true">
          Google Form Link Placeholder
        </a>
      </section>
    </main>
  )
}

export default App
