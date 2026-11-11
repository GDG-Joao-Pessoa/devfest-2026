import Reveal from './Reveal';
import { VENUE_ADDRESS } from '@/lib/data';

const infos = [
  { icon: '📍', bg: 'rgba(66,133,244,.16)', text: VENUE_ADDRESS },
  { icon: '🚗', bg: 'rgba(52,168,83,.16)', text: 'Estacionamento no local' },
];

export default function Local() {
  return (
    <Reveal
      as="section"
      id="local"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 90px', scrollMarginTop: 80 }}
    >
      {/* Colunas definidas em .local-grid (globals.css) para poderem empilhar no mobile. */}
      <div className="local-grid" style={{ gap: 40 }}>
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
            // Local
          </div>
          <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
            Uniesp Centro
            <br />
            Universitário
          </h2>
          <p
            style={{
              margin: '24px 0 0',
              fontSize: 16.5,
              lineHeight: 1.7,
              color: 'rgba(242,242,247,.66)',
            }}
          >
            Estrutura completa, auditórios, salas de workshop e área de convivência — na Grande João
            Pessoa, com acesso pela <span style={{ whiteSpace: 'nowrap' }}>BR-230</span> e
            estacionamento.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
            {infos.map((info) => (
              <div key={info.text} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: info.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {info.icon}
                </span>
                <span style={{ fontSize: 15, color: 'rgba(242,242,247,.82)' }}>{info.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="local-map"
          style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,.09)',
          }}
        >
          <iframe
            title="Mapa · Uniesp Centro Universitário, João Pessoa"
            src="https://www.google.com/maps?q=Uniesp+Centro+Universitario+Joao+Pessoa&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ width: '100%', height: '100%', border: 0, filter: 'grayscale(.2) contrast(1.05)' }}
          />
        </div>
      </div>
    </Reveal>
  );
}
