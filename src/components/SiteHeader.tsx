import { useState, useEffect, useCallback, useRef } from 'react';

interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Instrument', href: '#synsync', sectionId: 'synsync' },
  { label: 'The Inversion', href: '#memory-lens', sectionId: 'memory-lens' },
  { label: 'Ecosystem', href: '#ecosystem', sectionId: 'ecosystem' },
  { label: 'Architecture', href: '#architecture', sectionId: 'architecture' },
  { label: 'Principles', href: '#principles', sectionId: 'principles' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const handleMenuOpen = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
    menuBtnRef.current?.focus();
  }, []);

  const handleOverlayPointerDown = useCallback(() => {
    handleMenuClose();
  }, [handleMenuClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && menuOpen) {
      handleMenuClose();
    }
  }, [menuOpen, handleMenuClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.sectionId));
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      if (!section) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const allSections = document.querySelectorAll('section[id]');
    const totalSections = allSections.length;
    if (totalSections === 0) return;

    let visible = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible++;
          else visible = Math.max(0, visible - 1);
          setScrollProgress((visible / totalSections) * 100);
        });
      },
      { threshold: 0.1 }
    );

    allSections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="site-header" role="banner">
        <div
          className="site-header__progress"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
        <div className="site-header__inner">
          <a href="/" className="site-header__logo" aria-label="Inversion Labs — home">
            <span className="site-header__logo-mark" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <rect x="1" y="5" width="8" height="4" fill="currentColor" opacity="0.9" />
                <rect x="1" y="1" width="8" height="3" fill="currentColor" opacity="0.3" />
              </svg>
            </span>
            INVERSION LABS
          </a>

          <nav className="site-header__nav" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.sectionId}
                href={item.href}
                className="site-header__nav-link"
                aria-current={activeSection === item.sectionId ? 'true' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            ref={menuBtnRef}
            className="site-header__menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={handleMenuOpen}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="17" y2="6" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div
            className="site-header__mobile-nav"
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div
              className="site-header__mobile-overlay"
              onPointerDown={handleOverlayPointerDown}
              aria-hidden="true"
            />
            <nav className="site-header__mobile-panel">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.sectionId}
                  href={item.href}
                  className="site-header__mobile-link"
                  aria-current={activeSection === item.sectionId ? 'true' : undefined}
                  onClick={handleMenuClose}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
