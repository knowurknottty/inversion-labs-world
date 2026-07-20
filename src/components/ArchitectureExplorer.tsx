import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import {
  architectureConnections,
  architectureNodes,
  connectedNodeIds,
  depthDefinitions,
  getNode,
  museumStops,
  nodeTypeLabels,
} from '../data/architecture'
import type { ArchitectureNode } from '../types'

type InspectorTab = 'overview' | 'provenance' | 'governance'
type ObjectState = 'active' | 'revoked' | 'deleted'

interface InspectorProps {
  node: ArchitectureNode
  tab: InspectorTab
  objectState: ObjectState
  content: string
  isEditing: boolean
  onTabChange: (tab: InspectorTab) => void
  onClose: () => void
  onExport: () => void
  onEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: (value: string) => void
  onStateChange: (state: ObjectState) => void
}

function Inspector({
  node,
  tab,
  objectState,
  content,
  isEditing,
  onTabChange,
  onClose,
  onExport,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onStateChange,
}: InspectorProps) {
  const [draft, setDraft] = useState(content)
  const inspectorTabs: InspectorTab[] = ['overview', 'provenance', 'governance']

  useEffect(() => setDraft(content), [content, node.id])

  return (
    <aside className="inspector" aria-labelledby="inspector-title">
      <div className="inspector-topline">
        <span>{node.eyebrow}</span>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close object inspector">×</button>
      </div>
      <div className="inspector-title-row">
        <span className={`node-glyph type-${node.type}`} aria-hidden="true" />
        <div>
          <h3 id="inspector-title">{node.label}</h3>
          <p>{nodeTypeLabels[node.type]}</p>
        </div>
      </div>

      <div className="inspector-tabs" role="tablist" aria-label="Object detail">
        {inspectorTabs.map((item, index) => (
          <button
            key={item}
            id={`inspector-tab-${item}`}
            type="button"
            role="tab"
            aria-selected={tab === item}
            aria-controls="inspector-panel"
            tabIndex={tab === item ? 0 : -1}
            className={tab === item ? 'active' : ''}
            onClick={() => onTabChange(item)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
              event.preventDefault()
              const direction = event.key === 'ArrowRight' ? 1 : -1
              const nextIndex = (index + direction + inspectorTabs.length) % inspectorTabs.length
              onTabChange(inspectorTabs[nextIndex])
              const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
              buttons?.[nextIndex]?.focus()
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        className="inspector-content"
        id="inspector-panel"
        role="tabpanel"
        aria-labelledby={`inspector-tab-${tab}`}
      >
        {tab === 'overview' && (
          <>
            <p className="inspector-summary">{node.summary}</p>
            <dl className="object-fields">
              <div>
                <dt>Contains</dt>
                <dd>
                  {isEditing ? (
                    <label className="edit-field">
                      <span className="sr-only">Edit illustrative object content</span>
                      <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={5} />
                    </label>
                  ) : content}
                </dd>
              </div>
              <div><dt>Origin</dt><dd>{node.origin}</dd></div>
              <div><dt>Created</dt><dd>{node.created}</dd></div>
              <div><dt>Used by</dt><dd>{node.usedBy}</dd></div>
            </dl>
          </>
        )}

        {tab === 'provenance' && (
          <>
            <p className="inspector-summary">Follow the ordered trail from source to current state.</p>
            <ol className="trail-list">
              {node.transformations.map((transformation, index) => (
                <li key={transformation}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{transformation}</p>
                </li>
              ))}
            </ol>
          </>
        )}

        {tab === 'governance' && (
          <>
            <div className={`object-state state-${objectState}`}>
              <span aria-hidden="true" />
              Demo state: {objectState}
            </div>
            <ul className="permission-list">
              {node.permissions.map((permission) => <li key={permission}>{permission}</li>)}
            </ul>
            {node.mutable && (
              <div className="governance-actions" aria-label="Demonstration governance actions">
                {objectState === 'active' && (
                  <>
                    <button type="button" onClick={() => onStateChange('revoked')}>Revoke access</button>
                    <button type="button" className="danger-action" onClick={() => onStateChange('deleted')}>Delete in demo</button>
                  </>
                )}
                {objectState !== 'active' && (
                  <button type="button" onClick={() => onStateChange('active')}>Restore demo object</button>
                )}
              </div>
            )}
            <p className="demo-disclaimer">These controls alter this browser session only. No production memory is connected.</p>
          </>
        )}
      </div>

      <div className="inspector-actions">
        {isEditing ? (
          <>
            <button type="button" className="button button-small" onClick={() => onSaveEdit(draft)}>Save session copy</button>
            <button type="button" className="text-button" onClick={onCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" className="button button-small" onClick={onExport}>Export illustrative JSON</button>
            {node.mutable && objectState !== 'deleted' && (
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
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const [tab, setTab] = useState<InspectorTab>('overview')
  const [focusMode, setFocusMode] = useState(false)
  const [museumIndex, setMuseumIndex] = useState<number | null>(null)
  const [objectStates, setObjectStates] = useState<Record<string, ObjectState>>({})
  const [editedContent, setEditedContent] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('Architecture overview loaded.')
  const museumDialogRef = useRef<HTMLDivElement>(null)

  const selectedNode = getNode(selectedId)
  const activeDepth = depthDefinitions[depth]
  const relatedIds = useMemo(() => connectedNodeIds(selectedId), [selectedId])
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
    setInspectorOpen(true)
    setTab('overview')
    setEditingId(null)
    setAnnouncement(`${node.label} selected. ${node.summary}`)
    const url = new URL(window.location.href)
    url.hash = 'architecture'
    url.searchParams.set('node', node.id)
    window.history.replaceState({}, '', url)
  }, [])

  const chooseDepth = useCallback((nextDepth: number) => {
    setDepth(nextDepth)
    const definition = depthDefinitions[nextDepth]
    setAnnouncement(`Depth ${nextDepth}: ${definition.title}. ${definition.description}`)
    if (getNode(selectedId).minDepth > nextDepth) {
      setSelectedId('workspace')
      setInspectorOpen(true)
    }
  }, [selectedId])

  const exitMuseum = useCallback(() => {
    setMuseumIndex(null)
    setFocusMode(false)
    setAnnouncement('Guided observation ended. Manual exploration resumed.')
  }, [])

  useEffect(() => {
    const nodeId = new URL(window.location.href).searchParams.get('node')
    const restored = architectureNodes.find((node) => node.id === nodeId)
    if (restored) {
      setSelectedId(restored.id)
      setDepth(restored.minDepth)
      setInspectorOpen(true)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (museumIndex !== null) exitMuseum()
      else if (focusMode) {
        setFocusMode(false)
        setAnnouncement('Focus mode exited.')
      } else if (inspectorOpen) {
        setInspectorOpen(false)
        setAnnouncement('Object inspector closed.')
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [exitMuseum, focusMode, inspectorOpen, museumIndex])

  useEffect(() => {
    if (museumIndex === null) return
    const stop = museumStops[museumIndex]
    setDepth(stop.depth)
    setSelectedId(stop.nodeId)
    setInspectorOpen(true)
    setTab('overview')
    setFocusMode(true)
    setAnnouncement(`Guided stop ${museumIndex + 1} of ${museumStops.length}: ${stop.title}`)
    museumDialogRef.current?.focus()

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reducedMotion) return
    const timer = window.setTimeout(() => {
      if (museumIndex < museumStops.length - 1) setMuseumIndex(museumIndex + 1)
    }, 7000)
    return () => window.clearTimeout(timer)
  }, [museumIndex])

  const startMuseum = () => setMuseumIndex(0)

  const handleMuseumKeys = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !museumDialogRef.current) return
    const controls = Array.from(museumDialogRef.current.querySelectorAll<HTMLElement>('button'))
      .filter((control) => !control.hasAttribute('disabled'))
    if (controls.length === 0) return
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && (document.activeElement === first || document.activeElement === museumDialogRef.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const exportObject = () => {
    const payload = {
      demonstration: true,
      exportedAt: new Date().toISOString(),
      state: objectStates[selectedId] ?? 'active',
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

  const setObjectState = (state: ObjectState) => {
    setObjectStates((current) => ({ ...current, [selectedId]: state }))
    setAnnouncement(`${selectedNode.label} is now ${state} in this demonstration session.`)
  }

  const saveEdit = (value: string) => {
    const safeValue = value.trim() || selectedNode.content
    setEditedContent((current) => ({ ...current, [selectedId]: safeValue }))
    setEditingId(null)
    setAnnouncement(`Session copy of ${selectedNode.label} updated.`)
  }

  return (
    <section className="architecture-section" id="architecture" aria-labelledby="architecture-title">
      <div className="section-heading architecture-heading">
        <p className="section-index"><span>03</span> Inspect the architecture</p>
        <h2 id="architecture-title">Move from the system to the object—and keep the trail.</h2>
        <p>
          This deterministic, illustrative map shows how nodes, connections, depth, and an agent role fit together.
          Select any entity to inspect its content, provenance, and permissions.
        </p>
      </div>

      <div className="architecture-metrics" aria-label="Illustrative map totals">
        <div><strong>{architectureNodes.length}</strong><span>illustrative entities</span></div>
        <div><strong>{architectureConnections.length}</strong><span>named relationships</span></div>
        <div><strong>{depthDefinitions.length}</strong><span>conceptual layers</span></div>
        <div><strong>1</strong><span>bounded agent role</span></div>
        <p>Demonstration data · not live telemetry</p>
      </div>

      <div className="depth-navigation">
        <div className="depth-copy" aria-live="polite">
          <span>Depth {depth} / 4</span>
          <h3>{activeDepth.title}</h3>
          <p>{activeDepth.description}</p>
        </div>
        <ol aria-label="Architecture depth">
          {depthDefinitions.map((definition) => (
            <li key={definition.value}>
              <button
                type="button"
                className={depth === definition.value ? 'active' : ''}
                aria-current={depth === definition.value ? 'step' : undefined}
                onClick={() => chooseDepth(definition.value)}
              >
                <span>{definition.value}</span>
                {definition.shortLabel}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="explorer-toolbar" aria-label="Architecture display controls">
        <button
          type="button"
          className={focusMode ? 'active' : ''}
          aria-pressed={focusMode}
          onClick={() => {
            setFocusMode((current) => !current)
            setAnnouncement(`${focusMode ? 'Exiting' : 'Entering'} focus mode for ${selectedNode.label}.`)
          }}
        >
          <span className="toolbar-icon" aria-hidden="true">⌾</span>
          {focusMode ? 'Exit focus' : 'Focus selection'}
        </button>
        <button type="button" onClick={startMuseum}>
          <span className="toolbar-icon" aria-hidden="true">▷</span>
          Guide me
        </button>
        <button type="button" onClick={() => {
          setDepth(0)
          selectNode(getNode('workspace'))
          setFocusMode(false)
          setAnnouncement('Architecture reset to overview.')
        }}>
          <span className="toolbar-icon" aria-hidden="true">↺</span>
          Reset overview
        </button>
        <span className="escape-hint">Esc closes the active layer</span>
      </div>

      <div className={`explorer-shell ${focusMode ? 'is-focused' : ''}`}>
        <div className="graph-panel">
          <div className="graph-header">
            <div>
              <span>IL / MEMORY MODEL</span>
              <strong>Layer {String(depth).padStart(2, '0')}</strong>
            </div>
            <div className="graph-legend" aria-label="Node legend">
              <span><i className="legend-object" />Object</span>
              <span><i className="legend-actor" />Actor</span>
              <span><i className="legend-rule" />Rule / trail</span>
            </div>
          </div>

          <div
            className="graph-stage"
            role="group"
            aria-label={`Interactive architecture map at depth ${depth}. ${visibleNodes.length} entities are visible.`}
          >
            <svg className="connection-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {visibleConnections.map((connection) => {
                const from = getNode(connection.from)
                const to = getNode(connection.to)
                const dimmed = focusMode && (!relatedIds.has(connection.from) || !relatedIds.has(connection.to))
                return (
                  <g key={`${connection.from}-${connection.to}`} className={`${connection.kind} ${dimmed ? 'dimmed' : ''}`}>
                    <title>{`${from.label} ${connection.label} ${to.label}`}</title>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} vectorEffect="non-scaling-stroke" />
                  </g>
                )
              })}
            </svg>

            {visibleNodes.map((node) => {
              const isSelected = selectedId === node.id
              const isDimmed = focusMode && !relatedIds.has(node.id)
              const objectState = objectStates[node.id] ?? 'active'
              return (
                <button
                  type="button"
                  key={node.id}
                  className={`graph-node type-${node.type} ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''} state-${objectState}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  aria-pressed={isSelected}
                  aria-label={`${node.label}, ${nodeTypeLabels[node.type]}. ${node.summary}`}
                  onClick={() => selectNode(node)}
                >
                  <span className="node-core" aria-hidden="true"><i /></span>
                  <span className="node-copy">
                    <strong>{node.label}</strong>
                    <small>{nodeTypeLabels[node.type]}</small>
                  </span>
                </button>
              )
            })}

            <div className="graph-scale" aria-hidden="true"><span>Near</span><i /><span>Far</span></div>
          </div>

          <details className="graph-list">
            <summary>Read visible architecture as a list</summary>
            <ul>
              {visibleNodes.map((node) => (
                <li key={node.id}>
                  <button type="button" onClick={() => selectNode(node)}>
                    <strong>{node.label}</strong>
                    <span>{nodeTypeLabels[node.type]} — {node.summary}</span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>

        {inspectorOpen ? (
          <Inspector
            node={selectedNode}
            tab={tab}
            objectState={objectStates[selectedId] ?? 'active'}
            content={editedContent[selectedId] ?? selectedNode.content}
            isEditing={editingId === selectedId}
            onTabChange={setTab}
            onClose={() => {
              setInspectorOpen(false)
              setEditingId(null)
            }}
            onExport={exportObject}
            onEdit={() => setEditingId(selectedId)}
            onCancelEdit={() => setEditingId(null)}
            onSaveEdit={saveEdit}
            onStateChange={setObjectState}
          />
        ) : (
          <div className="inspector-closed">
            <p>No object is open.</p>
            <button type="button" onClick={() => setInspectorOpen(true)}>Reopen {selectedNode.label}</button>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">{announcement}</p>

      {museumIndex !== null && (
        <div className="museum-backdrop">
          <div
            className="museum-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="museum-title"
            ref={museumDialogRef}
            tabIndex={-1}
            onKeyDown={handleMuseumKeys}
          >
            <div className="museum-topline">
              <span>Guided observation</span>
              <button type="button" onClick={exitMuseum}>Exit guide</button>
            </div>
            <div className="museum-progress" aria-label={`Stop ${museumIndex + 1} of ${museumStops.length}`}>
              {museumStops.map((stop, index) => (
                <i key={stop.title} className={index <= museumIndex ? 'complete' : ''} />
              ))}
            </div>
            <p className="museum-count">{String(museumIndex + 1).padStart(2, '0')} / {String(museumStops.length).padStart(2, '0')}</p>
            <h3 id="museum-title">{museumStops[museumIndex].title}</h3>
            <p>{museumStops[museumIndex].caption}</p>
            <div className="museum-actions">
              <button
                type="button"
                disabled={museumIndex === 0}
                onClick={() => setMuseumIndex((current) => Math.max(0, (current ?? 0) - 1))}
              >
                Previous
              </button>
              {museumIndex < museumStops.length - 1 ? (
                <button type="button" onClick={() => setMuseumIndex(museumIndex + 1)}>Next stop</button>
              ) : (
                <button type="button" onClick={exitMuseum}>Explore manually</button>
              )}
            </div>
            <p className="museum-motion-note">Auto-advances every seven seconds when reduced motion is not requested.</p>
          </div>
        </div>
      )}
    </section>
  )
}
