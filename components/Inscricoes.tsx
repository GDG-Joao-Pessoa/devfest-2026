import Link from 'next/link';
import Reveal from './Reveal';
import { listaAtividades } from '@/lib/inscricoes';

/** Seção da home (#inscricoes): atividades com vagas limitadas. */
export default function Inscricoes() {
  return (
    <Reveal
      as="section"
      id="inscricoes"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 90px', scrollMarginTop: 80 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div
          style={{
            font: '600 12px/1 var(--font-ibm)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#8ab4f8',
            marginBottom: 16,
          }}
        >
          // Inscrições
        </div>
        <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
          Vagas limitadas
        </h2>
        <p
          style={{
            margin: '18px auto 0',
            maxWidth: 520,
            fontSize: 16,
            lineHeight: 1.6,
            color: 'rgba(242,242,247,.66)',
          }}
        >
          Algumas atividades têm lugares contados. Garanta o seu com uma inscrição rápida, separada do
          ingresso.
        </p>
      </div>

      <div className="insc-home-grid">
        {listaAtividades.map((a) => (
          <Link
            key={a.slug}
            href={`/inscricoes/${a.rota}`}
            className="insc-home-card"
            style={{ '--insc-cor': a.cor, '--insc-cor-texto': a.corTexto } as React.CSSProperties}
          >
            <span className="insc-home-eyebrow">{a.eyebrow.replace('// ', '')}</span>
            <h3 className="insc-home-titulo">{a.titulo}</h3>
            {a.com && <span className="insc-home-com">com {a.com.nome}</span>}
            <p className="insc-home-texto">{a.resumo}</p>
            <span className="insc-home-meta">{a.quando ?? 'Horário a confirmar'}</span>
            <span className="insc-home-cta">Quero me inscrever →</span>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
