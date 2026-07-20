import { useState, useEffect } from 'react';
import { useMemoryObject } from '../context/MemoryObject';

type LensState = 'invisible' | 'platform' | 'person';

const LENS_COPY: Record<LensState, { headline: string; body: string; status: string }> = {
  invisible: {
    headline: 'Current default: memory is invisible.',
    body: 'Most people have never considered who owns their context. It accumulates silently inside platforms — building a model of you that you cannot inspect, export, or revoke.',
    status: 'UNBOUND / NO ENVELOPE',
  },
  platform: {
    headline: 'Platform owns it.',
    body: 'Your memory, attention patterns, and coordination history live inside application boundaries. You are the input. The model of you is the product.',
    status: 'CONTAINED / PLATFORM BOUNDARY',
  },
  person: {
    headline: 'You own it.',
    body: 'Memory travels with you. It is local-first, person-portable, and inspectable. The platform is a tool you use — not a container you live inside.',
    status: 'RELEASED / PERSON-PORTABLE',
  },
};

export function LensSection() {
  const [lens, setLens] = useState<LensState>('invisible');
  const { addEvent } = useMemoryObject();

  const handleLens = (state: LensState) => {
    setLens(state);
    addEvent('lens', `toggled_to_${state}`);
  };

  useEffect(() => {
    addEvent('lens', 'section_entered');
  }, [addEvent]);

  return (
    <section className="lens-section" id="lens" aria-labelledby="lens-title">
      <div className="lens-header">
        <p className="section-index"><span>Lens</span></p>
        <h2 id="lens-title">The Inversion</h2>
        <p className="lens-subtitle">
          Three states. One question: where does your context live?
        </p>
      </div>

      <div className="lens-stage" role="region" aria-label="Memory ownership demonstration">
        <div className={`lens-environment lens-environment--${lens}`}>
          <div className="lens-boundary-wall" aria-hidden="true">
            <span className="boundary-label">APPLICATION BOUNDARY</span>
          </div>

          <div className={`lens-object lens-object--${lens}`} aria-label="Memory object">
            <span className="corner-a" aria-hidden="true" />
            <span className="corner-b" aria-hidden="true" />
            <span className="corner-c" aria-hidden="true" />
            <span className="corner-d" aria-hidden="true" />
            <p className="lens-object-id">MEM / 0137</p>
            <p className="lens-object-status">{LENS_COPY[lens].status}</p>
          </div>
        </div>

        <div className="lens-copy-block">
          <h3 className="lens-copy-headline">{LENS_COPY[lens].headline}</h3>
          <p className="lens-copy-body">{LENS_COPY[lens].body}</p>
        </div>
      </div>

      <div
        className="lens-controls"
        role="group"
        aria-label="Select memory ownership state"
      >
        {(['invisible', 'platform', 'person'] as LensState[]).map(state => (
          <button
            key={state}
            className={`lens-toggle ${lens === state ? 'lens-toggle--active' : ''}`}
            onClick={() => handleLens(state)}
            aria-pressed={lens === state}
          >
            {state === 'invisible' && 'Current default'}
            {state === 'platform' && 'Platform owns it'}
            {state === 'person' && 'You own it'}
          </button>
        ))}
      </div>
    </section>
  );
}
