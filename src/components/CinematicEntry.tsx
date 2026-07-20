import { useEffect, useState } from 'react';

export function CinematicEntry({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'dark' | 'rupture' | 'reveal' | 'done'>('dark');

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      setPhase('done');
      return;
    }

    const t1 = setTimeout(() => setPhase('rupture'), 400);
    const t2 = setTimeout(() => setPhase('reveal'), 2000);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`cinematic-entry cinematic-entry--${phase}`}
      role="presentation"
      aria-hidden="true"
    >
      <p className="cinematic-rupture">
        Your context is not platform inventory.
      </p>
    </div>
  );
}
