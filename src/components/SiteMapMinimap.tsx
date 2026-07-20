const SECTIONS = [
  { id: 'hero', label: 'Threshold' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'lens', label: 'Lens' },
  { id: 'synsync', label: 'SynSync' },
  { id: 'atlas', label: 'Atlas' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'principles', label: 'Principles' },
  { id: 'participate', label: 'Participate' },
];

export function SiteMapMinimap({ activeSection, visitedSections }: {
  activeSection: string;
  visitedSections: Set<string>;
}) {
  return (
    <nav
      className="site-minimap"
      aria-label="Page sections minimap"
    >
      {SECTIONS.map(section => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={[
            'minimap-section',
            activeSection === section.id ? 'minimap-section--active' : '',
            visitedSections.has(section.id) && activeSection !== section.id
              ? 'minimap-section--visited'
              : '',
          ].join(' ')}
          aria-current={activeSection === section.id ? 'true' : undefined}
          aria-label={section.label}
        >
          <span className="minimap-pip" aria-hidden="true" />
          <span className="minimap-label">{section.label}</span>
        </a>
      ))}
    </nav>
  );
}
