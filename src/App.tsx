import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <main className="site-shell">
      <section className="hero" id="home">
        <p className="eyebrow">Wedding Invitation</p>
        <h1>Lee & Kish</h1>
        <p className="date">September 20, 2026</p>
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
          <p>Iglesia Ni Cristo [Pampanga West] - Guagua</p>
          <p>
            <a href="https://maps.app.goo.gl/WDoNSbHdzsEnU5Kb8" target="_blank" rel="noreferrer">
              Open church map
            </a>
          </p>
        </article>
        <article>
          <h2>Reception</h2>
          <p>Casa Agustin Resort, Purok 1, Betis, Guagua, Pampanga, 2003</p>
          <p>
            <a href="https://maps.app.goo.gl/REeGgoan8pzyj46K8" target="_blank" rel="noreferrer">
              Open venue map
            </a>
          </p>
        </article>
        <article>
          <h2>Attire & Motif</h2>
          <p>Formal/Casual Attire</p>
          <p>Motif: Dusty Blue</p>
        </article>
      </section>

      <section className="story" id="story">
        <h2>Our Story</h2>
        <p>
          It started with a simple Instagram collaboration and a coffee meetup
          that felt ordinary at first, until it became the beginning of
          something far bigger. From casual conversations, Lee and Kish slowly
          turned into each other&apos;s favorite person and eventually into
          travel buddies chasing new places and new memories.
        </p>
        <p>
          Their journey was not all smooth roads. Distance, misunderstandings,
          and difficult seasons tested them more than once. There were moments
          when silence felt heavy, when timing was uncertain, and when giving up
          could have been easier. But they chose to stay. Through chats,
          late-night video calls, and patient hearts, they kept showing up for
          each other.
        </p>
        <p>
          Then came a series of firsts: first hike, first cave adventure, first
          beach escape, and first visits to each other&apos;s hometowns where
          families and friends became part of their growing world. Each chapter
          deepened their bond and quietly prepared them for what they did not see
          coming.
        </p>
        <p>
          In Baler, Aurora, under a bright sky with only a few people around,
          Kish thought they were only filming a short reel. The camera rolled,
          the moment felt routine, and then suddenly everything changed. Lee
          revealed a ring. Shock turned into tears, and an ordinary day became
          the day they would remember forever.
        </p>
        <p>
          Today, they stand stronger than ever, grateful for every challenge
          they overcame and every lesson that shaped them. As they prepare the
          final details for their wedding, they look forward to celebrating this
          new beginning with everyone they love.
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
