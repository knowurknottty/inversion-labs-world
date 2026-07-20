const PRINCIPLES: { id: string; label: string; consequence: string }[] = [
  { id: 'I', label: 'Evidence before aesthetics', consequence: 'Every UI element must carry a functional role; purely decorative elements are not built' },
  { id: 'II', label: 'Local execution by default', consequence: 'Network calls require explicit justification; offline capability is the baseline, not a feature' },
  { id: 'III', label: 'Transparent provenance', consequence: 'Every data object exposes its write history; no black-box state mutations' },
  { id: 'IV', label: 'Minimal attack surface', consequence: 'Zero third-party runtime dependencies in production builds; each dep is an audited decision' },
];

export function Principles() {
  return (
    <section className="section" id="principles" aria-labelledby="principles-title">
      <span className="section-index" aria-hidden="true">05</span>
      <div className="container">
        <p className="section-label">05 — Operating principles</p>
        <h2 className="section-heading" id="principles-title">How decisions get made</h2>
        <table className="principles__table" aria-label="Operating principles and architecture consequences">
          <thead>
            <tr>
              <th scope="col">Principle</th>
              <th scope="col">Architecture consequence</th>
            </tr>
          </thead>
          <tbody>
            {PRINCIPLES.map((p) => (
              <tr key={p.id} data-principle={p.id}>
                <td>{p.id} — {p.label}</td>
                <td>{p.consequence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
