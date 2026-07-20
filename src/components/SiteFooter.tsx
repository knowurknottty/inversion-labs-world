const FOOTER_NAV = [
  { href: '#evidence', label: 'Evidence' },
  { href: '#systems', label: 'Systems' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#principles', label: 'Principles' },
  { href: '#participate', label: 'Participate' },
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <a className="wordmark" href="#top">
          <span className="wordmark-mark" aria-hidden="true">I/L</span>
          <span>Inversion Labs</span>
        </a>
        <nav aria-label="Footer navigation">
          {FOOTER_NAV.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <p>
          Inversion Excursion is the interactive field guide to the Inversion Labs ecosystem.
          No tracking. No analytics. Source available on{' '}
          <a href="https://github.com/knowurknottty/inversion-labs-world" target="_blank" rel="noreferrer">GitHub</a>.
        </p>
        <p className="footer-build">
          Built local-first. &copy; {new Date().getFullYear()} Inversion Labs.
        </p>
      </div>
      <a className="footer-return" href="#top">Back to top ↑</a>
    </footer>
  )
}
