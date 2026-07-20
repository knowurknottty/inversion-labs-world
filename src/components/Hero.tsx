export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

      <div className="hero-copy">
        <p className="section-index"><span>01</span> Human-governed memory infrastructure</p>
        <h1 id="hero-title">
          Your AI remembers.
          <span>You should control the memory.</span>
        </h1>
        <p className="hero-lede">
          Inversion Labs is developing portable, inspectable memory infrastructure that lets people understand,
          govern, and move the context used by intelligent systems.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#architecture">
            Enter the architecture <span aria-hidden="true">↓</span>
          </a>
          <a className="text-link" href="#thesis">See the inversion</a>
        </div>
      </div>

      <aside className="hero-specimen" aria-label="The core shift">
        <div className="specimen-header">
          <span>Core shift</span>
          <span>IL—00</span>
        </div>
        <div className="specimen-states">
          <div>
            <span className="state-marker state-marker-closed" aria-hidden="true" />
            <p>Outside the inversion</p>
            <strong>The system remembers you.</strong>
          </div>
          <div>
            <span className="state-marker state-marker-open" aria-hidden="true" />
            <p>Inside the inversion</p>
            <strong>You govern the memory.</strong>
          </div>
        </div>
        <p className="specimen-note">The distinction is authority: who can inspect, move, revise, and delete context.</p>
      </aside>

      <div className="hero-footer" aria-hidden="true">
        <span>Scroll to examine</span>
        <span className="hero-coordinate">Portable / Inspectable / Governed</span>
      </div>
    </section>
  )
}
