import { useState } from 'react'

type LensState = 'platform' | 'person'

const lensContent: Record<LensState, { label: string; title: string; body: string; traits: string[] }> = {
  platform: {
    label: 'Platform-controlled memory',
    title: 'Context enters. Its trail disappears.',
    body: 'When memory is owned by an application, the person using it has no object to inspect, transfer, or revoke. The context exists — but not as something you can act on.',
    traits: ['Application-bound — no portability', 'Opaque lineage — no trail', 'Access implied by use — no explicit permission'],
  },
  person: {
    label: 'User-governed memory',
    title: 'Memory stays an object you can act on.',
    body: 'In the inverted model, content, provenance, permissions, and revision history travel together as a single envelope. The person can inspect it, move it, or revoke access — outside any application boundary.',
    traits: ['Portable envelope — survives platform changes', 'Visible lineage — full transformation trail', 'Explicit permission — revocable at any time'],
  },
}

export function LensSection() {
  const [lens, setLens] = useState<LensState>('person')
  const content = lensContent[lens]

  return (
    <section className="lens-section" id="thesis" aria-labelledby="lens-title">
      <div className="section-heading lens-heading">
        <p className="section-index"><span>05</span> The memory inversion</p>
        <h2 id="lens-title">Same memory. Different authority.</h2>
        <p>
          Toggle the lens to see exactly what changes when memory shifts from an application
          side-effect to a person-governed object with an inspectable trail.
        </p>
      </div>

      <div className={`lens-instrument lens-${lens}`}>
        <div className="segmented-control" role="group" aria-label="Memory governance perspective">
          <button
            type="button"
            className={lens === 'platform' ? 'active' : ''}
            aria-pressed={lens === 'platform'}
            onClick={() => setLens('platform')}
          >
            Platform owns it
          </button>
          <button
            type="button"
            className={lens === 'person' ? 'active' : ''}
            aria-pressed={lens === 'person'}
            onClick={() => setLens('person')}
          >
            You own it
          </button>
        </div>

        <div className="lens-stage" aria-live="polite" aria-atomic="true">
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
            <ul aria-label="Consequences of this model">
              {content.traits.map((trait) => <li key={trait}>{trait}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
