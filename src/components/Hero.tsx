import { useEffect } from 'react';
import { useMemoryObject } from '../context/MemoryObject';

export function Hero() {
  const { addEvent } = useMemoryObject();

  useEffect(() => {
    addEvent('hero', 'section_entered');
  }, [addEvent]);

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-copy">
        <p className="section-index" aria-label="Section threshold">
          <span>Threshold</span>
        </p>

        <h1 id="hero-title" className="hero-h1">
          <span className="hero-h1-word hero-h1-word--1">Your</span>{' '}
          <span className="hero-h1-word hero-h1-word--2">context</span>{' '}
          <span className="hero-h1-word hero-h1-word--3">is</span>{' '}
          <span className="hero-h1-word hero-h1-word--4">not</span>{' '}
          <span className="hero-h1-word hero-h1-word--5">platform</span>{' '}
          <span className="hero-h1-word hero-h1-word--6">inventory.</span>
        </h1>

        <p className="hero-lede">
          Most AI tools own your context the moment you use them.
          Inversion Labs builds instruments that keep memory, attention, and
          coordination under your control — locally, verifiably, inspectably.
        </p>

        <p className="hero-lede hero-lede--secondary">
          This field guide shows what is deployed and inspectable, what is
          still a claim, and where the evidence lives — so you can decide
          what to trust.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#evidence">
            Start with the evidence
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-icon">
              <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a className="text-link" href="#lens">
            See the inversion
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-icon arrow-icon--right">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <aside className="hero-specimen" aria-label="Memory object specimen: IL—00">
        <div className="specimen-envelope specimen-envelope--arriving">
          <div className="specimen-corner specimen-corner--tl" aria-hidden="true" />
          <div className="specimen-corner specimen-corner--tr" aria-hidden="true" />
          <div className="specimen-corner specimen-corner--bl" aria-hidden="true" />
          <div className="specimen-corner specimen-corner--br" aria-hidden="true" />
          <p className="specimen-type">MEMORY OBJECT</p>
          <p className="specimen-id">IL — 00</p>
          <dl className="specimen-meta">
            <div className="specimen-meta-row">
              <dt>status</dt>
              <dd className="specimen-status">arriving</dd>
            </div>
            <div className="specimen-meta-row">
              <dt>origin</dt>
              <dd>local session</dd>
            </div>
            <div className="specimen-meta-row">
              <dt>constraint</dt>
              <dd>person-portable</dd>
            </div>
            <div className="specimen-meta-row">
              <dt>platform claim</dt>
              <dd className="specimen-denied">denied</dd>
            </div>
          </dl>
          <p className="specimen-inversion">Intelligence should answer to you.</p>
        </div>
      </aside>

      <p className="hero-wayfinding" aria-label="Page structure">
        Evidence <span aria-hidden="true">→</span> Lens <span aria-hidden="true">→</span> SynSync <span aria-hidden="true">→</span> Atlas <span aria-hidden="true">→</span> Architecture <span aria-hidden="true">→</span> Principles
      </p>
    </section>
  );
}
