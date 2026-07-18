import Reveal from './Reveal';
import { passes, GDG } from '@/lib/data';

export default function Ingressos() {
  return (
    <Reveal
      as="section"
      id="ingressos"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 100px', scrollMarginTop: 80 }}
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
          // Ingressos
        </div>
        <h2 style={{ margin: 0, font: '800 46px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
          Garanta seu lugar
        </h2>
        <p
          style={{
            margin: '18px auto 0',
            maxWidth: 440,
            fontSize: 16,
            lineHeight: 1.6,
            color: 'rgba(242,242,247,.6)',
          }}
        >
          Lotes limitados. Quanto antes, melhor o preço.
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 22,
            padding: '9px 18px',
            border: '1px solid rgba(52,168,83,.4)',
            background: 'rgba(52,168,83,.1)',
            borderRadius: 999,
            font: '600 12.5px/1 var(--font-ibm)',
            letterSpacing: '.5px',
            color: '#5bb974',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#34A853',
              boxShadow: '0 0 10px #34A853',
            }}
          />
          Lote atual: 1º lote · aberto
        </div>
      </div>

      <div className="ingressos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'stretch' }}>
        {passes.map((p) => {
          const highlighted = p.featured || p.premium;
          const nameColor = p.accent ?? 'rgba(242,242,247,.6)';
          const subtitleColor = p.accent ?? GDG.blueText;
          const descColor = highlighted ? 'rgba(242,242,247,.72)' : 'rgba(242,242,247,.6)';
          // Root Pass (premium): benefits text takes the gold accent.
          const featColor = p.premium
            ? GDG.yellowText
            : p.featured
              ? 'rgba(242,242,247,.82)'
              : 'rgba(242,242,247,.72)';
          const hairline = highlighted ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.09)';

          const cardBg = p.premium
            ? 'linear-gradient(160deg,rgba(251,188,4,.16),rgba(234,67,53,.07))'
            : p.featured
              ? 'linear-gradient(160deg,rgba(66,133,244,.16),rgba(52,168,83,.1))'
              : 'rgba(255,255,255,.03)';
          const cardBorder = p.premium
            ? '1px solid rgba(251,188,4,.45)'
            : p.featured
              ? '1px solid rgba(66,133,244,.4)'
              : '1px solid rgba(255,255,255,.09)';
          const cardShadow = p.premium
            ? '0 24px 60px -24px rgba(251,188,4,.5)'
            : p.featured
              ? '0 24px 60px -24px rgba(66,133,244,.5)'
              : undefined;
          const badgeBg = p.premium
            ? 'linear-gradient(90deg,#FBBC04,#EA4335)'
            : 'linear-gradient(90deg,#4285F4,#34A853)';

          const button: React.CSSProperties = p.featured
            ? { background: 'linear-gradient(90deg,#4285F4,#34A853)', color: '#fff' }
            : p.premium
              ? { background: 'linear-gradient(90deg,#FBBC04,#F9AB00)', color: '#08080f' }
              : { border: '1px solid rgba(255,255,255,.2)' };

          return (
            <div
              key={p.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '34px 30px',
                background: cardBg,
                border: cardBorder,
                borderRadius: 22,
                position: 'relative',
                boxShadow: cardShadow,
              }}
            >
              {highlighted && p.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '6px 16px',
                    borderRadius: 999,
                    background: badgeBg,
                    color: p.premium ? '#08080f' : '#fff',
                    font: '700 11px var(--font-figtree)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.badge}
                </span>
              )}
              <div
                style={{
                  font: '700 13px/1 var(--font-ibm)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: nameColor,
                }}
              >
                {p.name}
              </div>
              <div style={{ font: '600 13px/1.2 var(--font-figtree)', color: subtitleColor, marginTop: 8 }}>
                {p.tagline}
              </div>
              <div style={{ margin: '20px 0 4px', font: '800 42px/1 var(--font-sora)' }}>{p.price}</div>
              <div style={{ font: '600 12px var(--font-figtree)', color: 'rgba(242,242,247,.5)' }}>
                {p.lote}
              </div>
              <p style={{ margin: '18px 0 0', fontSize: 13.5, lineHeight: 1.6, color: descColor }}>
                {p.desc}
              </p>
              <div style={{ height: 1, background: hairline, margin: '22px 0' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  fontSize: 14,
                  color: featColor,
                  flex: 1,
                }}
              >
                {p.features.map((f, i) => (
                  <div key={i}>✓ {f}</div>
                ))}
              </div>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 26,
                  textAlign: 'center',
                  padding: 14,
                  borderRadius: 999,
                  font: '700 14px var(--font-figtree)',
                  ...button,
                }}
              >
                {p.cta}
              </a>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
