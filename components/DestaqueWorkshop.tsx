import Image from 'next/image';
import Link from 'next/link';
import NaJanela from './NaJanela';
import { atividades, dentroDaJanela, janelaDe } from '@/lib/inscricoes';

/**
 * Destaque logo após o hero: workshop do Arnaldo Gualberto (Google ADK).
 * Conteúdo vem de lib/inscricoes.ts; o bloco só aparece enquanto as inscrições
 * estão abertas e some sozinho no encerramento (components/NaJanela.tsx).
 */
export default function DestaqueWorkshop() {
  const a = atividades['workshop-adk'];
  const janela = janelaDe(a);

  return (
    <NaJanela janela={janela} inicial={dentroDaJanela(janela, Date.now())}>
      <section className="dw" aria-labelledby="dw-titulo">
        <div className="dw-card">
          <div className="dw-photo">
            <Image
              src="/assets/speakers/arnaldo-gualberto.webp"
              alt={a.com?.nome ?? ''}
              width={640}
              height={880}
              sizes="(max-width: 700px) 100vw, 280px"
              unoptimized
              priority
            />
          </div>
          <div className="dw-body">
            <span className="dw-eyebrow">
              <span className="dw-dot" aria-hidden="true" />
              Workshop · vagas limitadas
            </span>
            <h2 id="dw-titulo" className="dw-title">
              {a.titulo}
            </h2>
            {a.com && (
              <p className="dw-com">
                com <strong>{a.com.nome}</strong> · {a.com.cargo}
              </p>
            )}
            <p className="dw-meta">
              {a.quando ?? 'Horário a confirmar'}
              {a.onde && <> · {a.onde}</>}
            </p>
            <ul className="dw-points">
              {a.destaques.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <Link href={`/inscricoes/${a.rota}`} className="dw-cta">
              Quero me inscrever →
            </Link>
          </div>
        </div>
      </section>
    </NaJanela>
  );
}
