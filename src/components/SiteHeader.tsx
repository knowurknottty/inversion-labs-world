import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '#lens', label: 'The Inversion' },
  { href: '#synsync', label: 'SynSync Pro' },
  { href: '#evidence', label: 'Evidence' },
  { href: '#atlas', label: 'Systems' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#principles', label: 'Principles' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`} role="banner">
      <a className="wordmark" href="#hero" aria-label="Inversion Labs — return to top">
        <span className="wordmark-mark" aria-hidden="true">
          <span className="wm-bracket wm-bracket--tl" />
          <span className="wm-bracket wm-bracket--tr" />
          <span className="wm-bracket wm-bracket--bl" />
          <span className="wm-bracket wm-bracket--br" />
          <span className="wm-glyph">I/L</span>
        </span>
        <span className="wordmark-text">Inversion Labs</span>
      </a>

      <nav className="site-nav" aria-label="Primary navigation">
        <ul role="list">
          {NAV_ITEMS.map(item => (
            <li key={item.href}>
              <a href={item.href} className="nav-link">{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        className="nav-toggle"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        onClick={() => setMenuOpen(o => !o)}
      >
        {menuOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {menuOpen && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          <ul role="list">
            {NAV_ITEMS.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
