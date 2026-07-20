export function FinalCta() {
  return (
    <section className="final-cta" id="participate" aria-labelledby="final-title">
      <div>
        <p className="section-index"><span>08</span> Concrete next actions</p>
        <h2 id="final-title">Do something verifiable next.</h2>
      </div>
      <p>
        Use a deployed product, inspect the governed evidence, run the website locally, or open a specific discussion.
        No vague invitation is standing in for a next step.
      </p>
      <div className="final-actions">
        <a className="button button-light" href="https://synsyncpro.netlify.app" target="_blank" rel="noreferrer">
          Open SynSync Pro <span aria-hidden="true">↗</span>
        </a>
        <a href="/registry.json">Inspect the project registry <span aria-hidden="true">↗</span></a>
        <a href="/capt-verification/protocol.md">Read the verification protocol <span aria-hidden="true">↗</span></a>
        <a href="https://github.com/knowurknottty/inversion-labs-world#readme">Run this field guide locally <span aria-hidden="true">↗</span></a>
        <a href="https://github.com/knowurknottty/inversion-labs-world/issues/new">Open a focused issue <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  )
}
