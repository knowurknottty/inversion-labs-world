export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

      <div className="hero-copy">
        <p className="section-index"><span>01</span> Human-governed intelligence + state technology</p>
        <h1 id="hero-title">
          Technology is getting personal.
          <span>Authority should stay with the person.</span>
        </h1>
        <p className="hero-lede">
          Inversion Labs builds portable AI memory infrastructure and public state tools that remain inspectable,
          user-directed, and answerable to the person using them.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">
            See what we build <span aria-hidden="true">↓</span>
          </a>
          <a className="text-link" href="https://synsyncpro.netlify.app" target="_blank" rel="noreferrer">
            Open SynSync Pro <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <aside className="hero-specimen" aria-label="The Inversion Labs operating rule">
        <div className="specimen-header">
          <span>Operating rule</span>
          <span>IL—00</span>
        </div>
        <div className="specimen-states">
          <div>
            <span className="state-marker state-marker-closed" aria-hidden="true" />
            <p>Memory</p>
            <strong>Your context is not platform inventory.</strong>
          </div>
          <div>
            <span className="state-marker state-marker-open" aria-hidden="true" />
            <p>State</p>
            <strong>Your attention is not institutional property.</strong>
          </div>
        </div>
        <p className="specimen-note">The customer is never the product. That is the common architecture.</p>
      </aside>

      <div className="hero-footer" aria-hidden="true">
        <span>Scroll to examine</span>
        <span className="hero-coordinate">Memory / Attention / State / Authority</span>
      </div>
    </section>
  )
}
