import { useEffect, useRef, useState } from 'react';

const TERMINAL_LINES = [
  '> INVERSION LABS // LOCAL-FIRST INSTRUMENTS',
  '> operator: one person, Birmingham AL',
  '> constraint: the customer is never the product',
  '> status: 1 live deployment, 12 active systems',
  '> SynSync Pro: ONLINE',
];

const PROOF_CARDS = [
  { value: '1', label: 'Live instrument' },
  { value: 'I–IV', label: 'Evidence grades' },
  { value: '0', label: 'Accounts required' },
  { value: '100%', label: 'Local audio render' },
];

function useTerminalLines(lines: string[]) {
  const [visibleCount, setVisibleCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const INTERVAL_MS = 280;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisibleCount(lines.length);
      return;
    }

    function step(timestamp: number) {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed >= INTERVAL_MS && indexRef.current < lines.length) {
        indexRef.current += 1;
        setVisibleCount(indexRef.current);
        lastTimeRef.current = timestamp;
      }
      if (indexRef.current < lines.length) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [lines.length]);

  return visibleCount;
}

export function Hero() {
  const visibleCount = useTerminalLines(TERMINAL_LINES);

  return (
    <section className="hero" id="hero" aria-labelledby="hero-headline">
      <div
        className="hero__scanline"
        aria-label="Animated scan line — active signal monitor aesthetic"
        role="img"
      />
      <div className="container hero__layout">
        <div className="hero__copy">
          <p className="hero__eyebrow">Independent lab — Birmingham, Alabama</p>
          <h1 className="hero__headline" id="hero-headline">
            Every context window you feed an AI is stored, indexed, and{' '}
            <em>owned by the platform.</em>{' '}
            We build the alternative.
          </h1>
          <div className="hero__actions">
            <a
              href="https://synsyncpro.netlify.app"
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open SynSync Pro →
            </a>
            <a href="#ecosystem" className="btn btn--secondary">
              Inspect the registry
            </a>
          </div>
          <div className="hero__proof-row" aria-label="Proof surface metrics">
            {PROOF_CARDS.map((card) => (
              <div key={card.label} className="hero__proof-card">
                <span className="hero__proof-card-value">{card.value}</span>
                <span className="hero__proof-card-label">{card.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="hero__terminal"
          role="log"
          aria-label="System status readout"
          aria-live="polite"
          aria-atomic="false"
        >
          {TERMINAL_LINES.map((line, i) => (
            <span
              key={i}
              className={`hero__terminal-line${i < visibleCount ? ' is-visible' : ''}`}
              aria-hidden={i >= visibleCount ? 'true' : undefined}
            >
              {line}
              {'\n'}
            </span>
          ))}
          {visibleCount >= TERMINAL_LINES.length && (
            <span className="hero__terminal-cursor" aria-hidden="true" />
          )}
        </div>
      </div>
    </section>
  );
}
