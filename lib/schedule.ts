import { schedule, type Room, type ScheduleDay, type Session } from '@/data/schedule';

/** America/Recife não tem horário de verão (desde 2019): o offset é fixo. */
export const UTC_OFFSET = '-03:00';

/** Duração de cada sessão; o término coincide com o início do próximo bloco. */
export const SESSION_MINUTES = 40;

/** Colunas da grade (desktop), na ordem de exibição. */
export const ROOMS = ['Auditório Master', 'Auditório Executivo'] as const satisfies readonly Room[];

const ROOM_SLUG: Record<Room, string> = {
  'Auditório Master': 'master',
  'Auditório Executivo': 'executivo',
  'Ambos os auditórios': 'ambos',
};

export const roomSlug = (room: Room) => ROOM_SLUG[room];

/** "Auditório Master" → "Master" (rótulo curto do filtro). */
export const roomShortName = (room: Room) => room.replace(/^Auditório\s+/, '');

const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Valor de `?dia=`: "Sexta-feira" → "sexta", "Sábado" → "sabado". */
export const daySlug = (day: ScheduleDay) => stripAccents(day.day).toLowerCase().split('-')[0];

/** "2026-11-20" → "20/11" (a aba exibe "Sexta-feira · 20/11"). */
export function dayShortDate(day: ScheduleDay) {
  const [, month, dayOfMonth] = day.date.split('-');
  return `${dayOfMonth}/${month}`;
}

/** "16:20" + 40 → "17:00". Os blocos nunca cruzam a meia-noite. */
export function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** ISO 8601 no fuso do evento: "2026-11-20T10:00:00-03:00". */
export const isoAt = (date: string, time: string) => `${date}T${time}:00${UTC_OFFSET}`;

/**
 * Término do item `index` do dia: sessões duram 40 min; intervalos vão até o
 * próximo bloco. `null` quando não há término definido (ex.: o Code in the
 * Dark, que encerra o evento).
 */
export function itemEndTime(day: ScheduleDay, index: number): string | null {
  const item = day.items[index];
  if (item.type === 'sessions') return addMinutes(item.time, SESSION_MINUTES);
  return day.items[index + 1]?.time ?? null;
}

export const formatSpeakers = (speakers: string[]) => speakers.join(' & ');

/** Id estável da sessão, usado no nome do .ics: "sexta-1040-executivo". */
export const sessionId = (day: ScheduleDay, time: string, room: Room) =>
  `${daySlug(day)}-${time.replace(':', '')}-${roomSlug(room)}`;

export type SessionEntry = {
  id: string;
  day: ScheduleDay;
  session: Session;
  /** ISO com offset −03:00 */
  start: string;
  end: string;
};

export function listSessions(): SessionEntry[] {
  return schedule.flatMap((day) =>
    day.items.flatMap((item) =>
      item.type !== 'sessions'
        ? []
        : item.sessions.map((session) => ({
            id: sessionId(day, item.time, session.room),
            day,
            session,
            start: isoAt(day.date, item.time),
            end: isoAt(day.date, addMinutes(item.time, SESSION_MINUTES)),
          })),
    ),
  );
}

export const findSession = (id: string) => listSessions().find((s) => s.id === id);
