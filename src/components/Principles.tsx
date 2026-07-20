const principles = [
  {
    number: 'I',
    title: 'Sovereignty over dependency',
    text: 'A person should hold a real exit path from any system that stores their context — not a settings toggle, a full data portability guarantee.',
    example: 'Move a memory object across platforms without losing its source, permissions, or revision trail.',
    consequence: 'Portability and revocation must be modeled in the data layer, not bolted on as an account feature.',
    related: 'Knowledge Bubbles · CTP',
  },
  {
    number: 'II',
    title: 'Symbiosis over replacement',
    text: 'Intelligence should extend human judgment. When an agent quietly assumes authority, that is not assistance — it is substitution.',
    example: 'An agent proposes an action while its inputs, role, and permission boundary remain visible and overridable.',
    consequence: 'Reasoning, memory, and action are separated into individually inspectable components.',
    related: 'CAPT · FrankenCAPT',
  },
  {
    number: 'III',
    title: 'Local-first by design',
    text: "Sensitive state belongs on the person's device whenever the product can function there. Remote sync is opt-in, not the default.",
    example: 'SynSync Pro renders its full audio processing chain in the browser with no account, no remote call, no telemetry.',
    consequence: 'Useful local behavior must not depend on remote identity, storage, or telemetry pipelines.',
    related: 'SynSync · bioCAPT',
  },
  {
    number: 'IV',
    title: 'Proof before mythology',
    text: 'A compelling thesis never upgrades itself into evidence. Maturity levels and known limitations are stated explicitly — not softened.',
    example: 'Every registry entry separates verified public links from curated claims and records its known limit in a single field.',
    consequence: 'Build validation can check metadata integrity without claiming product efficacy, safety, or adoption.',
    related: 'Ecosystem registry · Verification record',
  },
]

export function Principles() {
  return (
    <section className="principles" id="principles" aria-labelledby="principles-title">
      <div className="section-heading principles-heading">
        <p className="section-index"><span>07</span> Operating principles</p>
        <h2 id="principles-title">A principle that does not change the architecture is decoration.</h2>
        <p>
          Each principle is grounded in a human-legible example, a concrete architecture consequence,
          and the registry records where that consequence is actually visible.
        </p>
      </div>
      <ol className="principles-list">
        {principles.map((principle) => (
          <li key={principle.title}>
            <span className="principle-number">{principle.number}</span>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
            <details>
              <summary>See how this principle changes the architecture</summary>
              <dl>
                <div><dt>Example</dt><dd>{principle.example}</dd></div>
                <div><dt>Architecture consequence</dt><dd>{principle.consequence}</dd></div>
                <div><dt>Visible in</dt><dd>{principle.related}</dd></div>
              </dl>
            </details>
          </li>
        ))}
      </ol>
    </section>
  )
}
