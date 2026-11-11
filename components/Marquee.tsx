const items = [
  { label: 'IA & Machine Learning', dot: '#4285F4' },
  { label: 'Web Moderna', dot: '#34A853' },
  { label: 'Mobile', dot: '#FBBC04' },
  { label: 'Cloud & DevOps', dot: '#EA4335' },
  { label: 'Comunidade', dot: '#4285F4' },
];

const GAP = 44;

/**
 * Quantas vezes a lista se repete em cada metade da faixa. Cada metade precisa
 * ser mais larga que a tela; com uma lista só (~1.340px) sobrava espaço vazio
 * no fim do ciclo em telas largas. 3× cobre monitores de até ~4.000px.
 */
const REPEAT = 3;

/** Segundos para rolar uma lista inteira (velocidade original da faixa). */
const SECONDS_PER_LIST = 28;

/**
 * Metade da faixa. O espaçamento final vai como padding (e não como `gap`
 * entre as metades) para que -50% do track seja exatamente uma metade e o
 * loop não dê "pulo".
 */
function Half({ decorative }: { decorative?: boolean }) {
  return (
    <div
      aria-hidden={decorative || undefined}
      style={{ display: 'flex', alignItems: 'center', gap: GAP, paddingRight: GAP, flexShrink: 0 }}
    >
      {Array.from({ length: REPEAT }, (_, r) =>
        items.map((it, i) => (
          <span
            key={`${r}-${i}`}
            // leitores de tela ouvem a lista uma vez só
            aria-hidden={r > 0 || undefined}
            style={{ display: 'inline-flex', gap: GAP, alignItems: 'center' }}
          >
            <span>{it.label}</span>
            <span style={{ color: it.dot }} aria-hidden="true">
              ◆
            </span>
          </span>
        )),
      )}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,.07)',
        borderBottom: '1px solid rgba(255,255,255,.07)',
        padding: '20px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `marq ${SECONDS_PER_LIST * REPEAT}s linear infinite`,
          font: '700 22px var(--font-sora)',
          color: 'rgba(242,242,247,.28)',
        }}
      >
        <Half />
        <Half decorative />
      </div>
    </div>
  );
}
