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

/** URL pública do site (mesma do `metadataBase` em app/layout.tsx). */
export const SITE_URL = 'https://devfest-jp.dev';

/**
 * Local do evento. Endereço oficial do campus sede (documentos institucionais
 * da Uniesp): Rodovia BR-230, Km 14, s/n, Morada Nova, Cabedelo/PB — na Grande
 * João Pessoa.
 */
export const VENUE = {
  name: 'Uniesp Centro Universitário',
  street: 'Rodovia BR-230, Km 14, s/n',
  district: 'Morada Nova',
  city: 'Cabedelo',
  region: 'PB',
  postalCode: '58310-000',
  country: 'BR',
} as const;

/** "Rodovia BR-230, Km 14, s/n · Morada Nova, Cabedelo – PB" */
export const VENUE_ADDRESS = `${VENUE.street} · ${VENUE.district}, ${VENUE.city} – ${VENUE.region}`;

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
// FAQ
// ---------------------------------------------------------------------------
export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: 'Onde e quando acontece o DevFest?',
    a: `Nos dias 20 e 21 de novembro de 2026, no ${VENUE.name} (${VENUE_ADDRESS}), na Grande João Pessoa.`,
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

// Lote final (preços da plataforma de ingressos; taxa cobrada à parte).
export const passes: Pass[] = [
  {
    name: 'Dev Pass',
    tagline: 'A experiência completa, presencial',
    price: 'R$ 160,00',
    lote: 'Lote final · presencial · + taxa de R$ 16,00',
    desc: 'Viva o DevFest do jeito que ele foi feito pra ser vivido. Acesso a todas as trilhas, codelabs, arenas práticas e a todo o networking do evento, além de um kit de boas-vindas exclusivo com brindes e swags feitos especialmente pra essa edição.',
    features: ['Acesso presencial a todas as trilhas', 'Kit de boas-vindas', 'Certificado de participação'],
    featured: true,
    badge: 'MAIS POPULAR',
    accent: GDG.blueText,
    cta: 'Comprar agora →',
    href: TICKETS_URL,
  },
  {
    name: 'Root Pass',
    tagline: 'Acesso de superusuário',
    price: 'R$ 279,99',
    lote: 'Lote final · presencial · + taxa de R$ 28,00',
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
