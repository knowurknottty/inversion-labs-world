import { useState } from 'react';
import { useMemoryObject } from '../context/MemoryObject';

type Intent = null | 'experience' | 'understand' | 'contribute';

const INTENT_PATHS = {
  experience: [
    { label: 'Open SynSync Pro', href: 'https://synsync.pro', external: true },
    { label: 'Try the Lens demo', href: '#lens', external: false },
  ],
  understand: [
    { label: 'Read the Evidence Ledger', href: '#evidence', external: false },
    { label: 'Explore the Architecture', href: '#architecture', external: false },
    { label: 'Download registry.json', href: '/registry.json', external: false },
  ],
  contribute: [
    { label: 'View on GitHub', href: 'https://github.com/knowurknottty/inversion-labs-world', external: true },
    { label: 'Read the governance model', href: '/GOVERNANCE.md', external: false },
    { label: 'Verify CAPT protocol', href: '/capt-verification/protocol.md', external: false },
  ],
};

export function FinalCta() {
  const [intent, setIntent] = useState<Intent>(null);
  const { addEvent } = useMemoryObject();

  const handleIntent = (i: Intent) => {
    setIntent(i);
    if (i) addEvent('participate', `intent_selected_${i}`);
  };

  return (
    <section className="final-cta" id="participate" aria-labelledby="cta-title">
      <div className="cta-header">
        <p className="section-index"><span>Participate</span></p>
        <h2 id="cta-title">What brought you here?</h2>
        <p className="cta-subtitle">
          Choose what fits. Your path through what's next will match your intent.
        </p>
      </div>

      <div
        className="intent-selector"
        role="group"
        aria-label="Select your intent"
      >
        {(['experience', 'understand', 'contribute'] as NonNullable<Intent>[]).map(i => (
          <button
            key={i}
            className={`intent-option ${intent === i ? 'intent-option--active' : ''}`}
            onClick={() => handleIntent(i)}
            aria-pressed={intent === i}
          >
            <span className="intent-label">
              {i === 'experience' && 'I want to experience the product'}
              {i === 'understand' && 'I want to understand the architecture'}
              {i === 'contribute' && 'I want to contribute'}
            </span>
          </button>
        ))}
      </div>

      {intent && (
        <nav
          className="intent-paths"
          aria-label={`Paths for intent: ${intent}`}
        >
          {INTENT_PATHS[intent].map(path => (
            <a
              key={path.href}
              href={path.href}
              className="intent-path-link"
              {...(path.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {path.label}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-icon arrow-icon--right">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </nav>
      )}
    </section>
  );
}
