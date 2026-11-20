// ---------------------------------------------------------------------------
// Atividades com inscrição (vagas limitadas). Fonte única do conteúdo das
// páginas /inscricoes/<rota>, da faixa de aviso e dos cards da home.
// O formulário pede só nome, e-mail e WhatsApp (app/inscricoes/actions.ts).
//
// Vagas, abertura e encerramento ficam no Supabase (tabela `atividades`,
// ver supabase/migrations) para a organização mudar sem novo deploy.
// ---------------------------------------------------------------------------

import { schedule } from '@/data/schedule';
import { GDG } from '@/lib/data';

export type SlugAtividade = 'code-in-the-dark' | 'workshop-adk';

export type Atividade = {
  slug: SlugAtividade;
  /** /inscricoes/<rota> */
  rota: string;
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  /** Resumo curto (card da home e meta description). */
  resumo: string;
  /** Rótulo curto da faixa de aviso no topo do site (components/FaixaInscricoes.tsx). */
  chamada: string;
  /**
   * Quando a atividade sai da faixa de aviso. Mesmo horário de
   * `atividades.encerra_em` no Supabase (que é quem de fato fecha as inscrições).
   */
  encerraEm: string;
  descricao: string[];
  /** `null` mostra "a confirmar". */
  quando: string | null;
  onde: string | null;
  com: { nome: string; cargo: string } | null;
  /** Título da lista de destaques (regras, o que esperar...). */
  destaquesTitulo: string;
  destaques: string[];
  cor: string;
  corTexto: string;
};

/** "Sábado · 21/11 · 17:00" a partir de um item da programação. */
function quandoNaProgramacao(label: string): { quando: string; onde: string | null } | null {
  for (const day of schedule) {
    const item = day.items.find((i) => i.type !== 'sessions' && i.label.startsWith(label));
    if (item && item.type !== 'sessions') {
      const [, mes, dia] = day.date.split('-');
      return { quando: `${day.day} · ${dia}/${mes} · ${item.time}`, onde: item.room };
    }
  }
  return null;
}

const codeInTheDarkNaProgramacao = quandoNaProgramacao('Code in the Dark');

export const atividades: Record<SlugAtividade, Atividade> = {
  'code-in-the-dark': {
    slug: 'code-in-the-dark',
    rota: 'code-in-the-dark',
    eyebrow: '// Competição',
    titulo: 'Code in the Dark',
    subtitulo: 'HTML, CSS e nenhum preview. Coragem é opcional, a plateia não.',
    resumo:
      'Recrie uma página do zero sem ver o resultado enquanto programa. A plateia escolhe quem chegou mais perto.',
    chamada: 'Code in the Dark · sáb 17h',
    encerraEm: '2026-11-21T17:00:00-03:00',
    descricao: [
      'O Code in the Dark é a competição de front-end que fecha o DevFest. Cada participante recebe a imagem de uma página e tem poucos minutos para recriá-la só com HTML e CSS, sem nunca ver o resultado no navegador.',
      'No fim, as telas são reveladas ao mesmo tempo e a plateia escolhe quem chegou mais perto. Tudo isso no clima do happy hour de encerramento.',
    ],
    quando: codeInTheDarkNaProgramacao?.quando ?? null,
    onde: codeInTheDarkNaProgramacao?.onde ?? null,
    com: null,
    destaquesTitulo: 'Regras',
    destaques: [
      'Só HTML e CSS, em um editor sem preview.',
      'Nada de inspecionar elementos, frameworks ou consultas à internet.',
      'Tempo curto e igual para todo mundo.',
      'A plateia vota no resultado mais fiel à referência.',
    ],
    cor: GDG.red,
    corTexto: GDG.redText,
  },
  'workshop-adk': {
    slug: 'workshop-adk',
    rota: 'workshop',
    eyebrow: '// Workshop',
    titulo: 'Construindo um assistente de revisão de código com IA para ambiente de produção usando o Google ADK',
    subtitulo: 'Com Arnaldo Gualberto, AI Tech Lead e Google Developer Expert em IA.',
    resumo:
      'Do zero a um assistente de code review com IA pronto para produção, usando o Agent Development Kit do Google.',
    chamada: 'Workshop de IA com Arnaldo Gualberto · sex 14h',
    encerraEm: '2026-11-20T14:00:00-03:00',
    descricao: [
      'Neste workshop, Arnaldo Gualberto mostra como construir um assistente de revisão de código com IA usando o Google ADK (Agent Development Kit) e o que muda quando ele precisa rodar em ambiente de produção.',
      'As vagas são limitadas. Quando elas acabam, novas inscrições entram na lista de espera, por ordem de chegada.',
    ],
    quando: 'Sexta-feira · 20/11 · 14:00',
    onde: 'Laboratório 11',
    com: { nome: 'Arnaldo Gualberto', cargo: 'AI Tech Lead · Google Developer Expert em IA' },
    destaquesTitulo: 'O que esperar',
    destaques: [
      'Agentes com o Google ADK, na prática.',
      'Um assistente de revisão de código com IA.',
      'O que é preciso para levar um agente para produção.',
    ],
    cor: GDG.blue,
    corTexto: GDG.blueText,
  },
};

export const listaAtividades = Object.values(atividades);

export const atividadePorRota = (rota: string) => listaAtividades.find((a) => a.rota === rota);

export const isSlugAtividade = (s: unknown): s is SlugAtividade =>
  typeof s === 'string' && s in atividades;

/** Situação lida do Supabase (`situacao_atividade`). */
export type Situacao = {
  vagas: number;
  confirmadas: number;
  /** Limite da lista de espera; `null` = sem limite. */
  vagas_espera: number | null;
  em_espera: number;
  abertas: boolean;
};

export const vagasRestantes = (s: Situacao) => Math.max(0, s.vagas - s.confirmadas);

/**
 * Selo "Últimas vagas": restam 20% das vagas ou menos (no mínimo 2).
 * Code in the Dark (9 vagas) → 2 ou menos; workshop (40) → 8 ou menos.
 */
export const ultimasVagas = (s: Situacao) => {
  const restantes = vagasRestantes(s);
  return restantes > 0 && restantes <= Math.max(2, Math.ceil(s.vagas * 0.2));
};

/** Lugares livres na lista de espera; `null` = sem limite. */
export const esperaRestante = (s: Situacao) =>
  s.vagas_espera === null ? null : Math.max(0, s.vagas_espera - s.em_espera);
