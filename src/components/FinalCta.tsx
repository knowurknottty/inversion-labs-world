export function FinalCta() {
  return (
    <section className="final-cta" id="participate" aria-labelledby="final-title">
      <div>
        <p className="section-index"><span>08</span> Concrete next actions</p>
        <h2 id="final-title">Every link below opens something real.</h2>
      </div>
      <p>
        Use a deployed product, read the governed evidence, run this site locally,
        or open a focused discussion. No vague invitation is standing in for a specific next step.
      </p>
      <div className="final-actions">
        <a className="button button-light" href="https://synsyncpro.netlify.app" target="_blank" rel="noreferrer">
          Open SynSync Pro — live now <span aria-hidden="true">↗</span>
        </a>
        <a href="/registry.json">
          Read the ecosystem registry JSON <span aria-hidden="true">↗</span>
        </a>
        <a href="/capt-verification/protocol.md">
          Read the CAPT verification protocol <span aria-hidden="true">↗</span>
        </a>
        <a href="https://github.com/knowurknottty/inversion-labs-world#readme" target="_blank" rel="noreferrer">
          Clone and run this site locally <span aria-hidden="true">↗</span>
        </a>
        <a href="https://github.com/knowurknottty/inversion-labs-world/issues/new" target="_blank" rel="noreferrer">
          Open a focused issue on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}
