// Google / GDG brand accent colors
export const GDG = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
  blueText: '#8ab4f8',
  greenText: '#5bb974',
  yellowText: '#fcc934',
  redText: '#ee675c',
} as const;

export const EVENT = {
  targetDate: '2026-11-20T09:00:00-03:00',
} as const;

/** Plataforma de venda de ingressos. */
export const TICKETS_URL = 'https://doity.com.br/devfest-joao-pessoa';

// ---------------------------------------------------------------------------
// Speakers — line-up a definir (cores rotacionam azul/verde/amarelo/vermelho)
// ---------------------------------------------------------------------------
export type Speaker = { name: string; role: string; color: string };

export const speakers: Speaker[] = [
  { name: 'A definir', role: 'Keynote · IA', color: GDG.blue },
  { name: 'A definir', role: 'Web Platform', color: GDG.green },
  { name: 'A definir', role: 'Android / Mobile', color: GDG.yellow },
  { name: 'A definir', role: 'Cloud & DevOps', color: GDG.red },
  { name: 'A definir', role: 'Machine Learning', color: GDG.blue },
  { name: 'A definir', role: 'Front-end', color: GDG.green },
  { name: 'A definir', role: 'Carreira & Comunidade', color: GDG.yellow },
  { name: 'A definir', role: 'Design & Produto', color: GDG.red },
];

// ---------------------------------------------------------------------------
// Trilhas
// ---------------------------------------------------------------------------
export type Track = {
  n: string;
  title: string;
  desc: string;
  color: string; // base brand color
  text: string; // light text variant
};

export const tracks: Track[] = [
  {
    n: '01',
    title: 'IA & Machine Learning',
    desc: 'Do prompt ao produto: LLMs, Gemini, agentes, MLOps e IA aplicada de verdade.',
    color: GDG.blue,
    text: GDG.blueText,
  },
  {
    n: '02',
    title: 'Web Moderna',
    desc: 'Frameworks, performance, arquitetura de front-end e as plataformas que escalam.',
    color: GDG.green,
    text: GDG.greenText,
  },
  {
    n: '03',
    title: 'Mobile',
    desc: 'Android, Flutter, Kotlin Multiplatform e apps que encantam milhões.',
    color: GDG.yellow,
    text: GDG.yellowText,
  },
  {
    n: '04',
    title: 'Cloud & DevOps',
    desc: 'Infra sem atrito: Google Cloud, containers, observabilidade e automação.',
    color: GDG.red,
    text: GDG.redText,
  },
];

// ---------------------------------------------------------------------------
// Agenda
// ---------------------------------------------------------------------------
export type TrackKey = 'IA' | 'Web' | 'Mobile' | 'Cloud' | 'Geral';

export const trackStyle: Record<TrackKey, { color: string; bg: string }> = {
  IA: { color: '#8ab4f8', bg: 'rgba(66,133,244,.14)' },
  Web: { color: '#5bb974', bg: 'rgba(52,168,83,.14)' },
  Mobile: { color: '#fcc934', bg: 'rgba(251,188,4,.14)' },
  Cloud: { color: '#ee675c', bg: 'rgba(234,67,53,.14)' },
  Geral: { color: 'rgba(242,242,247,.7)', bg: 'rgba(255,255,255,.07)' },
};

export type Session = {
  time: string;
  title: string;
  speaker: string;
  track: TrackKey;
};

