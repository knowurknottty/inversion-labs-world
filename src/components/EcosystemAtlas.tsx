import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ecosystemSystems,
  evidenceLabel,
  evidenceTone,
  systemById,
  verifiedProofUrl,
} from '../data/ecosystem'
import type { EcosystemCategory, EcosystemSystem, SystemStage } from '../types'

const categories: Array<'All' | EcosystemCategory> = [
  'All',
  'Product',
  'Architecture',
  'Protocol',
  'Research program',
  'Field practice',
]

const stages: SystemStage[] = ['Concept', 'Open research', 'Active development', 'Living practice', 'Live']
const featuredIds = ['synsync', 'excursion', 'capt', 'biocapt', 'ctp', 'kb']

type ProofFilter = 'all' | 'verified' | 'curated'

const relationshipGroups = [
  ['depends_on', 'Depends on'],
  ['integrates_with', 'Integrates with'],
  ['related_to', 'Related to'],
  ['derived_from', 'Derived from'],
  ['optional_with', 'Optional with'],
] as const

function ProjectDetail({ system, onClose }: { system: EcosystemSystem; onClose: () => void }) {
  const detailRef = useRef<HTMLElement>(null)
  const proofUrl = verifiedProofUrl(system)

  useEffect(() => {
    detailRef.current?.focus()
  }, [system.id])

  return (
    <aside
      className="system-detail"
      id="system-detail"
      ref={detailRef}
      tabIndex={-1}
      aria-labelledby="system-detail-title"
    >
      <div className="detail-topline">
        <span>Governed project record</span>
        <button type="button" onClick={onClose} aria-label={`Close ${system.name} details`}>Close ×</button>
      </div>
      <p className="detail-status">
        <span className={`evidence-dot evidence-${evidenceTone(system)}`} aria-hidden="true" />
        {system.stage} · {evidenceLabel(system)}
      </p>
      <h3 id="system-detail-title">{system.name}</h3>
      <p className="detail-subtitle">{system.subtitle}</p>
      <p className="detail-plain">{system.inv.human}</p>

      <dl className="detail-ledger">
        <div><dt>Category</dt><dd>{system.category}</dd></div>
        <div><dt>Audience</dt><dd>{system.audience.join(', ')}</dd></div>
        <div><dt>Evidence record</dt><dd>{system.proof.exists}</dd></div>
        <div><dt>Documentation</dt><dd>{system.documentation_status}</dd></div>
        <div><dt>Tests</dt><dd>{system.test_status}</dd></div>
        <div><dt>License</dt><dd>{system.license}</dd></div>
        <div><dt>Maintainer</dt><dd>{system.maintainers.join(', ')}</dd></div>
      </dl>

      <div className="detail-shift">
        <div><span>Current pattern</span><p>{system.before}</p></div>
        <div><span>Intended inversion</span><p>{system.after}</p></div>
      </div>

      {(system.requires.length > 0 || system.provides.length > 0) && (
        <div className="detail-io">
          <div>
            <h4>Requires</h4>
            {system.requires.length > 0
              ? <ul>{system.requires.map((item) => <li key={item}>{item}</li>)}</ul>
              : <p>None declared.</p>}
          </div>
          <div>
            <h4>Provides</h4>
            {system.provides.length > 0
              ? <ul>{system.provides.map((item) => <li key={item}>{item}</li>)}</ul>
              : <p>None declared.</p>}
          </div>
        </div>
      )}

      <div className="detail-relations">
        <h4>Typed relationships</h4>
        {relationshipGroups.map(([key, label]) => {
          const ids = system[key]
          if (ids.length === 0) return null
          return (
            <p key={key}>
              <span>{label}:</span>{' '}
              {ids.map((id) => systemById.get(id)?.name ?? id).join(', ')}
            </p>
          )
        })}
      </div>

      <div className="detail-limit">
        <span>Known limitation</span>
        <p>{system.proof.limit ?? 'No limitation is recorded in the current public registry.'}</p>
      </div>

      {proofUrl ? (
        <a className="button button-primary" href={proofUrl} target="_blank" rel="noreferrer">
          Open verified public surface <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <p className="detail-no-link">
          No confirmed public link for this project. Nothing is presented as proof in its absence.
        </p>
      )}
    </aside>
  )
}

