const sourceThreads = [
  { label: 'GATE', note: 'Hemi-Sync predecessor' },
  { label: 'Gateway Process', note: 'Monroe Institute / Army research' },
  { label: 'Warfighter Optimization', note: 'DoD attention and recovery protocols' },
]

const productFacts = [
  { text: 'Live public demo — no account required' },
  { text: 'Audio rendered locally in your browser' },
  { text: 'Binaural beats and isochronic tones' },
  { text: 'Inline evidence grades for every protocol' },
]

export function SynSyncProduct() {
  return (
    <section className="synsync-product" id="synsync" aria-labelledby="synsync-title">
      <div className="synsync-field" aria-hidden="true" />

      <div className="section-heading synsync-heading">
        <p className="section-index"><span>03</span> Live product — SynSync Pro</p>
        <h2 id="synsync-title">A working product you can open right now.</h2>
        <p>
          SynSync Pro is a browser-based brainwave entrainment studio. It turns acoustic
          protocols drawn from institutional research into a personal, inspectable instrument —
          one where the evidence grades, the audio source, and the processing chain are all visible.
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
            <span>Left channel</span>
            <span className="signal-pulse">Rendering locally</span>
            <span>Right channel</span>
          </div>
        </div>

        <div className="synsync-copy">
          <p className="product-kicker"><span aria-hidden="true" /> Live public product</p>
          <h3>SynSync Pro</h3>
          <p>
            Explore binaural and isochronic audio protocols with visible evidence grades.
            No account. No install. Your device renders the audio — it never leaves your machine.
          </p>
          <ul className="product-facts" aria-label="SynSync Pro product characteristics">
            {productFacts.map((fact) => <li key={fact.text}>{fact.text}</li>)}
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
        <details className="lineage-disclosure">
          <summary>
            <span>Research lineage referenced in the product thesis</span>
            <strong>GATE · Gateway · Warfighter Optimization</strong>
          </summary>
          <div className="lineage-panel" aria-labelledby="lineage-title">
            <div className="lineage-intro">
              <p className="product-kicker">The inversion</p>
              <h3 id="lineage-title">Institutional research made into a personal, inspectable instrument.</h3>
            </div>
            <div className="lineage-flow">
              <ul aria-label="Source research threads referenced in the Inversion Labs product thesis">
                {sourceThreads.map((thread, index) => (
                  <li key={thread.label}>
                    <span>0{index + 1}</span>
                    <strong>{thread.label}</strong>
                    <em>{thread.note}</em>
                  </li>
                ))}
              </ul>
              <div className="lineage-turn" aria-hidden="true">
                <span>Invert</span>
                <i>→</i>
              </div>
              <div className="lineage-result">
                <span>Public · inspectable · user-directed</span>
                <strong>SynSync Pro</strong>
              </div>
            </div>
            <p className="lineage-boundary">
              This lineage describes Inversion Labs&apos; framing of the product thesis only.
              It does not imply affiliation with, endorsement by, or reproduction of the cited
              programs. The product makes no medical claims.
            </p>
          </div>
        </details>

        <blockquote className="customer-principle">
          <p>The customer is never the product.</p>
          <footer>Inversion Labs — operating constraint</footer>
        </blockquote>
      </div>

      <p className="synsync-safety">
        Brainwave entrainment is a supportive practice, not medical treatment. Effects vary between
        individuals and are not clinically established for all use cases. Review the evidence grade
        displayed for each protocol, keep volume at a comfortable level, and stop if you feel unwell.
        Not suitable for people with epilepsy or seizure disorders without medical guidance.
      </p>
    </section>
  )
}
