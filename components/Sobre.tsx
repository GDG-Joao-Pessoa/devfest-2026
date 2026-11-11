import Reveal from './Reveal';

const stats = [
  { value: '25+', label: 'Palestras & workshops', color: '#4285F4' },
  { value: '600', label: 'Participantes esperados', color: '#34A853' },
  { value: '04', label: 'Trilhas técnicas', color: '#FBBC04' },
  { value: '02', label: 'Dias de imersão', color: '#EA4335' },
];

const eyebrow: React.CSSProperties = {
  font: '600 12px/1 var(--font-ibm)',
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: '#8ab4f8',
  marginBottom: 20,
};

export default function Sobre() {
  return (
    <Reveal
      as="section"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '110px 40px 90px' }}
    >
      <div className="sobre-grid">
        <div>
          <div style={eyebrow}>// Sobre o evento</div>
          <h2 style={{ margin: 0, font: '800 46px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
            Onde a comunidade
            <br />
            vira movimento.
          </h2>
          <p
            style={{
              margin: '26px 0 0',
              fontSize: 16.5,
              lineHeight: 1.7,
              color: 'rgba(242,242,247,.66)',
            }}
          >
            O DevFest é o encontro anual do Google Developer Groups João Pessoa. Reunimos quem
            constrói o futuro da tecnologia na Paraíba: estudantes, profissionais, empresas e
            apaixonados por código, num ambiente de aprendizado, networking e inspiração.
          </p>
          <p
            style={{
              margin: '18px 0 0',
              fontSize: 16.5,
              lineHeight: 1.7,
              color: 'rgba(242,242,247,.66)',
            }}
          >
            Dois dias, quatro trilhas técnicas e palestrantes de referência nacional — tudo com a
            energia da nossa comunidade.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                padding: '30px 26px',
                background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 18,
              }}
            >
              <div style={{ font: '800 44px/1 var(--font-sora)', color: s.color }}>{s.value}</div>
              <div
                style={{
                  font: '600 13px/1.4 var(--font-figtree)',
                  color: 'rgba(242,242,247,.6)',
                  marginTop: 12,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
