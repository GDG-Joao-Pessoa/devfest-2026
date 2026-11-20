import SecaoInscricoes from './SecaoInscricoes';
import { dentroDaJanela, janelaDe, listaAtividades } from '@/lib/inscricoes';

/**
 * Seção da home (#inscricoes): atividades com vagas limitadas. Cada card só
 * aparece dentro da janela de inscrição da atividade (components/NaJanela.tsx).
 */
export default function Inscricoes() {
  const agora = Date.now();
  const cards = listaAtividades.map((a) => ({
    slug: a.slug,
    href: `/inscricoes/${a.rota}`,
    cor: a.cor,
    corTexto: a.corTexto,
    eyebrow: a.eyebrow.replace('// ', ''),
    titulo: a.titulo,
    com: a.com?.nome ?? null,
    resumo: a.resumo,
    quando: a.quando ?? 'Horário a confirmar',
    janela: janelaDe(a),
    inicial: dentroDaJanela(janelaDe(a), agora),
  }));
  return <SecaoInscricoes cards={cards} />;
}
