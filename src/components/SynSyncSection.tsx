import { useRef, useState, useCallback, useEffect } from 'react';

const FACTS = [
  { icon: '🔬', text: 'Evidence graded I–IV with peer-reviewed citations per preset' },
  { icon: '🔒', text: 'Zero data leaves your browser — no telemetry, no server' },
  { icon: '🎧', text: 'Binaural + isochronic modes, real-time parameter control' },
  { icon: '🖥️', text: 'Works offline after first load — no CDN dependency' },
];

function OscilloscopeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const [running, setRunning] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(107,92,240,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#7c6ef5';
    ctx.beginPath();

    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = (dataArray[i] ?? 128) / 128.0;
      const y = (v * height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  const startOscilloscope = useCallback(() => {
    const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.0001; // inaudible — visual only
    oscillator.type = 'sine';
    oscillator.frequency.value = 200;
    oscillator.connect(analyser);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();

    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;
    oscillatorRef.current = oscillator;
    setRunning(true);
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      oscillatorRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="synsync-section__oscilloscope">
      <canvas
        ref={canvasRef}
        className="synsync-section__canvas"
        width={480}
        height={360}
        aria-label="Live oscilloscope: real-time FFT waveform of a 200Hz sine tone generated locally in your browser. No audio is transmitted."
      />
      <span className="synsync-section__osc-label" aria-hidden="true">
        FFT / 200Hz / LOCAL
      </span>
      {!running && (
        <button
          className="synsync-section__osc-start"
          onClick={startOscilloscope}
          type="button"
        >
          <span aria-hidden="true">▶</span>
          Activate oscilloscope
        </button>
      )}
    </div>
  );
}

export function SynSyncSection() {
  return (
    <section className="section synsync-section" id="synsync" aria-labelledby="synsync-heading">
      <span className="section-index" aria-hidden="true">01</span>
      <div className="container synsync-section__layout">
        <OscilloscopeCanvas />
        <div className="synsync-section__copy">
          <p className="section-label">01 — Live instrument</p>
          <h2 className="section-heading" id="synsync-heading">SynSync Pro</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
            Browser-based brainwave entrainment studio. No account. No install.
            Audio rendered on your device.
          </p>
          <ul className="synsync-section__facts" aria-label="SynSync Pro capabilities">
            {FACTS.map((fact) => (
              <li key={fact.text} className="synsync-section__fact">
                <span className="synsync-section__fact-icon" aria-hidden="true">
                  {fact.icon}
                </span>
                {fact.text}
              </li>
            ))}
          </ul>
          <div className="synsync-section__cta">
            <a
              href="https://synsyncpro.netlify.app"
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open SynSync Pro →
            </a>
          </div>
          <div className="synsync-section__safety">
            ⚠ Brainwave entrainment is contraindicated for photosensitive epilepsy —{' '}
            <a href="/safety" style={{ color: 'inherit', textDecoration: 'underline' }}>
              see safety guidelines
            </a>
            .
          </div>
          <details className="synsync-section__lineage">
            <summary>
              <span aria-hidden="true">▸</span>
              Lineage &amp; context
            </summary>
            <p className="synsync-section__lineage-body">
              SynSync Pro is the first production instrument in the Inversion Ecosystem.
              It demonstrates the core thesis: cognitive tools can be fully local,
              evidence-graded, and free of platform dependency.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
