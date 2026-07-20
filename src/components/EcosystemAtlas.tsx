import { useState, useEffect, useCallback, useRef } from 'react';
import { ecosystemSystems } from '../data/ecosystemData';
import type { EcosystemSystemAdapted, MaturityStage } from '../data/ecosystemData';

const MATURITY_STAGES: { stage: MaturityStage; label: string; color: string }[] = [
  { stage: 'concept', label: 'Concept', color: 'var(--color-maturity-concept)' },
  { stage: 'open-research', label: 'Open research', color: 'var(--color-maturity-open-research)' },
  { stage: 'active-development', label: 'Active development', color: 'var(--color-maturity-active-development)' },
  { stage: 'living-practice', label: 'Living practice', color: 'var(--color-maturity-living-practice)' },
  { stage: 'live', label: 'Live', color: 'var(--color-maturity-live)' },
];

const ONBOARDING_KEY = 'il_ecosystem_onboarding_seen';

function MaturityBar({ systems }: { systems: EcosystemSystemAdapted[] }) {
  const total = systems.length;
  if (total === 0) return null;

  const counts = MATURITY_STAGES.map(({ stage }) =>
    systems.filter((s) => s.maturity === stage).length
  );

  return (
    <div>
      <div
        className="ecosystem-atlas__maturity-bar"
        role="img"
        aria-label={`Maturity distribution: ${MATURITY_STAGES.map(({ label }, i) => `${counts[i] ?? 0} ${label}`).join(', ')}`}
      >
        {MATURITY_STAGES.map(({ stage, color }, i) => {
          const count = counts[i] ?? 0;
          if (count === 0) return null;
          return (
            <div
              key={stage}
              className="ecosystem-atlas__maturity-segment"
              data-stage={stage}
              style={{ flex: count / total, background: color }}
              title={`${MATURITY_STAGES[i]?.label}: ${count}`}
            />
          );
        })}
      </div>
      <div className="ecosystem-atlas__maturity-legend" aria-hidden="true">
        {MATURITY_STAGES.map(({ stage, label, color }, i) => {
          const count = counts[i] ?? 0;
          if (count === 0) return null;
          return (
            <span key={stage} className="ecosystem-atlas__legend-item">
              <span className="ecosystem-atlas__legend-dot" style={{ background: color }} />
              {label} ({count})
            </span>
          );
        })}
      </div>
    </div>
  );
}

function SystemCard({
  system,
  onSelect,
}: {
  system: EcosystemSystemAdapted;
  onSelect: (s: EcosystemSystemAdapted) => void;
}) {
  const handleClick = useCallback(() => onSelect(system), [system, onSelect]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(system);
      }
    },
    [system, onSelect]
  );

  const stageInfo = MATURITY_STAGES.find((m) => m.stage === system.maturity);

  return (
    <article
      className="ecosystem-atlas__card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${system.name}: ${system.tagline}. Maturity: ${stageInfo?.label ?? system.maturity}. Click to view details.`}
    >
      <div
        className="ecosystem-atlas__card-accent"
        style={{ background: system.color }}
        aria-hidden="true"
      />
      <div className="ecosystem-atlas__card-body">
        <h3 className="ecosystem-atlas__card-name">{system.name}</h3>
        <p className="ecosystem-atlas__card-tagline">{system.tagline}</p>
        <div className="ecosystem-atlas__card-meta">
          {system.evidenceTone === 'verified' && (
            <span
              className="ecosystem-atlas__verified-dot"
              title="Verified public surface"
              aria-label="Verified: public surface reachable"
            />
          )}
          <span
            className="ecosystem-atlas__maturity-badge"
            style={{
              background: `color-mix(in srgb, ${stageInfo?.color ?? '#888'} 15%, transparent)`,
              color: stageInfo?.color ?? '#888',
              border: `1px solid color-mix(in srgb, ${stageInfo?.color ?? '#888'} 30%, transparent)`,
            }}
          >
            {stageInfo?.label ?? system.maturity}
          </span>
        </div>
      </div>
    </article>
  );
}

