import { useEffect } from 'react';
import { useMemoryObject } from '../context/MemoryObject';

const PRINCIPLES = [
  {
    numeral: 'I',
    title: 'Proof before mythology',
    body: 'Every claim this site makes is accompanied by verifiable evidence or explicitly marked as a hypothesis. We distinguish what is deployed from what is intended.',
    example: 'The SynSync Pro waveform renderer is inspectable in devtools. The binaural math is in the open source repo.',
    consequence: 'Architecture decisions are documented. Gaps are visible. Nothing is papered over with marketing language.',
    registry: '#evidence',
  },
  {
    numeral: 'II',
    title: 'Person-portable memory',
    body: 'Memory objects belong to the person who generated them. They must be exportable, inspectable, and revocable without platform permission.',
    example: 'The session memory object you carry through this page can be exported as JSON before you leave.',
    consequence: 'No user data is retained server-side. Session state is local. The architecture enforces the principle.',
    registry: '#lens',
  },
  {
    numeral: 'III',
    title: 'Visible infrastructure',
    body: 'The systems that shape human cognition and coordination should be as transparent as the reasoning they support.',
    example: 'The registry.json file is publicly readable. Every system in the ecosystem has a maturity rating and evidence grade.',
    consequence: 'Opacity is a design failure. If you cannot see how a system works, you cannot consent to it.',
    registry: '#atlas',
  },
  {
    numeral: 'IV',
    title: 'Local-first by default',
    body: 'Computation that can run locally should run locally. Network calls should be opt-in, not default.',
    example: 'SynSync Pro renders all audio DSP in the browser. ArchitectureExplorer renders all graph computation client-side.',
    consequence: 'Battery, bandwidth, and privacy are treated as design constraints, not afterthoughts.',
    registry: '#architecture',
  },
];

export function Principles() {
  const { addEvent } = useMemoryObject();

  useEffect(() => {
    addEvent('principles', 'section_entered');
  }, [addEvent]);

  return (
    <section className="principles-section" id="principles" aria-labelledby="principles-title">
      <div className="principles-header">
        <p className="section-index"><span>Principles</span></p>
        <h2 id="principles-title">Operating constraints</h2>
        <p className="principles-subtitle">
          These are not values. They are architectural commitments with visible consequences.
        </p>
      </div>

      <div className="principles-proof-boundary">
        <div className="proof-col proof-col--can">
          <p className="proof-col-label">What you can verify today</p>
          <ul>
            <li>SynSync Pro renders audio locally — inspect devtools network tab</li>
            <li>Registry is public JSON — <a href="/registry.json" className="text-link">registry.json</a></li>
            <li>This session's memory object is exportable — see the indicator</li>
            <li>Architecture graph is client-side computed — no API calls</li>
          </ul>
        </div>
        <div className="proof-col proof-col--cannot">
          <p className="proof-col-label">What is not yet established</p>
          <ul>
            <li>Long-term memory portability across device boundaries</li>
            <li>Third-party audit of the full local-render claim</li>
            <li>Quantified cognitive outcomes for SynSync entrainment</li>
          </ul>
        </div>
      </div>

      <ol className="principles-list" aria-label="Operating principles">
        {PRINCIPLES.map(p => (
          <li key={p.numeral} className="principle-row">
            <div className="principle-left">
              <span className="principle-numeral" aria-hidden="true">{p.numeral}</span>
              <div className="principle-statement">
                <h3 className="principle-title">{p.title}</h3>
                <p className="principle-body">{p.body}</p>
              </div>
            </div>
            <div className="principle-right">
              <div className="principle-example">
                <p className="principle-right-label">Example</p>
                <p>{p.example}</p>
              </div>
              <div className="principle-consequence">
                <p className="principle-right-label">Architecture consequence</p>
                <p>{p.consequence}</p>
              </div>
              <a href={p.registry} className="principle-registry-link">
                Visible in registry
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="arrow-icon arrow-icon--right">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
