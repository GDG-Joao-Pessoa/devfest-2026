'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import { sessions, trackStyle } from '@/lib/data';

const tabBase: React.CSSProperties = {
  padding: '13px 26px',
  borderRadius: 999,
  font: '700 14px var(--font-figtree)',
  cursor: 'pointer',
  transition: 'all .2s',
  border: '1px solid rgba(255,255,255,.14)',
};

const tabActive: React.CSSProperties = {
  ...tabBase,
  background: 'linear-gradient(90deg,#4285F4,#34A853)',
  color: '#fff',
  borderColor: 'transparent',
};

const tabIdle: React.CSSProperties = {
  ...tabBase,
  background: 'transparent',
  color: 'rgba(242,242,247,.7)',
};

export default function Agenda() {
  const [day, setDay] = useState<1 | 2>(1);
  const list = sessions[day];

  return (
    <Reveal
      as="section"
      id="agenda"
      style={{ maxWidth: 1000, margin: '0 auto', padding: '70px 40px 90px', scrollMarginTop: 80 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            font: '600 12px/1 var(--font-ibm)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#8ab4f8',
            marginBottom: 16,
          }}
        >
          // Programação
        </div>
        <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
          Dois dias, uma jornada
        </h2>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 38, flexWrap: 'wrap' }}>
        <button style={day === 1 ? tabActive : tabIdle} onClick={() => setDay(1)}>
          Dia 1 · 20 Nov
        </button>
        <button style={day === 2 ? tabActive : tabIdle} onClick={() => setDay(2)}>
          Dia 2 · 21 Nov
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map((s, i) => {
          const ts = trackStyle[s.track];
          return (
            <div
              key={`${day}-${i}`}
              className="agenda-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: 24,
                alignItems: 'center',
                padding: '22px 26px',
                background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 16,
              }}
            >
              <div style={{ font: '700 15px var(--font-ibm)', color: '#8ab4f8' }}>{s.time}</div>
              <div>
                <div style={{ font: '700 18px/1.2 var(--font-sora)' }}>{s.title}</div>
                <div
                  style={{
                    font: '600 13px/1.4 var(--font-figtree)',
                    color: 'rgba(242,242,247,.55)',
                    marginTop: 6,
                  }}
                >
                  {s.speaker}
                </div>
              </div>
              <span
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  font: '600 11px/1 var(--font-ibm)',
                  letterSpacing: '.5px',
                  textTransform: 'uppercase',
                  color: ts.color,
                  background: ts.bg,
                  justifySelf: 'start',
                }}
              >
                {s.track}
              </span>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
