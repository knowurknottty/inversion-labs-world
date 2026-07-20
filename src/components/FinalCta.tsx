interface CtaAction {
  rank: string;
  label: string;
  sub: string;
  href: string;
  primary?: boolean;
}

const ACTIONS: CtaAction[] = [
  {
    rank: '01',
    label: 'Open SynSync Pro',
    sub: 'No account. Opens now.',
    href: 'https://synsyncpro.netlify.app',
    primary: true,
  },
  {
    rank: '02',
    label: 'Inspect registry.json',
    sub: 'The raw source of truth for all ecosystem systems.',
    href: '/registry.json',
  },
  {
    rank: '03',
    label: 'Open a GitHub issue',
    sub: 'Found something wrong? The repo is public.',
    href: 'https://github.com/knowurknottty/inversion-labs-world/issues',
  },
];

export function FinalCta() {
  const buildDate = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : new Date().toISOString();
  return (
    <section className="section final-cta" id="participate" aria-labelledby="final-cta-title">
      <span className="section-index" aria-hidden="true">06</span>
      <div className="container">
        <p className="section-label">06 — Next steps</p>
        <h2 className="section-heading" id="final-cta-title">Where to go from here</h2>
        <div className="final-cta__actions">
          {ACTIONS.map((action) => (
            <a
              key={action.rank}
              href={action.href}
              className={`final-cta__action${action.primary ? ' final-cta__action--primary' : ''}`}
              target={action.href.startsWith('http') ? '_blank' : undefined}
              rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className="final-cta__action-rank">{action.rank}</span>
              <span className="final-cta__action-label">{action.label}</span>
              <span className="final-cta__action-sub">{action.sub}</span>
              <span className="final-cta__action-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
        <p className="final-cta__build-stamp">Last built: {buildDate}</p>
      </div>
    </section>
  );
}
