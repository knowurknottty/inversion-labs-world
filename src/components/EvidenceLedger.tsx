const proofSurfaces = [
  {
    type: 'Live product',
    title: 'SynSync Pro',
    status: 'Verified public deployment',
    description: 'A browser-based binaural and isochronic audio studio with evidence grades and no required account.',
    href: 'https://synsyncpro.netlify.app',
    action: 'Open product',
  },
  {
    type: 'Live experience',
    title: 'Inversion Excursion',
    status: 'Verified public deployment',
    description: 'A seven-chapter interactive field experience with optional contemplative audio.',
    href: 'https://inversion-excursion.netlify.app',
    action: 'Open experience',
  },
  {
    type: 'Machine-readable record',
    title: 'Ecosystem registry',
    status: 'Validated during build',
    description: 'Thirteen governed project records containing status, relationships, provenance, links, and known limits.',
    href: '/registry.json',
    action: 'Inspect JSON',
  },
  {
    type: 'Verification artifact',
    title: 'Build verification',
    status: 'Generated during build',
    description: 'A compact record of schema, relationship, provenance, test, and deployment-readiness checks.',
    href: '/verification.json',
    action: 'Inspect record',
  },
]

export function EvidenceLedger() {
  return (
    <section className="evidence-ledger" id="evidence" aria-labelledby="evidence-title">
      <div className="evidence-heading">
        <p className="section-index"><span>02</span> Proof before mythology</p>
        <h2 id="evidence-title">Start with what can be opened—not what must be believed.</h2>
        <p>
          Inversion Labs spans products, research, protocols, and architecture. Only public, inspectable artifacts are
          presented here as proof. Everything else remains a claim with an explicit maturity and limitation record.
        </p>
      </div>

      <div className="proof-summary" aria-label="Current public proof summary">
        <div><strong>2</strong><span>verified public experiences</span></div>
        <div><strong>13</strong><span>governed project records</span></div>
        <div><strong>1</strong><span>public source repository</span></div>
        <p>Counts describe inspectable artifacts—not users, outcomes, efficacy, or institutional adoption.</p>
      </div>

      <div className="proof-surfaces">
        {proofSurfaces.map((surface) => (
          <article key={surface.title}>
            <div className="proof-card-topline">
              <span>{surface.type}</span>
              <span><i aria-hidden="true" /> {surface.status}</span>
            </div>
            <h3>{surface.title}</h3>
            <p>{surface.description}</p>
            <a href={surface.href} target={surface.href.startsWith('http') ? '_blank' : undefined} rel={surface.href.startsWith('http') ? 'noreferrer' : undefined}>
              {surface.action} <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>

      <div className="proof-boundary">
        <div>
          <span>Visible now</span>
          <p>Deployed experiences, governed metadata, source code, limitations, and build-generated verification.</p>
        </div>
        <div>
          <span>Not established here</span>
          <p>Clinical efficacy, independent reproduction, institutional affiliation, user scale, or production maturity for every project.</p>
        </div>
      </div>
    </section>
  )
}
