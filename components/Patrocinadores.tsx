import Reveal from './Reveal';

type Tier = {
  label: string;
  labelColor: string;
  cols: number;
  height: number;
  radius: number;
  slots: number;
  text: string;
  fontSize: number;
};

const tiers: Tier[] = [
  {
    label: 'Diamante',
    labelColor: '#8ab4f8',
    cols: 2,
    height: 110,
    radius: 16,
    slots: 2,
    text: '[ logo diamante ]',
    fontSize: 11,
  },
  {
    label: 'Ouro',
    labelColor: '#fcc934',
    cols: 3,
    height: 90,
    radius: 14,
    slots: 3,
    text: '[ logo ]',
    fontSize: 11,
  },
  {
    label: 'Prata & Apoio',
    labelColor: 'rgba(242,242,247,.6)',
    cols: 4,
    height: 72,
    radius: 12,
    slots: 4,
    text: '[ logo ]',
    fontSize: 10,
  },
];

export default function Patrocinadores() {
  return (
    <Reveal
      as="section"
      id="patrocinadores"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 90px' }}
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
          // Patrocinadores
        </div>
        <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
          Feito com quem acredita
        </h2>
      </div>

      {tiers.map((tier, ti) => (
        <div key={tier.label} style={{ marginBottom: ti === tiers.length - 1 ? 36 : 30 }}>
          <div
            style={{
              font: '700 12px/1 var(--font-ibm)',
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: tier.labelColor,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            {tier.label}
          </div>
          <div
            className="sponsor-grid"
            style={{ display: 'grid', gridTemplateColumns: `repeat(${tier.cols},1fr)`, gap: tier.cols === 4 ? 14 : 16 }}
          >
            {Array.from({ length: tier.slots }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: tier.height,
                  background: 'rgba(255,255,255,.03)',
                  border: '1px solid rgba(255,255,255,.09)',
                  borderRadius: tier.radius,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: `500 ${tier.fontSize}px var(--font-ibm)`,
                  color: 'rgba(242,242,247,.3)',
                }}
              >
                {tier.text}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center' }}>
        <a
          href="#ingressos"
          style={{
            padding: '13px 26px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,.2)',
            font: '700 13px var(--font-figtree)',
            display: 'inline-block',
          }}
        >
          Seja um patrocinador →
        </a>
      </div>
    </Reveal>
  );
}