export const sessions: Record<1 | 2, Session[]> = {
  1: [
    { time: '09:00', title: 'Credenciamento & Welcome Coffee', speaker: 'Equipe GDG João Pessoa', track: 'Geral' },
    { time: '10:00', title: 'Keynote de abertura: o futuro da IA', speaker: 'Palestrante a definir', track: 'IA' },
    { time: '11:30', title: 'Construindo apps modernos na web', speaker: 'Palestrante a definir', track: 'Web' },
    { time: '14:00', title: 'Android além do básico', speaker: 'Palestrante a definir', track: 'Mobile' },
    { time: '16:00', title: 'Escalando com Google Cloud', speaker: 'Palestrante a definir', track: 'Cloud' },
  ],
  2: [
    { time: '09:30', title: 'Agentes de IA na prática', speaker: 'Palestrante a definir', track: 'IA' },
    { time: '11:00', title: 'Performance web em produção', speaker: 'Palestrante a definir', track: 'Web' },
    { time: '14:00', title: 'Flutter & Kotlin Multiplatform', speaker: 'Palestrante a definir', track: 'Mobile' },
    { time: '15:30', title: 'DevOps sem dor de cabeça', speaker: 'Palestrante a definir', track: 'Cloud' },
    { time: '17:00', title: 'Encerramento, sorteios & networking', speaker: 'Equipe GDG João Pessoa', track: 'Geral' },
  ],
};

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: 'Onde e quando acontece o DevFest?',
    a: 'Nos dias 20 e 21 de novembro de 2026, no Uniesp Centro Universitário, em João Pessoa - PB.',
  },
  {
    q: 'O ingresso dá acesso aos dois dias?',
    a: 'Sim. Todos os ingressos garantem acesso à programação completa dos dois dias, incluindo todas as trilhas.',
  },
  {
    q: 'Vou receber certificado?',
    a: 'Sim, todos os participantes recebem certificado digital de participação após o evento.',
  },
  {
    q: 'Preciso saber programar para participar?',
    a: 'Não! O DevFest tem conteúdo do iniciante ao avançado. É um evento para toda a comunidade de tecnologia.',
  },
  {
    q: 'Como faço para palestrar ou patrocinar?',
    a: 'Abrimos chamadas para palestrantes (call for papers) e cotas de patrocínio. Entre em contato pelos canais da comunidade GDG João Pessoa.',
  },
];

// ---------------------------------------------------------------------------
// Ingressos
// ---------------------------------------------------------------------------
export type Pass = {
  name: string;
  tagline: string;
  price: string;
  lote: string;
  desc: string;
  features: string[];
  featured?: boolean; // "popular" highlight (blue)
  premium?: boolean; // "premium" highlight (gold)
  badge?: string; // label shown on highlighted cards
  accent?: string; // accent color for subtitle/name (default = blue text)
  cta: string;
  href: string;
};

export const passes: Pass[] = [
  {
    name: 'Remote Pass',
    tagline: 'De onde você estiver',
    price: 'R$ 79,99',
    lote: '1º lote · online',
    desc: 'Acompanhe as trilhas principais ao vivo, tenha acesso às gravações e materiais pra consultar quando quiser e receba seu certificado. Ideal pra quem não pode estar presente, mas não quer ficar de fora.',
    features: ['Trilhas principais ao vivo', 'Gravações e materiais', 'Certificado de participação'],
    cta: 'Comprar',
    href: TICKETS_URL,
  },
  {
    name: 'Dev Pass',
    tagline: 'A experiência completa, presencial',
    price: 'R$ 99,99',
    lote: '1º lote · presencial',
    desc: 'Viva o DevFest do jeito que ele foi feito pra ser vivido. Acesso a todas as trilhas, codelabs, arenas práticas e a todo o networking do evento, além de um kit de boas-vindas exclusivo com brindes e swags feitos especialmente pra essa edição.',
    features: ['Tudo do Remote Pass', 'Acesso presencial a todas as trilhas', 'Kit de boas-vindas'],
    featured: true,
    badge: 'MAIS POPULAR',
    accent: GDG.blueText,
    cta: 'Comprar agora →',
    href: TICKETS_URL,
  },
  {
    name: 'Root Pass',
    tagline: 'Acesso de superusuário',
    price: 'R$ 219,99',
    lote: '1º lote · vagas limitadas',
    desc: 'Pra quem quer aproveitar o evento sem nenhum gargalo de permissão. Tudo do Dev Pass mais entrada na área root: um ambiente exclusivo com buffet o dia todo durante os dois dias, onde circulam palestrantes e empresas patrocinadoras, feito pra um networking mais próximo e qualificado.',
    features: [
      'Tudo do Dev Pass',
      'Área root com buffet exclusivo o dia todo, durante os dois dias',
      'Kit de boas-vindas diferenciado com itens exclusivos',
      'Lugares reservados na plateia do palco principal',
      'Massoterapia exclusiva dentro da área root',
      'Acesso à área root para networking diferenciado',
      'Credenciamento exclusivo para a área root',
    ],
    premium: true,
    badge: 'PREMIUM',
    accent: GDG.yellowText,
    cta: 'Comprar agora →',
    href: TICKETS_URL,
  },
];
