import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import InscricaoForm from '@/components/InscricaoForm';
import {
  esperaRestante,
  ultimasVagas,
  vagasRestantes,
  type Atividade,
  type Situacao,
} from '@/lib/inscricoes';
import { rpc } from '@/lib/supabase';

async function lerSituacao(atividade: Atividade): Promise<Situacao | null> {
  const res = await rpc<Situacao | null>('situacao_atividade', { p_atividade: atividade.slug });
  return res.ok ? res.data : null;
}

/** Página /inscricoes/<rota>: informações da atividade + formulário. */
export default async function InscricaoPagina({ atividade }: { atividade: Atividade }) {
  // Se o Supabase não responder, a página abre sem o selo; o envio mostra o erro.
  const situacao = await lerSituacao(atividade);
  const restantes = situacao ? vagasRestantes(situacao) : null;
  const espera = situacao ? esperaRestante(situacao) : null;
  const encerrada = situacao ? !situacao.abertas : false;
  const esgotado = restantes === 0;
  /** Vagas e lista de espera (com limite) completas. */
  const lotado = esgotado && espera === 0;

  const meta = [
    { rotulo: 'Quando', valor: atividade.quando ?? 'A confirmar' },
    { rotulo: 'Onde', valor: atividade.onde ?? 'A confirmar' },
    ...(atividade.com ? [{ rotulo: 'Com', valor: `${atividade.com.nome} · ${atividade.com.cargo}` }] : []),
  ];

  return (
    <div className="page">
      <Nav base="/" />
      <main>
        <section
          className="insc"
          style={{ '--insc-cor': atividade.cor, '--insc-cor-texto': atividade.corTexto } as React.CSSProperties}
        >
          <Link href="/#inscricoes" className="spk-back-link">
            ← Voltar para o início
          </Link>

          <div className="insc-grid">
            <div className="insc-info">
              <div className="insc-eyebrow">{atividade.eyebrow}</div>
              <h1 className="insc-titulo">{atividade.titulo}</h1>
              <p className="insc-subtitulo">{atividade.subtitulo}</p>

              {situacao && <Selo situacao={situacao} encerrada={encerrada} lotado={lotado} />}

              <dl className="insc-meta">
                {meta.map((m) => (
                  <div key={m.rotulo}>
                    <dt>{m.rotulo}</dt>
                    <dd>{m.valor}</dd>
                  </div>
                ))}
              </dl>

              {atividade.descricao.map((p, i) => (
                <p key={i} className="insc-texto">
                  {p}
                </p>
              ))}

              <h2 className="insc-destaques-titulo">{atividade.destaquesTitulo}</h2>
              <ul className="insc-destaques">
                {atividade.destaques.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="insc-card">
              {/* Sempre montado: quem acabou de pegar a última vaga precisa ver a
                  confirmação, mesmo que a página já venha renderizada como lotada. */}
              <InscricaoForm
                slug={atividade.slug}
                titulo={atividade.titulo}
                esgotado={esgotado}
                fechado={encerrada ? 'encerrada' : lotado ? 'lotada' : null}
                cabecalho={
                  esgotado
                    ? {
                        titulo: 'Lista de espera',
                        texto:
                          'As vagas acabaram, mas você ainda pode entrar na lista de espera. Chamamos por ordem de inscrição.',
                      }
                    : {
                        titulo: 'Faça sua inscrição',
                        texto: 'Leva menos de um minuto. Uma inscrição por e-mail.',
                      }
                }
              />
            </div>
          </div>
        </section>
      </main>
      <Footer base="/" />
    </div>
  );
}

/** Selo de situação, sem números: a organização não quer expor quantas vagas restam. */
function Selo({
  situacao,
  encerrada,
  lotado,
}: {
  situacao: Situacao;
  encerrada: boolean;
  lotado: boolean;
}) {
  const [texto, variante] = encerrada
    ? ['Inscrições encerradas', 'encerrada']
    : lotado
      ? ['Vagas esgotadas', 'encerrada']
      : vagasRestantes(situacao) === 0
        ? ['Vagas esgotadas · lista de espera aberta', 'esgotada']
        : ultimasVagas(situacao)
          ? ['Últimas vagas', 'ultimas']
          : ['Vagas limitadas', 'aberta'];

  return (
    <div className={`insc-selo insc-selo--${variante}`}>
      <span className="insc-selo-ponto" aria-hidden="true" />
      {texto}
    </div>
  );
}
