import { useState } from 'react'

type LensState = 'platform' | 'person'

const lensContent: Record<LensState, { label: string; title: string; body: string; traits: string[] }> = {
  platform: {
    label: 'Platform-controlled',
    title: 'Context enters. Its trail disappears.',
    body: 'When memory is bound to an application, the person using it may have no clear object to inspect, transfer, or govern.',
    traits: ['Application-bound', 'Opaque lineage', 'Access implied by use'],
  },
  person: {
    label: 'User-governed',
    title: 'Memory remains an object with a trail.',
    body: 'In the inverted model, content, provenance, permissions, and revisions travel together as something the person can act on.',
    traits: ['Portable envelope', 'Visible lineage', 'Explicit permission'],
  },
}

export function LensSection() {
  const [lens, setLens] = useState<LensState>('person')
  const content = lensContent[lens]

  return (
    <section className="lens-section" id="thesis" aria-labelledby="lens-title">
      <div className="section-heading lens-heading">
        <p className="section-index"><span>02</span> The inversion lens</p>
        <h2 id="lens-title">Same memory. Different authority.</h2>
        <p>
          Toggle the lens to see what changes when memory moves from an application-owned side effect to a
          person-governed object.
        </p>
      </div>

      <div className={`lens-instrument lens-${lens}`}>
        <div className="segmented-control" aria-label="Memory governance perspective">
          <button
            type="button"
            className={lens === 'platform' ? 'active' : ''}
            aria-pressed={lens === 'platform'}
            onClick={() => setLens('platform')}
          >
            Platform view
          </button>
          <button
            type="button"
            className={lens === 'person' ? 'active' : ''}
            aria-pressed={lens === 'person'}
            onClick={() => setLens('person')}
          >
            Inverted view
          </button>
        </div>

        <div className="lens-stage" aria-live="polite">
          <div className="lens-object" aria-hidden="true">
            <span className="object-corner corner-a" />
            <span className="object-corner corner-b" />
            <span className="object-corner corner-c" />
            <span className="object-corner corner-d" />
            <div className="object-lines"><i /><i /><i /></div>
            <span className="object-label">MEM / 0137</span>
          </div>
          <div className="lens-boundary" aria-hidden="true">
            <span>APPLICATION BOUNDARY</span>
          </div>
          <div className="lens-trace" aria-hidden="true"><i /><i /><i /></div>
          <div className="lens-copy">
            <p className="lens-label">{content.label}</p>
            <h3>{content.title}</h3>
            <p>{content.body}</p>
            <ul>
              {content.traits.map((trait) => <li key={trait}>{trait}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
