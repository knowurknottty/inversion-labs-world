export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-title">
      <div>
        <p className="section-index"><span>08</span> Choose where to enter</p>
        <h2 id="final-title">Use the product. Inspect the thinking.</h2>
      </div>
      <p>
        Start with the public tool, take the guided memory tour, or inspect the implementation. Each path is open;
        none requires an account.
      </p>
      <div className="final-actions">
        <a className="button button-light" href="https://synsyncpro.netlify.app" target="_blank" rel="noreferrer">
          Open SynSync Pro <span aria-hidden="true">↗</span>
        </a>
        <a href="#architecture">Explore the memory model <span aria-hidden="true">↑</span></a>
        <a href="https://github.com/knowurknottty/inversion-labs-world">View source <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  )
}
