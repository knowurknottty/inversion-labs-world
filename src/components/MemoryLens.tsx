import { useState, useCallback } from 'react';

type OwnershipState = 'platform' | 'person';

interface ComparisonRow {
  dimension: string;
  platform: string;
  person: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    dimension: 'Portability',
    platform: 'Locked to platform storage format; deleted on account closure',
    person: 'Portable file you control, readable by any conforming reader',
  },
  {
    dimension: 'Provenance',
    platform: 'Write history is opaque — you cannot verify modification timeline',
    person: 'Every write carries a cryptographic timestamp; full change trail is inspectable',
  },
  {
    dimension: 'Revocation',
    platform: 'Submit deletion request and trust the platform honored it',
    person: 'Delete the file; access terminated at the object level, not account level',
  },
];

export function MemoryLens() {
  const [state, setState] = useState<OwnershipState>('platform');

  const setPlatform = useCallback(() => setState('platform'), []);
  const setPerson = useCallback(() => setState('person'), []);

  const stageDescription =
    state === 'platform'
      ? 'Memory object MEM/0137 is inside the application boundary, locked, inaccessible without platform authentication.'
      : 'Memory object MEM/0137 has moved outside the application boundary. Direct key access is active. Provenance trail is visible.';

  return (
    <section
      className="section memory-lens"
      id="memory-lens"
      aria-labelledby="memory-lens-heading"
      data-state={state}
    >
      <span className="section-index" aria-hidden="true">02</span>
      <div className="container">
        <p className="section-label">02 — The Inversion</p>
        <h2 className="section-heading" id="memory-lens-heading">
          What changes when you own the memory object
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '60ch', marginBottom: 'var(--space-5)' }}>
          Platforms store your context windows, conversation histories, and attention records
          inside their application boundary. When the account closes, the data is gone — or used.
          The inversion is structural: move the object outside the boundary and three things change
          in ways that are technically verifiable.
        </p>

        <div
          className="memory-lens__stage"
          role="img"
          aria-label={stageDescription}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Application boundary */}
          <div className="memory-lens__boundary">
            <span className="memory-lens__boundary-label" aria-hidden="true">
              APPLICATION BOUNDARY
            </span>
          </div>

          {/* YOU node */}
          <div className="memory-lens__you-node" aria-hidden="true">
            YOU
          </div>

          {/* Memory object */}
          <div className="memory-lens__object" aria-hidden="true">
            <span className="memory-lens__object-icon">
              {state === 'platform' ? '🔒' : '🔑'}
            </span>
            <span className="memory-lens__object-id">MEM/0137</span>
          </div>

          {/* Trail lines SVG */}
          <svg
            className="memory-lens__trails"
            viewBox="0 0 400 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="240" y1="100" x2="350" y2="100" stroke="var(--color-verified)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="240" y1="100" x2="350" y2="60" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="240" y1="100" x2="350" y2="140" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Toggle controls */}
        <div className="memory-lens__controls" role="group" aria-label="Ownership state toggle">
          <button
            className={`memory-lens__toggle${state === 'platform' ? ' is-active' : ''}`}
            onClick={setPlatform}
            aria-pressed={state === 'platform'}
            type="button"
          >
            <span className="memory-lens__toggle-pip" aria-hidden="true" />
            Platform owns it
          </button>
          <button
            className={`memory-lens__toggle${state === 'person' ? ' is-active' : ''}`}
            onClick={setPerson}
            aria-pressed={state === 'person'}
            type="button"
          >
            <span className="memory-lens__toggle-pip" aria-hidden="true" />
            You own it
          </button>
        </div>

        {/* Comparison table */}
        <table className="memory-lens__table" aria-label="Memory ownership comparison">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Platform owns it</th>
              <th scope="col">You own it</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.dimension}>
                <td>{row.dimension}</td>
                <td>{row.platform}</td>
                <td>{row.person}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
