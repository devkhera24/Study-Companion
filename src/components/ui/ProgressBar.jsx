import { useEffect, useState } from 'react';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function ProgressBar({ value = 0, color, label, showPercent = false }) {
  const clamped = clamp(Number(value) || 0, 0, 100);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ui-progress">
      {(label || showPercent) && (
        <div className="ui-progressTop">
          <span className="ui-progressLabel">{label}</span>
          {showPercent ? <span className="ui-progressPct">{clamped}%</span> : null}
        </div>
      )}
      <div className="ui-progressTrack">
        <div
          className={['ui-progressFill', mounted ? 'is-mounted' : ''].join(' ')}
          style={{
            width: mounted ? `${clamped}%` : '0%',
            background: color ?? 'var(--accent-gold)',
          }}
        />
      </div>
    </div>
  );
}
