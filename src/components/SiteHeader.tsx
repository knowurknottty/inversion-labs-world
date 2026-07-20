export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top">
        <span className="wordmark-mark" aria-hidden="true">I/L</span>
        <span>Inversion Labs</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#thesis">Thesis</a>
        <a href="#architecture">Architecture</a>
        <a href="#synsync">SynSync</a>
        <a href="#principles">Principles</a>
      </nav>
      <a className="header-cta" href="https://github.com/knowurknottty/inversion-labs-world">
        View source <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}
