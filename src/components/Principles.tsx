const principles = [
  {
    number: 'I',
    title: 'Sovereignty over dependency',
    text: 'A person should retain a real exit path from the systems holding their context.',
    example: 'Move a memory object without losing its source, permissions, or revision trail.',
    consequence: 'Portability and revocation must exist in the data model, not only in account settings.',
    related: 'Knowledge Bubbles · CTP',
  },
  {
    number: 'II',
    title: 'Symbiosis over replacement',
    text: 'Intelligence should extend human judgment without quietly taking authority from the person.',
    example: 'An agent can propose an action while its inputs, role, and permission boundary remain visible.',
    consequence: 'Reasoning, memory, and action are separated into inspectable components.',
    related: 'CAPT · FrankenCAPT',
  },
  {
    number: 'III',
    title: 'Local-first by design',
    text: "Sensitive state should stay on the person's device whenever the product can function there.",
    example: 'SynSync renders its acoustic protocols in the browser rather than requiring an account workflow.',
    consequence: 'Useful local behavior must not depend on remote identity, storage, or telemetry.',
    related: 'SynSync · bioCAPT',
  },
  {
    number: 'IV',
    title: 'Proof before mythology',
    text: 'A compelling thesis never upgrades itself into evidence.',
    example: 'Every system record separates public links, curated claims, maturity, and known limitations.',
    consequence: 'Build validation can verify metadata integrity without claiming product efficacy or adoption.',
    related: 'Research · Documentation',
  },
]

export function Principles() {
  return (
    <section className="principles" id="principles" aria-labelledby="principles-title">
      <div className="section-heading principles-heading">
        <p className="section-index"><span>07</span> Operating principles</p>
        <h2 id="principles-title">Principles only matter when they change the architecture.</h2>
        <p>Each principle is paired with a human example, a technical consequence, and the records where it appears.</p>
      </div>
      <ol className="principles-list">
        {principles.map((principle) => (
          <li key={principle.title}>
            <span className="principle-number">{principle.number}</span>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
            <details>
              <summary>See the concrete consequence</summary>
              <dl>
                <div><dt>Example</dt><dd>{principle.example}</dd></div>
                <div><dt>Architecture consequence</dt><dd>{principle.consequence}</dd></div>
                <div><dt>Related records</dt><dd>{principle.related}</dd></div>
              </dl>
            </details>
          </li>
        ))}
      </ol>
    </section>
  )
}