function ProjectDetail({
  system,
  onClose,
}: {
  system: EcosystemSystemAdapted;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const stageInfo = MATURITY_STAGES.find((m) => m.stage === system.maturity);

  return (
    <>
      <div
        className="ecosystem-atlas__drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="ecosystem-atlas__drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <button
          ref={closeRef}
          className="ecosystem-atlas__drawer-close"
          onClick={onClose}
          aria-label="Close detail panel"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>

        <div
          style={{
            width: 8, height: 8, borderRadius: '50%',
            background: system.color, marginBottom: 'var(--space-4)',
          }}
          aria-hidden="true"
        />
        <h2 id="drawer-title" style={{ marginBottom: 'var(--space-2)' }}>{system.name}</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-5)' }}>
          {system.tagline}
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-5)' }}>
          {system.description}
        </p>
        <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <dt style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
              Maturity
            </dt>
            <dd style={{ color: stageInfo?.color ?? 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
              {stageInfo?.label ?? system.maturity}
            </dd>
          </div>
          <div>
            <dt style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
              Evidence Level
            </dt>
            <dd style={{ color: 'var(--color-verified)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
              {system.proof.level}
            </dd>
          </div>
        </dl>
        <a
          href={system.proof.open}
          className="btn btn--primary"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 'var(--space-6)', width: '100%', justifyContent: 'center' }}
        >
          Open {system.name} →
        </a>
      </aside>
    </>
  );
}

export function EcosystemAtlas() {
  const [activeFilter, setActiveFilter] = useState<MaturityStage | 'all'>('all');
  const [selectedSystem, setSelectedSystem] = useState<EcosystemSystemAdapted | null>(null);
  const [onboardingSeen, setOnboardingSeen] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) setOnboardingSeen(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('maturity') as MaturityStage | null;
    if (filter) setActiveFilter(filter);
  }, []);

  const handleFilterChange = useCallback((stage: MaturityStage | 'all') => {
    setActiveFilter(stage);
    const params = new URLSearchParams(window.location.search);
    if (stage === 'all') {
      params.delete('maturity');
    } else {
      params.set('maturity', stage);
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, []);

  const filteredSystems = activeFilter === 'all'
    ? ecosystemSystems
    : ecosystemSystems.filter((s) => s.maturity === activeFilter);

  return (
    <section className="section" id="ecosystem" aria-labelledby="ecosystem-heading">
      <span className="section-index" aria-hidden="true">03</span>
      <div className="container">
        <p className="section-label">03 — Ecosystem registry</p>
        <h2 className="section-heading" id="ecosystem-heading">
          {ecosystemSystems.length} governed systems
        </h2>
        {!onboardingSeen && (
          <p className="text-muted" style={{ marginBottom: 'var(--space-5)', fontSize: '0.875rem' }}>
            This registry tracks every system Inversion Labs is building or researching.
            Maturity levels are evidence-based: Live means deployed and publicly accessible;
            Concept means a design exists but no code has shipped.
          </p>
        )}
        <MaturityBar systems={ecosystemSystems} />
        <div className="ecosystem-atlas__filters" role="group" aria-label="Filter by maturity">
          <button
            className={`ecosystem-atlas__filter-btn${activeFilter === 'all' ? ' is-active' : ''}`}
            onClick={() => handleFilterChange('all')}
            aria-pressed={activeFilter === 'all'}
            type="button"
          >
            All
          </button>
          {MATURITY_STAGES.map(({ stage, label }) => (
            <button
              key={stage}
              className={`ecosystem-atlas__filter-btn${activeFilter === stage ? ' is-active' : ''}`}
              onClick={() => handleFilterChange(stage)}
              aria-pressed={activeFilter === stage}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ecosystem-atlas__grid">
          {filteredSystems.map((system) => (
            <SystemCard key={system.id} system={system} onSelect={setSelectedSystem} />
          ))}
        </div>
        <p className="text-muted" style={{ marginTop: 'var(--space-6)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          Registry data is maintained manually. Count accuracy is only as current as the last verified build date shown in the footer.
        </p>
      </div>
      {selectedSystem && (
        <ProjectDetail system={selectedSystem} onClose={() => setSelectedSystem(null)} />
      )}
    </section>
  );
}
