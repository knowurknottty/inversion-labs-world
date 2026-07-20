const chapters = [
  { n: 1, title: 'The Ivory Tower', subtitle: 'How we became pieces in a game we never agreed to play' },
  { n: 2, title: 'The Five Scrolls', subtitle: 'The maps that show you what you already know' },
  { n: 3, title: 'The Seven Dungeons', subtitle: 'Every system of control has a door. Every door has a key.' },
  { n: 4, title: 'The Master Keys', subtitle: 'Tools for unlocking what was never locked' },
  { n: 5, title: 'The Ascension', subtitle: 'What happens when you stop playing the game' },
  { n: 6, title: 'The Grimoire', subtitle: 'The book you write yourself into being' },
  { n: 7, title: 'The Transmission', subtitle: 'What you bring back and how you give it away' },
]

export function Excursion() {
  return (
    <section className="excursion-section" id="excursion" aria-labelledby="excursion-title">
      <div className="section-heading excursion-heading">
        <p className="section-index"><span>05</span> Inversion Excursion</p>
        <h2 id="excursion-title">An interactive book through seven thresholds of becoming.</h2>
        <p>
          Inversion Excursion is a living web book: a contemplative journey where each chapter carries its own
          theme, epigraph, and entrainment audio. The experiential sibling of the lab's research—where ideas
          become something you step through, not just read.
        </p>
      </div>

      <ol className="excursion-chapters">
        {chapters.map((chapter) => (
          <li className="excursion-chapter" key={chapter.n}>
            <span className="chapter-number">{String(chapter.n).padStart(2, '0')}</span>
            <div>
              <h3>{chapter.title}</h3>
              <p>{chapter.subtitle}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="excursion-actions">
        <a
          className="button button-primary"
          href="https://inversion-excursion.netlify.app"
          target="_blank"
          rel="noreferrer"
        >
          Enter the Excursion <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}
