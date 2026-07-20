import { useState } from 'react';
import { useMemoryObject } from '../context/MemoryObject';

export function MemoryObjectIndicator() {
  const { id, events, exportJSON } = useMemoryObject();
  const [expanded, setExpanded] = useState(false);

  const handleExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id.replace(' / ', '-').replace('MEM-', 'mem-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`mo-indicator ${expanded ? 'mo-indicator--expanded' : ''}`}
      role="complementary"
      aria-label="Memory object provenance tracker"
    >
      <button
        className="mo-trigger"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-controls="mo-panel"
      >
        <span className="mo-bracket mo-bracket--tl" aria-hidden="true" />
        <span className="mo-bracket mo-bracket--tr" aria-hidden="true" />
        <span className="mo-bracket mo-bracket--bl" aria-hidden="true" />
        <span className="mo-bracket mo-bracket--br" aria-hidden="true" />
        <span className="mo-id">{id}</span>
        <span className="mo-count" aria-live="polite">{events.length}</span>
      </button>

      {expanded && (
        <div id="mo-panel" className="mo-panel">
          <p className="mo-panel-label">Provenance trail — this session</p>
          <ol className="mo-trail">
            {events.map((ev, i) => (
              <li key={i} className="mo-trail-item">
                <span className="mo-trail-section">{ev.section}</span>
                <span className="mo-trail-action">{ev.action}</span>
              </li>
            ))}
          </ol>
          <button className="mo-export" onClick={handleExport}>
            Export JSON
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 10h8M6 2v6M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
