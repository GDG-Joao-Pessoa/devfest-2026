import Reveal from './Reveal';
import { speakers } from '@/lib/data';

export default function Palestrantes() {
  return (
    <Reveal
      as="section"
      id="palestrantes"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 90px', scrollMarginTop: 80 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div
          style={{
            font: '600 12px/1 var(--font-ibm)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#8ab4f8',
            marginBottom: 16,
          }}
        >
          // Palestrantes
        </div>
        <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
          Quem sobe ao palco
        </h2>
        <p
          style={{
            margin: '18px auto 0',
            maxWidth: 480,
            fontSize: 16,
            lineHeight: 1.6,
            color: 'rgba(242,242,247,.6)',
          }}
        >
          Referências nacionais e talentos da nossa comunidade. Line-up completo em breve.
        </p>
      </div>
      <div className="speakers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        {speakers.map((sp, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,.03)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 18,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                aspectRatio: '1 / 1',
                background:
                  'repeating-linear-gradient(135deg,#15151f,#15151f 10px,#111119 10px,#111119 20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <span style={{ font: '500 10px var(--font-ibm)', color: 'rgba(242,242,247,.32)' }}>
                [ foto ]
              </span>
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  width: 26,
                  height: 6,
                  borderRadius: 3,
                  background: sp.color,
                }}
              />
            </div>
            <div style={{ padding: '18px 18px 22px' }}>
              <div style={{ font: '700 17px/1.2 var(--font-sora)' }}>{sp.name}</div>
              <div
                style={{
                  font: '600 12.5px/1.4 var(--font-figtree)',
                  color: 'rgba(242,242,247,.55)',
                  marginTop: 7,
                }}
              >
                {sp.role}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 36 }}>
        <a href="#ingressos" style={{ font: '700 14px var(--font-figtree)', color: '#8ab4f8' }}>
          Quer palestrar? Envie sua proposta →
        </a>
      </div>
    </Reveal>
  );
}
