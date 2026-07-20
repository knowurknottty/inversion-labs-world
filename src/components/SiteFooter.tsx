import { ecosystemSystems } from '../data/ecosystemData';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const firstChecked = ecosystemSystems[0]?.proof.url_last_checked ?? 'unknown';
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <strong>Inversion Labs</strong>
          © {year} Inversion Labs. One person. Birmingham, Alabama.
          <br />
          {ecosystemSystems.length} governed records
          <br />
          Registry last verified: {firstChecked}
        </div>
        <div className="site-footer__stats">
          <span className="site-footer__stat">Systems: <span>{ecosystemSystems.length}</span></span>
          <span className="site-footer__stat">Live: <span>{ecosystemSystems.filter((s) => s.maturity === 'live').length}</span></span>
          <span className="site-footer__stat">Accounts required: <span>0</span></span>
        </div>
        <nav className="site-footer__links" aria-label="Footer links">
          <a className="site-footer__link" href="https://github.com/knowurknottty/inversion-labs-world" target="_blank" rel="noopener noreferrer">Source repository</a>
          <a className="site-footer__link" href="/registry.json">Registry JSON</a>
          <a className="site-footer__link" href="/verification.json">Verification record</a>
          <a className="site-footer__link" href="https://synsyncpro.netlify.app" target="_blank" rel="noopener noreferrer">SynSync Pro</a>
        </nav>
      </div>
      <div className="container site-footer__bottom">
        Inversion Labs — local-first instruments. The customer is never the product.
      </div>
    </footer>
  );
}
