'use client';

import { useEffect, useState } from 'react';
import { EVENT, GDG } from '@/lib/data';

const pad = (n: number) => String(n).padStart(2, '0');

function diffParts(target: number, now: number) {
  let diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  diff -= d * 86400000;
  const h = Math.floor(diff / 3600000);
  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);
  diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  return { d: pad(d), h: pad(h), m: pad(m), s: pad(s) };
}

const blocks = [
  { key: 'd', label: 'Dias', color: GDG.blueText },
  { key: 'h', label: 'Horas', color: GDG.greenText },
  { key: 'm', label: 'Min', color: GDG.yellowText },
  { key: 's', label: 'Seg', color: GDG.redText },
] as const;

export default function Countdown() {
  const target = new Date(EVENT.targetDate).getTime();
  // Start from a stable value so server and first client render match, then tick.
  const [cd, setCd] = useState(() => diffParts(target, target));

  useEffect(() => {
    const tick = () => setCd(diffParts(target, Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [target]);

  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        justifyContent: 'center',
        marginTop: 56,
        flexWrap: 'wrap',
      }}
    >
      {blocks.map((b) => (
        <div
          key={b.key}
          style={{
            minWidth: 88,
            padding: '16px 10px',
            background: 'rgba(255,255,255,.04)',
            border: '1px solid rgba(255,255,255,.09)',
            borderRadius: 14,
          }}
        >
          <div style={{ font: '800 34px/1 var(--font-sora)', color: b.color }}>
            {cd[b.key]}
          </div>
          <div
            style={{
              font: '600 10px/1 var(--font-ibm)',
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'rgba(242,242,247,.5)',
              marginTop: 8,
            }}
          >
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
}
