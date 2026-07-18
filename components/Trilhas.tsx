import Reveal from './Reveal';
import { tracks } from '@/lib/data';

function rgb(hex: string) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

export default function Trilhas() {
  return (
    <Reveal
      as="section"
      id="trilhas"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 90px', scrollMarginTop: 80 }}
    >
      <div
        className="trilhas-header"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 44,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              font: '600 12px/1 var(--font-ibm)',
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: '#8ab4f8',
              marginBottom: 16,
            }}
          >
            // Trilhas
          </div>
          <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
            Quatro trilhas, um só destino.
          </h2>
        </div>
        <p
          style={{
            maxWidth: 340,
            fontSize: 15,
            lineHeight: 1.6,
            color: 'rgba(242,242,247,.6)',
            margin: 0,
          }}
        >
          Escolha seu caminho — ou circule por todos. Conteúdo do iniciante ao avançado em cada
          trilha.
        </p>
      </div>
      <div className="trilhas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
        {tracks.map((t) => {
          const c = rgb(t.color);
          return (
            <div
              key={t.n}
              style={{
                position: 'relative',
                padding: '36px 32px',
                background: `rgba(${c},.07)`,
                border: `1px solid rgba(${c},.25)`,
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: `radial-gradient(circle,rgba(${c},.3),transparent 65%)`,
                }}
              />
              <div style={{ font: '700 13px/1 var(--font-ibm)', color: t.text }}>{t.n}</div>
              <h3 style={{ margin: '16px 0 0', font: '800 28px/1 var(--font-sora)' }}>{t.title}</h3>
              <p
                style={{
                  margin: '14px 0 0',
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: 'rgba(242,242,247,.62)',
                }}
              >
                {t.desc}
              </p>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
