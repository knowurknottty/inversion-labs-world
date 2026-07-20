const workstreams = [
  {
    id: 'memory',
    number: '01',
    status: 'Research / interactive model',
    title: 'Human-governed memory',
    body: 'Portable context that keeps its source, permissions, revisions, and exit path attached—so an AI system can use memory without owning it.',
    link: '#capt',
    action: 'Understand the memory model',
  },
  {
    id: 'state',
    number: '02',
    status: 'Live / public product',
    title: 'SynSync Pro',
    body: 'A public brainwave entrainment instrument built around local audio generation, visible evidence grades, and control that stays with the listener.',
    link: '#synsync',
    action: 'See the live product',
  },
]

export function WorkOverview() {
  return (
    <section className="work-overview" id="work" aria-labelledby="work-title">
      <div className="work-heading">
        <p className="section-index"><span>02</span> What Inversion Labs builds</p>
        <h2 id="work-title">Two systems. One line in the sand.</h2>
        <p>
          We work where technology becomes intimate: the context an AI remembers and the signals a person uses to
          shape attention or state. Different systems, same governing rule—the person keeps authority.
        </p>
      </div>

      <div className="workstreams">
        {workstreams.map((workstream) => (
          <article className={`workstream workstream-${workstream.id}`} key={workstream.id}>
            <div className="workstream-topline">
              <span>{workstream.number}</span>
              <span>{workstream.status}</span>
            </div>
            <h3>{workstream.title}</h3>
            <p>{workstream.body}</p>
            <a href={workstream.link}>{workstream.action} <span aria-hidden="true">→</span></a>
          </article>
        ))}
      </div>

      <p className="work-rule"><span>Shared rule</span> The system can assist the person. It does not get to absorb them.</p>
    </section>
  )
}
