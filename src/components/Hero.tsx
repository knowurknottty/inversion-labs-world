export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

      <div className="hero-copy">
        <p className="section-index"><span>01</span> Inversion Labs / interactive field guide</p>
        <h1 id="hero-title">
          Intelligence should{' '}
          <span>answer to you.</span>
        </h1>
        <p className="hero-lede">
          We build local-first tools for memory, attention, and human–machine coordination. The work ranges from
          public products to early research; this field guide shows what exists, what is still a claim, and where the
          evidence can be inspected.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#evidence">
            Inspect the evidence <span aria-hidden="true">↓</span>
          </a>
          <a className="text-link" href="#systems">
            Explore 13 system records <span aria-hidden="true">→</span>
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
        <p className="specimen-note">The customer is never the product. That is the operating constraint.</p>
      </aside>

      <div className="hero-footer" aria-hidden="true">
        <span>Problem → proof → systems → architecture</span>
        <span className="hero-coordinate">No audience quiz. No custom controls required.</span>
      </div>
    </section>
  )
}
