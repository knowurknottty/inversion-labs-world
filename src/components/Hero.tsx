export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

      <div className="hero-copy">
        <p className="section-index"><span>01</span> Inversion Labs — interactive field guide</p>
        <h1 id="hero-title">
          Intelligence should{' '}
          <span>answer to you.</span>
        </h1>
        <p className="hero-lede">
          We build local-first tools for memory, attention, and human–machine coordination.
          This field guide shows what is deployed and inspectable, what is still a claim,
          and where the evidence lives — so you can decide what to trust.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#evidence">
            Start with the evidence <span aria-hidden="true">↓</span>
          </a>
          <a className="text-link" href="#systems">
            Browse 13 system records <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <aside className="hero-specimen" aria-label="Inversion Labs operating constraint">
        <div className="specimen-header">
          <span>Operating constraint</span>
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
            <p>Attention</p>
            <strong>Your focus is not institutional property.</strong>
          </div>
        </div>
        <p className="specimen-note">
          The customer is never the product. That constraint shapes every architecture decision in this ecosystem.
        </p>
      </aside>

      <div className="hero-footer" aria-hidden="true">
        <span>Evidence → systems → architecture → principles</span>
        <span className="hero-coordinate">No account required. No telemetry. Open source.</span>
      </div>
    </section>
  )
}
