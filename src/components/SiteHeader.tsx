export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top">
        <span className="wordmark-mark" aria-hidden="true">I/L</span>
        <span>Inversion Labs <small>Inversion Excursion / field guide</small></span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#evidence">Evidence</a>
        <a href="#systems">Systems</a>
        <a href="#architecture">How it works</a>
        <a href="#participate">Participate</a>
      </nav>
      <details className="mobile-nav">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <a href="#evidence">Evidence</a>
          <a href="#synsync">SynSync Pro</a>
          <a href="#systems">All systems</a>
          <a href="#thesis">The inversion</a>
          <a href="#architecture">How memory works</a>
          <a href="#principles">Principles</a>
          <a href="#participate">Participate</a>
        </nav>
      </details>
      <a className="header-cta" href="https://github.com/knowurknottty/inversion-labs-world">
        Source <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}
