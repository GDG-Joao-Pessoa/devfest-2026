// ---------------------------------------------------------------------------
// Atividades com inscrição (vagas limitadas). Fonte única das páginas
// /inscricoes/<rota>, do formulário e da validação no servidor
// (app/inscricoes/actions.ts).
//
// Vagas, abertura e encerramento ficam no Supabase (tabela `atividades`,
// ver supabase/migrations) para a organização mudar sem novo deploy.
// ---------------------------------------------------------------------------

import { schedule } from '@/data/schedule';
import { GDG } from '@/lib/data';

export type SlugAtividade = 'code-in-the-dark' | 'workshop-adk';

type Opcao = { valor: string; rotulo: string };

/** Pergunta extra da atividade. A resposta vai para `inscricoes.respostas[nome]`. */
export type Campo =
  | {
      tipo: 'texto';
      nome: string;
      rotulo: string;
      obrigatorio: boolean;
      max: number;
      placeholder?: string;
      autoComplete?: string;
      ajuda?: string;
    }
  | { tipo: 'opcoes'; nome: string; rotulo: string; opcoes: Opcao[]; ajuda?: string }
  | { tipo: 'simnao'; nome: string; rotulo: string; ajuda?: string };

export type Atividade = {
  slug: SlugAtividade;
  /** /inscricoes/<rota> */
  rota: string;
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  /** Resumo curto (card da home e meta description). */
  resumo: string;
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
  campos: Campo[];
  /** Caixas que precisam ser marcadas para enviar (não são gravadas). */
  confirmacoes: string[];
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

const CONFIRMACAO_INGRESSO = 'Tenho ingresso para o DevFest João Pessoa 2026.';

export const atividades: Record<SlugAtividade, Atividade> = {
  'code-in-the-dark': {
    slug: 'code-in-the-dark',
    rota: 'code-in-the-dark',
    eyebrow: '// Competição',
    titulo: 'Code in the Dark',
    subtitulo: 'HTML, CSS e nenhum preview. Coragem é opcional, a plateia não.',
    resumo:
      'Recrie uma página do zero sem ver o resultado enquanto programa. A plateia escolhe quem chegou mais perto.',
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
    campos: [
      {
        tipo: 'texto',
        nome: 'github',
        rotulo: 'GitHub ou portfólio',
        obrigatorio: false,
        max: 200,
        placeholder: 'github.com/seu-usuario',
        autoComplete: 'url',
      },
      {
        tipo: 'opcoes',
        nome: 'experiencia',
        rotulo: 'Experiência com HTML e CSS',
        opcoes: [
          { valor: 'iniciante', rotulo: 'Iniciante: estou aprendendo' },
          { valor: 'intermediario', rotulo: 'Intermediário: já fiz alguns sites' },
          { valor: 'avancado', rotulo: 'Avançado: CSS é meu playground' },
        ],
      },
      { tipo: 'simnao', nome: 'ja_participou', rotulo: 'Já participou de um Code in the Dark?' },
    ],
    confirmacoes: [CONFIRMACAO_INGRESSO, 'Li e aceito as regras da competição.'],
  },
  'workshop-adk': {
    slug: 'workshop-adk',
    rota: 'workshop',
    eyebrow: '// Workshop',
    titulo: 'Construindo um assistente de revisão de código com IA para ambiente de produção usando o Google ADK',
    subtitulo: 'Com Arnaldo Gualberto, AI Tech Lead e Google Developer Expert em IA.',
    resumo:
      'Do zero a um assistente de code review com IA pronto para produção, usando o Agent Development Kit do Google.',
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
    campos: [
      {
        tipo: 'texto',
        nome: 'empresa',
        rotulo: 'Empresa ou instituição',
        obrigatorio: false,
        max: 120,
        autoComplete: 'organization',
      },
      {
        tipo: 'opcoes',
        nome: 'area',
        rotulo: 'Área de atuação',
        opcoes: [
          { valor: 'backend', rotulo: 'Back-end' },
          { valor: 'frontend', rotulo: 'Front-end' },
          { valor: 'fullstack', rotulo: 'Full-stack' },
          { valor: 'mobile', rotulo: 'Mobile' },
          { valor: 'dados-ia', rotulo: 'Dados & IA' },
          { valor: 'devops', rotulo: 'DevOps, SRE ou Cloud' },
          { valor: 'estudante', rotulo: 'Estudante' },
          { valor: 'outra', rotulo: 'Outra' },
        ],
      },
      {
        tipo: 'opcoes',
        nome: 'nivel_python',
        rotulo: 'Nível em Python',
        opcoes: [
          { valor: 'nunca', rotulo: 'Nunca usei' },
          { valor: 'basico', rotulo: 'Básico' },
          { valor: 'intermediario', rotulo: 'Intermediário' },
          { valor: 'avancado', rotulo: 'Avançado' },
        ],
      },
      {
        tipo: 'simnao',
        nome: 'leva_notebook',
        rotulo: 'Vai levar notebook?',
        ajuda: 'Ajuda a organização a preparar a sala.',
      },
    ],
    confirmacoes: [CONFIRMACAO_INGRESSO],
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

/** Lugares livres na lista de espera; `null` = sem limite. */
export const esperaRestante = (s: Situacao) =>
  s.vagas_espera === null ? null : Math.max(0, s.vagas_espera - s.em_espera);
