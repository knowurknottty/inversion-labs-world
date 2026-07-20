import { useEffect, useRef } from 'react';

const NODES = [
  { id: 'mem', x: 0.2, y: 0.15, label: 'MEM', sections: ['hero', 'lens'] },
  { id: 'attn', x: 0.55, y: 0.08, label: 'ATTN', sections: ['evidence'] },
  { id: 'coord', x: 0.78, y: 0.22, label: 'COORD', sections: ['atlas'] },
  { id: 'synsync', x: 0.65, y: 0.45, label: 'SS-PRO', sections: ['synsync'] },
  { id: 'arch', x: 0.3, y: 0.5, label: 'ARCH', sections: ['architecture'] },
  { id: 'prin', x: 0.1, y: 0.65, label: 'PRIN', sections: ['principles'] },
  { id: 'inv', x: 0.5, y: 0.72, label: 'INV', sections: ['hero', 'lens', 'principles'] },
];

const EDGES = [
  ['mem', 'attn'], ['mem', 'arch'], ['mem', 'inv'],
  ['attn', 'coord'], ['coord', 'synsync'],
  ['synsync', 'arch'], ['arch', 'prin'],
  ['prin', 'inv'], ['inv', 'synsync'],
];

export function TopologyCanvas({ activeSection }: { activeSection: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const { width, height } = svg.getBoundingClientRect();

    NODES.forEach(node => {
      const circle = svg.querySelector(`#topo-${node.id}`) as SVGCircleElement;
      const text = svg.querySelector(`#topo-label-${node.id}`) as SVGTextElement;
      if (!circle || !text) return;
      const active = node.sections.includes(activeSection);
      circle.style.opacity = active ? '0.55' : '0.1';
      circle.style.r = active ? '6' : '4';
      text.style.opacity = active ? '0.5' : '0.07';
    });
  }, [activeSection]);

  return (
    <svg
      ref={svgRef}
      className="topology-canvas"
      aria-hidden="true"
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="topo-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {EDGES.map(([a, b], i) => {
        const na = NODES.find(n => n.id === a)!;
        const nb = NODES.find(n => n.id === b)!;
        return (
          <line
            key={i}
            x1={na.x * 1000} y1={na.y * 700}
            x2={nb.x * 1000} y2={nb.y * 700}
            stroke="#4ade80" strokeWidth="0.5" opacity="0.06"
          />
        );
      })}

      {NODES.map(node => (
        <g key={node.id} filter="url(#topo-glow)">
          <circle
            id={`topo-${node.id}`}
            cx={node.x * 1000}
            cy={node.y * 700}
            r={4}
            fill="#4ade80"
            style={{ transition: 'opacity 0.6s ease, r 0.6s ease', opacity: 0.1 }}
          />
          <text
            id={`topo-label-${node.id}`}
            x={node.x * 1000 + 8}
            y={node.y * 700 + 4}
            fill="#4ade80"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.08em"
            style={{ transition: 'opacity 0.6s ease', opacity: 0.07 }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
