const principles = [
  {
    number: 'I',
    title: 'Portable',
    text: 'Memory should not be trapped inside one model or application. Its structure must survive movement.',
  },
  {
    number: 'II',
    title: 'Inspectable',
    text: 'People should be able to see what is stored, where it came from, and how an intelligent system used it.',
  },
  {
    number: 'III',
    title: 'Governed',
    text: 'Permissions, revisions, export, revocation, and deletion should remain available to the person.',
  },
  {
    number: 'IV',
    title: 'Traceable',
    text: 'Derived outputs should point back to the context and transformations that produced them.',
  },
]

export function Principles() {
  return (
    <section className="principles" id="principles" aria-labelledby="principles-title">
      <div className="section-heading principles-heading">
        <p className="section-index"><span>05</span> Operating principles</p>
        <h2 id="principles-title">Control needs structure, not a settings promise.</h2>
        <p>These are design requirements for the architecture under exploration—not claims of a finished standard.</p>
      </div>
      <ol className="principles-list">
        {principles.map((principle) => (
          <li key={principle.title}>
            <span className="principle-number">{principle.number}</span>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
