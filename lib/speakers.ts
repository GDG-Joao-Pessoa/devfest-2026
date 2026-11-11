import raw from '@/data/palestrantes.json';
import { schedule } from '@/data/schedule';
import { SESSION_MINUTES, addMinutes, dayShortDate, daySlug, sessionId } from '@/lib/schedule';

// ---------------------------------------------------------------------------
// Palestrantes — data/palestrantes.json (exportado pela organização).
//
// - Horário e auditório vêm de data/schedule.ts, ligando a palestra à sessão
//   pelo título. O campo `agenda` do JSON só é usado para conferência (avisa no
//   build se divergir da programação).
// - Quem não tem sessão na programação não aparece no site.
// - A foto é /assets/speakers/<id>.webp, gerada por
//   scripts/otimizar-fotos-palestrantes.mjs (o campo `foto` do JSON aponta para
//   o original e é ignorado).
// - O campo `selo` (GDE, Googler, Convidada/o) não é exibido, a pedido da
//   organização.
// ---------------------------------------------------------------------------

type RawPartner = {
  name: string;
  role: string;
  handle: string;
  /** "assets/speakers/<id>.png": só o <id> é usado (foto otimizada em .webp) */
  photo: string;
  /** object-position da foto, ex.: "50% 40%" */
  pos: string;
  bio: string;
};

type RawSpeaker = {
  id: string;
  nome: string;
  cargo: string;
  instagram: string;
  linkedin: string;
  rede: string;
  palestra: {
    titulo: string;
    subtitulo: string;
    resumo: string;
    formato: string;
    parceria: string | RawPartner;
  };
  selo: string;
  bio: string;
  foto: string;
  agenda: { dia: string; diaLabel: string; horario: string; auditorio: string } | null;
};

const rawSpeakers: RawSpeaker[] = raw;

export type SpeakerSlot = {
  /** valor de ?dia= */
  dayKey: string;
  weekday: string;
  /** "2026-11-21" */
  isoDate: string;
  /** "21/11" */
  date: string;
  start: string;
  end: string;
  room: string;
  /** id da sessão, usado no .ics */
  sessionId: string;
};

export type Partner = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  photo: string | null;
  photoPosition: string;
};

/** "assets/speakers/caroline-araujo.png" → "/assets/speakers/caroline-araujo.webp" */
const partnerPhoto = (path: string) => {
  const id = path.split('/').pop()?.replace(/\.[a-z]+$/i, '');
  return id ? `/assets/speakers/${id}.webp` : null;
};

export type Speaker = {
  id: string;
  name: string;
  role: string;
  photo: string;
  social: { label: string; href: string } | null;
  bio: string;
  talk: {
    title: string;
    subtitle: string;
    summary: string;
    workshop: boolean;
    partner: Partner | null;
  };
  slot: SpeakerSlot;
};

/** Sessões da programação indexadas pelo título da palestra. */
const slotsByTitle = new Map<string, SpeakerSlot>();
for (const day of schedule) {
  for (const item of day.items) {
    if (item.type !== 'sessions') continue;
    for (const session of item.sessions) {
      slotsByTitle.set(session.title, {
        dayKey: daySlug(day),
        weekday: day.day,
        isoDate: day.date,
        date: dayShortDate(day),
        start: item.time,
        end: addMinutes(item.time, SESSION_MINUTES),
        room: session.room,
        sessionId: sessionId(day, item.time, session.room),
      });
    }
  }
}

function socialLink(s: RawSpeaker): Speaker['social'] {
  const ig = s.instagram.trim().replace(/^@/, '');
  if (ig) return { label: `@${ig}`, href: `https://instagram.com/${ig}` };
  const li = s.linkedin.trim();
  if (li) {
    const href = /^https?:\/\//.test(li) ? li : `https://${li}`;
    return { label: href.replace(/^https?:\/\/(www\.)?/, ''), href };
  }
  return null;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .join('')
    .toUpperCase();

function toSpeaker(s: RawSpeaker): Speaker | null {
  const slot = slotsByTitle.get(s.palestra.titulo);
  if (!slot) {
    if (s.agenda) {
      console.warn(`[palestrantes] "${s.nome}": palestra "${s.palestra.titulo}" não está na programação.`);
    }
    return null;
  }
  const a = s.agenda;
  if (a && (a.dia !== slot.isoDate || a.horario !== slot.start || a.auditorio !== slot.room)) {
    console.warn(
      `[palestrantes] "${s.nome}": agenda do JSON (${a.dia} ${a.horario}, ${a.auditorio}) difere da programação (${slot.isoDate} ${slot.start}, ${slot.room}). Vale a programação.`,
    );
  }

  const p = s.palestra.parceria;
  return {
    id: s.id,
    name: s.nome,
    role: s.cargo,
    photo: `/assets/speakers/${s.id}.webp`,
    social: socialLink(s),
    bio: s.bio,
    talk: {
      title: s.palestra.titulo,
      subtitle: s.palestra.subtitulo,
      summary: s.palestra.resumo,
      workshop: s.palestra.formato.toLowerCase() === 'workshop',
      partner:
        typeof p === 'object' && p.name
          ? {
              name: p.name,
              role: p.role,
              bio: p.bio,
              initials: initials(p.name),
              photo: p.photo ? partnerPhoto(p.photo) : null,
              photoPosition: p.pos || '50% 30%',
            }
          : null,
    },
    slot,
  };
}

/** Destaques: únicos na home e primeiros na página /palestrantes, nesta ordem. */
const FEATURED_IDS = ['karol-attekita', 'mikaeri-ohana', 'pokemaobr'];

const alphabetical = rawSpeakers
  .map(toSpeaker)
  .filter((s): s is Speaker => s !== null)
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

export const featuredSpeakers: Speaker[] = FEATURED_IDS.flatMap((id) => {
  const s = alphabetical.find((sp) => sp.id === id);
  if (!s) console.warn(`[palestrantes] destaque "${id}" não encontrado.`);
  return s ? [s] : [];
});

/** Todos os palestrantes com sessão na programação: destaques primeiro, depois ordem alfabética. */
export const speakers: Speaker[] = [
  ...featuredSpeakers,
  ...alphabetical.filter((s) => !FEATURED_IDS.includes(s.id)),
];

const idByTitle = new Map(speakers.map((s) => [s.talk.title, s.id]));

/** Id do palestrante (e do modal `#palestrante-<id>`) de uma sessão da programação. */
export const speakerIdForTalk = (title: string) => idByTitle.get(title);

export const speakerAnchor = (id: string) => `palestrante-${id}`;
