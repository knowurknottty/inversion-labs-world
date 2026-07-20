import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  architectureConnections,
  architectureNodes,
  depthDefinitions,
  getNode,
  museumStops,
  nodeTypeLabels,
} from '../data/architectureData'
import type { ArchitectureNode } from '../types'

type InspectorTab = 'overview' | 'provenance' | 'governance'

interface InspectorProps {
  node: ArchitectureNode
  tab: InspectorTab
  content: string
  isEditing: boolean
  onTabChange: (tab: InspectorTab) => void
  onClose: () => void
  onExport: () => void
  onEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: (value: string) => void
}

function Inspector({
  node,
  tab,
  content,
  isEditing,
  onTabChange,
  onClose,
  onExport,
  onEdit,
  onCancelEdit,
  onSaveEdit,
}: InspectorProps) {
  const [draft, setDraft] = useState(content)
  const inspectorTabs: InspectorTab[] = ['overview', 'provenance', 'governance']

  useEffect(() => setDraft(content), [content, node.id])

  return (
    <aside className="arch-explorer__inspector" aria-labelledby="inspector-title">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`node-glyph type-${node.type}`} aria-hidden="true" />
        <button type="button" className="text-button" onClick={onClose} aria-label="Close inspector">×</button>
      </div>
      <h3 id="inspector-title" style={{ margin: 'var(--space-3) 0' }}>{node.label}</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>{nodeTypeLabels[node.type]}</p>

      <div className="ecosystem-atlas__filters" role="tablist" aria-label="Object detail" style={{ marginTop: 'var(--space-4)' }}>
        {inspectorTabs.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            className={`ecosystem-atlas__filter-btn${tab === item ? ' is-active' : ''}`}
            onClick={() => onTabChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {tab === 'overview' && (
          <>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{node.summary}</p>
            <dl style={{ marginTop: 'var(--space-4)' }}>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <dt style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Contains</dt>
                <dd style={{ marginTop: 'var(--space-1)' }}>
                  {isEditing ? (
                    <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} style={{ width: '100%' }} />
                  ) : content}
                </dd>
              </div>
              <div style={{ marginBottom: 'var(--space-3)' }}><dt style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Origin</dt><dd>{node.origin}</dd></div>
              <div style={{ marginBottom: 'var(--space-3)' }}><dt style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Created</dt><dd>{node.created}</dd></div>
              <div><dt style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Used by</dt><dd>{node.usedBy}</dd></div>
            </dl>
          </>
        )}
        {tab === 'provenance' && (
          <ol style={{ paddingLeft: 'var(--space-5)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            {node.transformations.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        )}
        {tab === 'governance' && (
          <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            {node.permissions.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)' }}>
        {isEditing ? (
          <>
            <button type="button" className="btn btn--primary" onClick={() => onSaveEdit(draft)}>Save session copy</button>
            <button type="button" className="text-button" onClick={onCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn--primary" onClick={onExport}>Export illustrative JSON</button>
            {node.mutable && (
              <button type="button" className="text-button" onClick={onEdit}>Edit session copy</button>
            )}
          </>
        )}
      </div>
    </aside>
  )
}

export function ArchitectureExplorer() {
  const [depth, setDepth] = useState(0)
  const [selectedId, setSelectedId] = useState('workspace')
  const [tab, setTab] = useState<InspectorTab>('overview')
  const [museumIndex, setMuseumIndex] = useState<number | null>(null)
  const [editedContent, setEditedContent] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('Architecture overview loaded.')
  const [explorerStarted, setExplorerStarted] = useState(false)
  const museumDialogRef = useRef<HTMLDivElement>(null)

  const selectedNode = getNode(selectedId)
  const visibleNodes = useMemo(
    () => architectureNodes.filter((node) => node.minDepth <= depth),
    [depth],
  )
  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes])
  const visibleConnections = architectureConnections.filter(
    (connection) => connection.minDepth <= depth && visibleNodeIds.has(connection.from) && visibleNodeIds.has(connection.to),
  )

  const selectNode = useCallback((node: ArchitectureNode) => {
    setSelectedId(node.id)
    setTab('overview')
    setEditingId(null)
    setAnnouncement(`${node.label} selected. ${node.summary}`)
  }, [])

  const chooseDepth = useCallback((nextDepth: number) => {
    setDepth(nextDepth)
    setAnnouncement(`Depth ${nextDepth}: ${depthDefinitions[nextDepth].title}. ${depthDefinitions[nextDepth].description}`)
    if (getNode(selectedId).minDepth > nextDepth) {
      setSelectedId('workspace')
    }
  }, [selectedId])

  const exitMuseum = useCallback(() => {
    setMuseumIndex(null)
    setAnnouncement('Guided observation ended. Manual exploration resumed.')
  }, [])

  useEffect(() => {
    const nodeId = new URL(window.location.href).searchParams.get('node')
    const restored = architectureNodes.find((node) => node.id === nodeId)
    if (restored) {
      setExplorerStarted(true)
      setSelectedId(restored.id)
      setDepth(restored.minDepth)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (museumIndex !== null) exitMuseum()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [exitMuseum, museumIndex])

  useEffect(() => {
    if (museumIndex === null) return
    const stop = museumStops[museumIndex]
    setDepth(stop.depth)
    setSelectedId(stop.nodeId)
    setAnnouncement(`Guided stop ${museumIndex + 1} of ${museumStops.length}: ${stop.title}`)
    museumDialogRef.current?.focus()

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reducedMotion) return
    const timer = window.setTimeout(() => {
      if (museumIndex < museumStops.length - 1) setMuseumIndex(museumIndex + 1)
    }, 7000)
    return () => window.clearTimeout(timer)
  }, [museumIndex])

  const startMuseum = () => {
    setExplorerStarted(true)
    setMuseumIndex(0)
  }

  const exportObject = () => {
    const payload = {
      demonstration: true,
      exportedAt: new Date().toISOString(),
      node: { ...selectedNode, content: editedContent[selectedId] ?? selectedNode.content },
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = `${selectedId}-illustrative-memory.json`
    anchor.click()
    URL.revokeObjectURL(href)
    setAnnouncement(`${selectedNode.label} exported as illustrative JSON.`)
  }

  const saveEdit = (value: string) => {
    const safeValue = value.trim() || selectedNode.content
    setEditedContent((current) => ({ ...current, [selectedId]: safeValue }))
    setEditingId(null)
    setAnnouncement(`Session copy of ${selectedNode.label} updated.`)
  }

  return (
    <section className="section arch-explorer" id="architecture" aria-labelledby="architecture-title">
      <span className="section-index" aria-hidden="true">04</span>
      <div className="container">
        <p className="section-label">04 — Architecture graph</p>
        <h2 className="section-heading" id="architecture-title">System topology</h2>
        {!explorerStarted && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '60ch' }}>
              Depth levels (0–4) represent how far this system's implementation extends: 0 is the
              published concept, 4 is a running production system with verifiable outputs. Click any
              node to inspect its current depth and dependencies.
            </p>
            <button type="button" className="btn btn--primary" style={{ marginTop: 'var(--space-4)' }} onClick={startMuseum}>
              Take the guided tour ▷
            </button>
          </div>
        )}

        <div className="arch-explorer__canvas-wrap">
          <svg className="arch-explorer__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {visibleConnections.map((connection) => {
              const from = getNode(connection.from)
              const to = getNode(connection.to)
              const dimmed = false
              return (
                <g key={`${connection.from}-${connection.to}`} className={`${connection.kind} ${dimmed ? 'dimmed' : ''}`}>
                  <title>{`${from.label} ${connection.label} ${to.label}`}</title>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="arch-explorer__edge" vectorEffect="non-scaling-stroke" />
                </g>
              )
            })}
          </svg>

          {visibleNodes.map((node) => {
            const isSelected = selectedId === node.id
            return (
              <button
                type="button"
                key={node.id}
                className={`arch-explorer__node type-${node.type} ${isSelected ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'var(--color-bg-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-2) var(--space-3)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--color-text)',
                }}
                aria-pressed={isSelected}
                aria-label={`${node.label}, ${nodeTypeLabels[node.type]}. ${node.summary}`}
                onClick={() => selectNode(node)}
              >
                {node.label}
              </button>
            )
          })}
        </div>

        <div className="arch-explorer__depth-bar" aria-hidden="true">
          {depthDefinitions.map((d) => (
            <div key={d.value} className={`arch-explorer__depth-pip${d.value <= depth ? ' is-filled' : ''}`} />
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {depthDefinitions.map((d) => (
            <button
              key={d.value}
              type="button"
              className={`ecosystem-atlas__filter-btn${depth === d.value ? ' is-active' : ''}`}
              onClick={() => chooseDepth(d.value)}
            >
              {d.value} · {d.shortLabel}
            </button>
          ))}
        </div>

        <Inspector
          node={selectedNode}
          tab={tab}
          content={editedContent[selectedId] ?? selectedNode.content}
          isEditing={editingId === selectedId}
          onTabChange={setTab}
          onClose={() => setAnnouncement('Inspector closed.')}
          onExport={exportObject}
          onEdit={() => setEditingId(selectedId)}
          onCancelEdit={() => setEditingId(null)}
          onSaveEdit={saveEdit}
        />

        <p className="sr-only" aria-live="polite">{announcement}</p>

        {museumIndex !== null && (
          <div className="arch-museum" role="dialog" aria-modal="true" aria-labelledby="museum-title" ref={museumDialogRef} tabIndex={-1}>
            <div className="arch-museum__card">
              <p className="arch-museum__counter">{String(museumIndex + 1).padStart(2, '0')} / {String(museumStops.length).padStart(2, '0')}</p>
              <h3 id="museum-title">{museumStops[museumIndex].title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)' }}>{museumStops[museumIndex].caption}</p>
              <div className="arch-museum__controls">
                <button type="button" className="btn btn--primary" onClick={exitMuseum}>Explore manually</button>
                <button type="button" className="arch-museum__pause-btn" onClick={exitMuseum}>Exit guide</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
