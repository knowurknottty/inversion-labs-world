export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top">
        <span className="wordmark-mark" aria-hidden="true">I/L</span>
        <span>Inversion Labs</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#synsync">SynSync</a>
        <a href="#architecture">Architecture</a>
        <a href="#principles">Principles</a>
      </nav>
      <details className="mobile-nav">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <a href="#work">What we build</a>
          <a href="#synsync">SynSync Pro</a>
          <a href="#thesis">Memory thesis</a>
          <a href="#architecture">Architecture</a>
          <a href="#principles">Principles</a>
        </nav>
      </details>
      <a className="header-cta" href="https://github.com/knowurknottty/inversion-labs-world">
        Source <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}
