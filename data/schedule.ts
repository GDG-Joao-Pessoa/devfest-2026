// ---------------------------------------------------------------------------
// Programação do DevFest João Pessoa 2026 — fonte única da seção #programacao,
// dos arquivos .ics (/ics/[sessao].ics) e do JSON-LD do evento.
//
// Regras de horário (ver lib/schedule.ts):
// - cada sessão dura 40 minutos;
// - intervalos e coffee breaks vão até o início do próximo bloco;
// - horários no fuso America/Recife (UTC−03:00, sem horário de verão).
// ---------------------------------------------------------------------------

export type Room = 'Auditório Master' | 'Auditório Executivo' | 'Ambos os auditórios';

export type Session = {
  room: Room;
  speakers: string[];
  title: string;
  format: 'palestra' | 'workshop';
  /** Selo do palestrante. Hoje nenhum é exibido (todos `null`), a pedido da organização. */
  badge: 'GDE' | 'Googler' | 'Convidada' | 'Convidado' | null;
};

export type ScheduleItem =
  | { time: string; type: 'sessions'; sessions: Session[] }
  | { time: string; type: 'break' | 'highlight'; label: string; room: Room | null };

export type ScheduleDay = { day: string; date: string; items: ScheduleItem[] };

export const schedule: ScheduleDay[] = [
  {
    day: 'Sexta-feira',
    date: '2026-11-20',
    items: [
      { time: '08:30', type: 'break', label: 'Credenciamento + Coffee Break', room: null },
      {
        time: '09:30',
        type: 'break',
        label: 'Abertura oficial · Boas-vindas do GDG João Pessoa',
        room: 'Auditório Master',
      },
      {
        time: '10:00',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Gabriel Moreira'],
            title: 'Colocando suas LLMs para trabalhar... Sistemas Agênticos com ADK, Gemini e GCP',
            format: 'workshop',
            badge: null,
          },
        ],
      },
      {
        time: '10:40',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Raissa Martins'],
            title: 'Como ser um desenvolvedor melhor: o que SRE me ensinou sobre código',
            format: 'palestra',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Wuldson Franco'],
            title: 'Na era dos agentes de IA, Machine Learning ainda importa?',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      {
        time: '11:20',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Ahirton Lopes'],
            title: 'Agent Foundry: Engenharia e Construção de Agentes com Google ADK',
            format: 'palestra',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Beatriz Pereira'],
            title:
              'RegulAI: agentes de IA a serviço da regulação no SUS, do agendamento à decisão médica',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      { time: '12:00', type: 'break', label: 'Intervalo', room: null },
      {
        time: '14:00',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Diogines Augusto'],
            title: 'Carreira sem crachá para devs: startups, freelas e produtos próprios',
            format: 'palestra',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Felipe Barbosa'],
            title:
              'Poisoning the Prompt: Explorando a manipulação de IAs através de documentos maliciosos',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      {
        time: '14:40',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Weslley Araújo'],
            title: 'Você realmente sabe alguma coisa sobre segurança?',
            format: 'palestra',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Nathalia Nasz'],
            title:
              'Autonomous Enterprise: Como a IA Joule Transforma os hábitos de consumo do Futuro',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      { time: '15:20', type: 'break', label: 'Intervalo', room: 'Ambos os auditórios' },
      {
        time: '15:40',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['William Grasel'],
            title: 'Explodindo sua mente com TypeScript',
            format: 'workshop',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Naamã Souza'],
            title:
              'Aonde você pretende chegar com a IA? Sua carreira é sua única Startup e você precisa de um excelente Roadmap!',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      {
        time: '16:20',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Karol Attekita'],
            title: 'O Programador Generalista e a IA Generativa',
            format: 'palestra',
            badge: null,
          },
        ],
      },
    ],
  },
  {
    day: 'Sábado',
    date: '2026-11-21',
    items: [
      { time: '08:30', type: 'break', label: 'Credenciamento + Coffee Break', room: null },
      {
        time: '09:30',
        type: 'break',
        label: 'Abertura oficial · Boas-vindas do GDG João Pessoa',
        room: 'Auditório Master',
      },
      {
        time: '10:00',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Ana Sabino'],
            title: 'Google SecOps: Gemini aplicado à Cibersegurança',
            format: 'palestra',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Airton Lira'],
            title: 'Além do Harness: Loop Engineering e a Próxima Era dos Agentes de IA',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      {
        time: '10:40',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Arnaldo Gualberto'],
            title: 'Gêmeo Digital: Treinando uma IA com Minha Própria Personalidade',
            format: 'workshop',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Caroline Araujo', 'Dinah Dantas'],
            title: 'Gemini e BigQuery na Triagem de TEA: Dados Sintéticos para a Saúde Pública',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      {
        time: '11:20',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Juliana Saraiva'],
            title: 'Sua IA age. Agora, você precisa explicar! Sabe como?',
            format: 'palestra',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Daniel Brandão'],
            title: 'Mapa de Carreira Tech: O Que Separa Você da Próxima Vaga como Dev',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      { time: '12:00', type: 'break', label: 'Intervalo', room: null },
      {
        time: '14:00',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Daniel Pereira'],
            title: 'Linux por dentro: patches, e-mails e Rust',
            format: 'palestra',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Jefferson Oliveira'],
            title: 'Construindo uma linguagem para aprender circuitos digitais',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      {
        time: '14:40',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Antony Lemos'],
            title:
              'A evolução que seu front-end precisa (e provavelmente não é a que você imagina)',
            format: 'palestra',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Roberta Nascimento'],
            title: 'A interface mente: como o design influencia nossas decisões',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      {
        time: '15:20',
        type: 'break',
        label: 'Avisos e Microfone Aberto',
        room: 'Ambos os auditórios',
      },
      {
        time: '15:40',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['PokemaoBR'],
            title: 'Isso não deveria ser um stand-up',
            format: 'palestra',
            badge: null,
          },
          {
            room: 'Auditório Executivo',
            speakers: ['Fabio Leite'],
            title: 'Muito Além do Chatbot: Como Automatizar Testes de LLM e RAG',
            format: 'palestra',
            badge: null,
          },
        ],
      },
      {
        time: '16:20',
        type: 'sessions',
        sessions: [
          {
            room: 'Auditório Master',
            speakers: ['Mikaeri Ohana'],
            title: 'Do primeiro prompt ao deploy: como sobreviver à produção de agentes de IA',
            format: 'workshop',
            badge: null,
          },
        ],
      },
      {
        time: '17:00',
        type: 'highlight',
        label: 'Code in the Dark + Happy Hour de encerramento',
        room: 'Auditório Executivo',
      },
    ],
  },
];