export function EcosystemAtlas() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const [proof, setProof] = useState<ProofFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null)

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matches = ecosystemSystems.filter((system) => {
      const matchesQuery = !normalizedQuery || [system.name, system.subtitle, system.role, system.category]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
      const matchesCategory = category === 'All' || system.category === category
      const matchesProof = proof === 'all'
        || (proof === 'verified' && system.proof.url_reachability === 'verified')
        || (proof === 'curated' && system.proof.url_reachability !== 'verified')
      return matchesQuery && matchesCategory && matchesProof
    })
    if (normalizedQuery || category !== 'All' || proof !== 'all') return matches
    return [...matches].sort((a, b) => {
      const aIndex = featuredIds.indexOf(a.id)
      const bIndex = featuredIds.indexOf(b.id)
      if (aIndex === -1 && bIndex === -1) return a.display_order - b.display_order
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
  }, [category, proof, query])

  const hasActiveFilter = query.trim() !== '' || category !== 'All' || proof !== 'all'
  const displayed = showAll || hasActiveFilter ? filtered : filtered.slice(0, 4)
  const selected = selectedId ? systemById.get(selectedId) ?? null : null

  const closeDetail = useCallback(() => {
    const trigger = detailTriggerRef.current
    setSelectedId(null)
    window.setTimeout(() => trigger?.focus(), 0)
  }, [])

  // Fix: proper dep array so this effect does not re-register on every render
  const handleEscapeClose = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') closeDetail()
  }, [closeDetail])

  useEffect(() => {
    if (!selectedId) return
    window.addEventListener('keydown', handleEscapeClose)
    return () => window.removeEventListener('keydown', handleEscapeClose)
  }, [selectedId, handleEscapeClose])

  return (
    <section className="ecosystem-atlas" id="systems" aria-labelledby="systems-title">
      <div className="section-heading atlas-heading">
        <p className="section-index"><span>04</span> Governed ecosystem registry</p>
        <h2 id="systems-title">Thirteen records. Different maturity levels. No blurred categories.</h2>
        <p>
          Products, protocols, architecture, research programs, and field practices are distinct things.
          This registry exposes the status, public proof, audience, relationships, and known limitations
          recorded for each system — unfiltered.
        </p>
      </div>

      <div className="maturity-map" aria-labelledby="maturity-title">
        <div className="maturity-intro">
          <p>Portfolio maturity</p>
          <h3 id="maturity-title">Breadth is not the same as readiness.</h3>
        </div>
        <ol>
          {stages.map((stage) => {
            const stageSystems = ecosystemSystems.filter((system) => system.stage === stage)
            return (
              <li key={stage}>
                <span>{stage}</span>
                <strong>{stageSystems.length}</strong>
                <p>{stageSystems.length > 0
                  ? stageSystems.map((system) => system.name).join(' · ')
                  : 'No public records at this stage'}
                </p>
              </li>
            )
          })}
        </ol>
        <p className="maturity-note">
          Counts are live — generated from the registry validated at every production build.
        </p>
      </div>

      <div className="atlas-controls" aria-label="Filter ecosystem records">
        <label>
          <span>Find a system</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search by name or role"
            aria-label="Search ecosystem systems"
          />
        </label>
        <label>
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}
            aria-label="Filter by category"
          >
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Public evidence</span>
          <select
            value={proof}
            onChange={(event) => setProof(event.target.value as ProofFilter)}
            aria-label="Filter by evidence level"
          >
            <option value="all">All records</option>
            <option value="verified">Verified public surface only</option>
            <option value="curated">Curated claims only</option>
          </select>
        </label>
        <p aria-live="polite" aria-atomic="true">
          Showing {displayed.length} of {filtered.length}{filtered.length !== ecosystemSystems.length ? ` filtered from ${ecosystemSystems.length}` : ''} records
        </p>
      </div>

      <div className={`atlas-workspace ${selected ? 'has-selection' : ''}`}>
        <div className="system-grid">
          {displayed.map((system, index) => (
            <article className="system-card" key={system.id} data-tone={evidenceTone(system)}>
              <div className="system-card-topline">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{system.category}</span>
              </div>
              <p className="system-evidence">
                <span className={`evidence-dot evidence-${evidenceTone(system)}`} aria-hidden="true" />
                {evidenceLabel(system)}
              </p>
              <h3>{system.name}</h3>
              <p>{system.subtitle}</p>
              <dl>
                <div><dt>Maturity</dt><dd>{system.stage}</dd></div>
                <div><dt>Public link</dt><dd>{system.proof.url_reachability === 'verified' ? 'Verified' : 'Not confirmed'}</dd></div>
              </dl>
              <button
                type="button"
                aria-controls="system-detail"
                aria-expanded={selectedId === system.id}
                onClick={(event) => {
                  detailTriggerRef.current = event.currentTarget
                  setSelectedId(system.id)
                }}
              >
                Inspect record <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="atlas-empty">
              <h3>No records match those filters.</h3>
              <button
                type="button"
                onClick={() => { setQuery(''); setCategory('All'); setProof('all') }}
              >
                Clear all filters
              </button>
            </div>
          )}
          {!hasActiveFilter && filtered.length > 4 && (
            <div className="atlas-reveal">
              <p>
                {showAll
                  ? 'All governed records are visible.'
                  : `${filtered.length - 4} additional records — architecture, research, protocol, and practice — are hidden.`
                }
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowAll((current) => !current)
                  setSelectedId(null)
                }}
              >
                {showAll ? 'Show featured records only' : `Show all ${filtered.length} records`}
              </button>
            </div>
          )}
        </div>
        {selected && <ProjectDetail system={selected} onClose={closeDetail} />}
      </div>
    </section>
  )
}
