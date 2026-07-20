import { useCallback, useEffect, useRef, useState } from 'react'

const NAV_ITEMS = [
  { href: '#evidence', label: 'Evidence' },
  { href: '#synsync', label: 'SynSync Pro' },
  { href: '#systems', label: 'Systems' },
  { href: '#thesis', label: 'The Inversion' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#principles', label: 'Principles' },
  { href: '#participate', label: 'Participate' },
] as const

const DESKTOP_NAV_HREFS = new Set(['#evidence', '#systems', '#architecture', '#participate'])

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (!menuOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen, closeMenu])

  return (
    <header className="site-header">
      <a className="wordmark" href="#top">
        <span className="wordmark-mark" aria-hidden="true">I/L</span>
        <span>Inversion Labs <small>Field guide</small></span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {NAV_ITEMS.filter((item) => DESKTOP_NAV_HREFS.has(item.href)).map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>

      <div className="mobile-nav" ref={navRef}>
        <button
          ref={toggleRef}
          type="button"
          className="mobile-nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>
        {menuOpen && (
          <nav
            id="mobile-nav-panel"
            className="mobile-nav-panel"
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>

      <a className="header-cta" href="https://github.com/knowurknottty/inversion-labs-world" target="_blank" rel="noreferrer">
        Source <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}
