const captPoints = [
  {
    title: 'Proof-governed skills',
    body: 'Verified procedure becomes a versioned, inspectable skill—only when the evidence exists. One success is not a capability.',
  },
  {
    title: 'ClaimGuard',
    body: 'Before reporting fixed, tested, or secure, CAPT checks whether the proof actually exists. Incomplete evidence downgrades the language.',
  },
  {
    title: 'Knowledge Bubbles',
    body: 'Portable, quarantine-first packages of claims, procedures, evidence, and provenance. Imported material is never trusted automatically.',
  },
  {
    title: 'Capability degradation',
    body: 'A skill verified on Linux can be degraded on macOS without global revocation. Scope is part of the truth.',
  },
]

export function CaptSolo() {
  return (
    <section className="capt-solo" id="capt" aria-labelledby="capt-title">
      <div className="section-heading capt-heading">
        <p className="section-index"><span>04</span> CAPT Solo v0.4.0</p>
        <h2 id="capt-title">Proof-governed intelligence infrastructure.</h2>
        <p>
          CAPT Solo v0.4.0 transforms verified experience into reusable capability—without confusing
          execution, confidence, and proof. Attempted, implemented, executed, passed, validated, proven,
          approved, and verified are not interchangeable states. The release makes those distinctions explicit.
        </p>
      </div>

      <div className="capt-grid">
        {captPoints.map((point) => (
          <article className="capt-card" key={point.title}>
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </article>
        ))}
      </div>

      <p className="capt-rule">
        <span>The standard</span> Intelligence should not merely be powerful. It should be accountable to evidence.
      </p>
    </section>
  )
}
