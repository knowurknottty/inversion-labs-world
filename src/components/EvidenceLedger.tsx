const proofSurfaces = [
  {
    type: 'Live product',
    title: 'SynSync Pro',
    status: 'Verified public deployment',
    description: 'A browser-based binaural and isochronic audio studio. Evidence grades are visible inline. No account, no install, audio rendered locally on your device.',
    href: 'https://synsyncpro.netlify.app',
    action: 'Open SynSync Pro',
  },
  {
    type: 'Live experience',
    title: 'Inversion Excursion',
    status: 'Verified public deployment',
    description: 'A seven-chapter interactive field guide with optional contemplative audio. Explores the same concepts this site documents, in a narrative format.',
    href: 'https://inversion-excursion.netlify.app',
    action: 'Open Inversion Excursion',
  },
  {
    type: 'Machine-readable record',
    title: 'Ecosystem registry',
    status: 'Schema-validated at every build',
    description: 'Thirteen governed project records. Each entry declares status, audience, relationships, provenance, public links, and known limitations in a single JSON file.',
    href: '/registry.json',
    action: 'Inspect registry JSON',
  },
  {
    type: 'Verification artifact',
    title: 'Build verification record',
    status: 'Generated at every build',
    description: 'A compact log of schema, relationship, provenance, and deployment-readiness checks that ran when this page was last built.',
    href: '/verification.json',
    action: 'Inspect verification record',
  },
]

export function EvidenceLedger() {
  return (
    <section className="evidence-ledger" id="evidence" aria-labelledby="evidence-title">
      <div className="evidence-heading">
        <p className="section-index"><span>02</span> Proof before mythology</p>
        <h2 id="evidence-title">Start with what can be opened — not what must be believed.</h2>
        <p>
          Inversion Labs spans products, research, protocols, and architecture. Only public,
          inspectable artifacts are presented here as proof. Everything else is a claim with
          an explicit maturity level and a recorded limitation.
        </p>
      </div>

      <div className="proof-summary" aria-label="Current public proof summary">
        <div><strong>2</strong><span>verified public deployments</span></div>
        <div><strong>13</strong><span>governed project records</span></div>
        <div><strong>1</strong><span>public source repository</span></div>
        <p>
          These counts describe inspectable artifacts — not users, clinical outcomes, efficacy claims, or institutional adoption.
        </p>
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
            <a
              href={surface.href}
              target={surface.href.startsWith('http') ? '_blank' : undefined}
              rel={surface.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              {surface.action} <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>

      <div className="proof-boundary">
        <div>
          <span>What you can verify today</span>
          <p>
            Two deployed experiences you can open right now. A governed metadata registry
            validated at build time. A source repository you can clone and run locally.
            A verification record generated at every build.
          </p>
        </div>
        <div>
          <span>What is not established here</span>
          <p>
            Clinical efficacy. Independent reproduction. Institutional affiliation or endorsement.
            User scale or adoption metrics. Production maturity for every project in the registry.
          </p>
        </div>
      </div>
    </section>
  )
}
