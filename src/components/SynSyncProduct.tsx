import { useEffect, useRef } from 'react';
import { useMemoryObject } from '../context/MemoryObject';

const LINEAGE = [
  { id: 'gate', label: 'GATE Protocol', desc: 'US Army gateway process for neurotech field application', year: '2019' },
  { id: 'gwp', label: 'Gateway Process', desc: 'Monroe Institute binaural entrainment research', year: '1978–2001' },
  { id: 'wo', label: 'Warfighter Optimization', desc: 'SOCOM cognitive performance program', year: '2017' },
  { id: 'ss', label: 'SynSync Pro', desc: 'Public, inspectable, local-render instrument', year: '2024 →', terminal: true },
];

export function SynSyncProduct() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const { addEvent } = useMemoryObject();

  useEffect(() => {
    addEvent('synsync', 'section_entered');
  }, [addEvent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const t = x / W;
        const y = H / 2 + Math.sin(t * Math.PI * 8) * (H * 0.28);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      return;
    }

    const F_BASE = 200;
    const DELTA = 7.83; // Schumann resonance
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      phase += 0.018;

      // Left channel: F_BASE
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const t = (x / W) * Math.PI * 12;
        const y = H * 0.32 + Math.sin(t + phase) * (H * 0.22);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Right channel: F_BASE + DELTA
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.65)';
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const t = (x / W) * Math.PI * 12;
        const ratio = (F_BASE + DELTA) / F_BASE;
        const y = H * 0.68 + Math.sin(t * ratio + phase * 1.04) * (H * 0.22);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Binaural beat envelope (difference frequency)
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const t = (x / W) * Math.PI * (DELTA / F_BASE) * 12;
        const y = H / 2 + Math.sin(t + phase * (DELTA / F_BASE)) * (H * 0.38);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section className="synsync-section" id="synsync" aria-labelledby="synsync-title">
      <div className="synsync-header">
        <p className="section-index"><span>SynSync</span></p>
        <h2 id="synsync-title">SynSync Pro</h2>
        <p className="synsync-tagline">
          Binaural entrainment. Rendered locally. No account. No telemetry.
        </p>
      </div>

      <div className="synsync-stage">
        <div className="synsync-canvas-wrap" aria-label="Live binaural waveform — left and right channel frequencies">
          <canvas ref={canvasRef} className="synsync-canvas" />
          <div className="synsync-live-indicator" aria-live="polite" role="status">
            <span className="live-dot" aria-hidden="true" />
            Rendering locally
          </div>
          <div className="synsync-channel-labels" aria-hidden="true">
            <span className="channel-label channel-label--left">L · 200 Hz</span>
            <span className="channel-label channel-label--right">R · 207.83 Hz</span>
            <span className="channel-label channel-label--beat">Δ · 7.83 Hz</span>
          </div>
        </div>

        <div className="synsync-info">
          <p className="synsync-description">
            Two sine tones — one per ear — with a frequency difference of 7.83 Hz
            (the Schumann resonance). Your brain resolves the difference as a third
            tone that doesn't exist in air. That's the entrainment. All DSP runs
            in your browser. Nothing leaves your device.
          </p>

          <div className="synsync-lineage">
            <p className="lineage-header">Three source threads. One public instrument.</p>
            <div className="lineage-flow" role="list">
              {LINEAGE.map((item, i) => (
                <div
                  key={item.id}
                  className={`lineage-node ${item.terminal ? 'lineage-node--terminal' : ''}`}
                  role="listitem"
                >
                  {i < LINEAGE.length - 1 && (
                    <div className="lineage-connector" aria-hidden="true" />
                  )}
                  <div className="lineage-content">
                    <span className="lineage-year">{item.year}</span>
                    <strong className="lineage-label">{item.label}</strong>
                    <p className="lineage-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            className="button button-primary"
            href="https://synsync.pro"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => addEvent('synsync', 'opened_app')}
          >
            Open SynSync Pro
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-icon arrow-icon--right">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
