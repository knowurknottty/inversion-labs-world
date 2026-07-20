const sourceThreads = ['GATE', 'Gateway', 'Warfighter Optimization']

const productFacts = [
  'Open source',
  'Browser based',
  'Binaural + isochronic',
  'Evidence graded',
]

export function SynSyncProduct() {
  return (
    <section className="synsync-product" id="synsync" aria-labelledby="synsync-title">
      <div className="synsync-field" aria-hidden="true" />

      <div className="section-heading synsync-heading">
        <p className="section-index"><span>03</span> Live product / SynSync Pro</p>
        <h2 id="synsync-title">State technology, returned to the public.</h2>
        <p>
          SynSync Pro turns brainwave entrainment into an open, user-directed instrument. It is built to become the
          definitive public app in its category—without turning intimate human state into someone else&apos;s asset.
        </p>
      </div>

      <div className="synsync-console">
        <div className="synsync-signal" aria-hidden="true">
          <div className="signal-readout">
            <span>Signal / stereo differential</span>
            <span>Local render</span>
          </div>
          <svg viewBox="0 0 720 320" preserveAspectRatio="none">
            <path className="signal-grid" d="M0 80H720M0 160H720M0 240H720M90 0V320M180 0V320M270 0V320M360 0V320M450 0V320M540 0V320M630 0V320" />
            <path className="signal-wave signal-wave-a" d="M0 159 C30 38 60 38 90 159 S150 280 180 159 S240 38 270 159 S330 280 360 159 S420 38 450 159 S510 280 540 159 S600 38 630 159 S690 280 720 159" />
            <path className="signal-wave signal-wave-b" d="M0 159 C45 86 75 86 120 159 S195 232 240 159 S315 86 360 159 S435 232 480 159 S555 86 600 159 S675 232 720 159" />
          </svg>
          <div className="signal-axis">
            <span>Left</span>
            <span className="signal-pulse">Rendering</span>
            <span>Right</span>
          </div>
        </div>

        <div className="synsync-copy">
          <p className="product-kicker"><span aria-hidden="true" /> Live public product</p>
          <h3>SynSync Pro</h3>
          <p>
            A browser-based brainwave entrainment studio for exploring binaural and isochronic audio protocols, with
            visible evidence grades and audio generated on the listener&apos;s device.
          </p>
          <ul className="product-facts" aria-label="SynSync product characteristics">
            {productFacts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
          <a
            className="button synsync-button"
            href="https://synsyncpro.netlify.app"
            target="_blank"
            rel="noreferrer"
          >
            Open SynSync Pro <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="synsync-lower">
        <div className="lineage-panel" aria-labelledby="lineage-title">
          <div className="lineage-intro">
            <p className="product-kicker">The product inversion</p>
            <h3 id="lineage-title">Institutional research becomes a personal instrument.</h3>
          </div>
          <div className="lineage-flow">
            <ul aria-label="Source threads named in the Inversion Labs product thesis">
              {sourceThreads.map((thread, index) => (
                <li key={thread}>
                  <span>0{index + 1}</span>
                  <strong>{thread}</strong>
                </li>
              ))}
            </ul>
            <div className="lineage-turn" aria-hidden="true">
              <span>Invert</span>
              <i>→</i>
            </div>
            <div className="lineage-result">
              <span>Public / inspectable / user-directed</span>
              <strong>SynSync</strong>
            </div>
          </div>
          <p className="lineage-boundary">
            This lineage is Inversion Labs&apos; framing of the product thesis. It does not imply institutional affiliation,
            endorsement, or proof of efficacy.
          </p>
        </div>

        <blockquote className="customer-principle">
          <p>The customer is never the product.</p>
          <footer>Inversion Labs / line in the sand</footer>
        </blockquote>
      </div>

      <p className="synsync-safety">
        Brainwave entrainment is supportive, not medical treatment. Effects vary. Review protocol evidence and
        contraindications, keep volume comfortable, and stop if you feel unwell.
      </p>
    </section>
  )
}
