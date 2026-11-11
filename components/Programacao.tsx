import Reveal from './Reveal';
import { DayPanel, DayTabs, LiveBlock, RoomFilter, ScheduleProvider } from './ProgramacaoClient';
import { schedule, type ScheduleDay, type Session } from '@/data/schedule';
import {
  ROOMS,
  dayShortDate,
  daySlug,
  formatSpeakers,
  isoAt,
  itemEndTime,
  listSessions,
  roomShortName,
  roomSlug,
  sessionId,
} from '@/lib/schedule';
import { GDG, SITE_URL, VENUE } from '@/lib/data';
import { speakerAnchor, speakerIdForTalk } from '@/lib/speakers';

const DAY_MS = 24 * 60 * 60 * 1000;

const BADGE_STYLE: Record<NonNullable<Session['badge']>, React.CSSProperties> = {
  GDE: { color: GDG.blueText, background: 'rgba(66,133,244,.14)' },
  Googler: { color: GDG.greenText, background: 'rgba(52,168,83,.14)' },
  Convidada: { color: GDG.yellowText, background: 'rgba(251,188,4,.14)' },
  Convidado: { color: GDG.yellowText, background: 'rgba(251,188,4,.14)' },
};
const WORKSHOP_STYLE: React.CSSProperties = { color: GDG.redText, background: 'rgba(234,67,53,.14)' };
const ROOM_STYLE: React.CSSProperties = {
  color: 'rgba(242,242,247,.78)',
  background: 'rgba(255,255,255,.07)',
};

export default function Programacao() {
  const days = schedule.map((day) => ({
    key: daySlug(day),
    weekday: day.day,
    date: dayShortDate(day),
    startsAt: Date.parse(isoAt(day.date, '00:00')),
  }));
  const rooms = ROOMS.map((room) => ({ value: roomSlug(room), label: roomShortName(room) }));

  return (
    <section
      id="programacao"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 90px', scrollMarginTop: 80 }}
    >
      {/* Só o cabeçalho anima: a grade fica muito alta no mobile para o Reveal (amount .12). */}
      <Reveal style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            font: '600 12px/1 var(--font-ibm)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#8ab4f8',
            marginBottom: 16,
          }}
        >
          // Programação
        </div>
        <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
          Dois dias, uma jornada
        </h2>
        <p
          style={{
            margin: '18px auto 0',
            maxWidth: 520,
            fontSize: 16,
            lineHeight: 1.6,
            color: 'rgba(242,242,247,.66)',
          }}
        >
          Palestras e workshops em dois auditórios ao mesmo tempo. Monte seu roteiro e adicione as
          sessões à sua agenda.
        </p>
      </Reveal>

      <ScheduleProvider days={days} rooms={rooms}>
        <div className="prog-controls">
          <DayTabs />
          <RoomFilter />
        </div>
        {schedule.map((day) => (
          <DayPanel key={day.date} dayKey={daySlug(day)}>
            <DaySchedule day={day} />
          </DayPanel>
        ))}
      </ScheduleProvider>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: eventJsonLd() }} />
    </section>
  );
}

function DaySchedule({ day }: { day: ScheduleDay }) {
  const dayStart = Date.parse(isoAt(day.date, '00:00'));

  return (
    <div className="prog-list">
      <div className="prog-head" aria-hidden="true">
        <span />
        {ROOMS.map((room) => (
          <span key={room}>{room}</span>
        ))}
      </div>

      {day.items.map((item, i) => {
        const endTime = itemEndTime(day, i);
        const start = Date.parse(isoAt(day.date, item.time));
        // Sem término definido (encerramento): fica "em andamento" até o fim do dia.
        const end = endTime ? Date.parse(isoAt(day.date, endTime)) : dayStart + DAY_MS;
        const time = <TimeCell date={day.date} start={item.time} end={endTime} />;

        if (item.type === 'sessions') {
          return (
            <LiveBlock
              key={item.time}
              className="prog-block"
              start={start}
              end={end}
              rooms={item.sessions.map((s) => roomSlug(s.room)).join(' ')}
            >
              {time}
              <SessionCells day={day} time={item.time} sessions={item.sessions} />
            </LiveBlock>
          );
        }

        return (
          <LiveBlock
            key={item.time}
            className={item.type === 'highlight' ? 'prog-break prog-break--highlight' : 'prog-break'}
            start={start}
            end={end}
          >
            {time}
            <div className="prog-break-box">
              <span className="prog-break-label">{item.label}</span>
              {item.room && <span className="prog-break-room">{item.room}</span>}
            </div>
          </LiveBlock>
        );
      })}
    </div>
  );
}

function TimeCell({ date, start, end }: { date: string; start: string; end: string | null }) {
  return (
    <div className="prog-time">
      <time className="prog-time-start" dateTime={isoAt(date, start)}>
        {start}
      </time>
      {end && (
        <span className="prog-time-end">
          até <time dateTime={isoAt(date, end)}>{end}</time>
        </span>
      )}
    </div>
  );
}

/** Uma célula por auditório; a coluna sem sessão ganha um placeholder tracejado. */
function SessionCells({
  day,
  time,
  sessions,
}: {
  day: ScheduleDay;
  time: string;
  sessions: Session[];
}) {
  const shared = sessions.find((s) => s.room === 'Ambos os auditórios');
  if (shared) return <SessionCard day={day} time={time} session={shared} wide />;

  return ROOMS.map((room) => {
    const session = sessions.find((s) => s.room === room);
    return session ? (
      <SessionCard key={room} day={day} time={time} session={session} />
    ) : (
      <div key={room} className="prog-empty" aria-hidden="true" />
    );
  });
}

function SessionCard({
  day,
  time,
  session,
  wide = false,
}: {
  day: ScheduleDay;
  time: string;
  session: Session;
  wide?: boolean;
}) {
  const id = sessionId(day, time, session.room);
  const speakerId = speakerIdForTalk(session.title);
  const speakerNames = formatSpeakers(session.speakers);

  return (
    <article
      className={wide ? 'prog-card prog-card--wide' : 'prog-card'}
      data-room={roomSlug(session.room)}
    >
      {/* Selo do auditório: visível no mobile; no desktop a coluna já informa (fica só para leitores de tela). */}
      <span className="prog-pill prog-room" style={ROOM_STYLE}>
        {session.room}
      </span>
      <div className="prog-speaker-row">
        <p className="prog-speaker">
          {speakerId ? (
            // Link "esticado" (::after cobre o card): abre o modal do palestrante.
            <a
              href={`#${speakerAnchor(speakerId)}`}
              className="prog-speaker-link"
              aria-haspopup="dialog"
            >
              {speakerNames}
            </a>
          ) : (
            speakerNames
          )}
        </p>
        {session.badge && (
          <span
            className="prog-pill"
            style={BADGE_STYLE[session.badge]}
            title={session.badge === 'GDE' ? 'Google Developer Expert' : undefined}
          >
            {session.badge}
          </span>
        )}
        {session.format === 'workshop' && (
          <span className="prog-pill" style={WORKSHOP_STYLE}>
            Workshop
          </span>
        )}
      </div>
      <h3 className="prog-title">{session.title}</h3>
      <a
        className="prog-ics"
        href={`/ics/${id}.ics`}
        aria-label={`Adicionar à agenda: ${session.title}`}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
        </svg>
        Adicionar à agenda
      </a>
    </article>
  );
}

/** Event (schema.org) com um subEvent por sessão. */
function eventJsonLd() {
  const place = (name: string) => ({
    '@type': 'Place',
    name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${VENUE.street}, ${VENUE.district}`,
      addressLocality: VENUE.city,
      addressRegion: VENUE.region,
      postalCode: VENUE.postalCode,
      addressCountry: VENUE.country,
    },
  });
  const first = schedule[0];
  const last = schedule[schedule.length - 1];
  const status = 'https://schema.org/EventScheduled';
  const mode = 'https://schema.org/OfflineEventAttendanceMode';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'DevFest João Pessoa 2026',
    description:
      'O maior evento de tecnologia do GDG João Pessoa: dois dias de palestras e workshops no Uniesp Centro Universitário.',
    url: SITE_URL,
    image: [`${SITE_URL}/banner/opengraph-image`],
    startDate: isoAt(first.date, first.items[0].time),
    // O encerramento (Code in the Dark + Happy Hour) não tem horário de término definido.
    endDate: last.date,
    eventStatus: status,
    eventAttendanceMode: mode,
    location: place(VENUE.name),
    organizer: { '@type': 'Organization', name: 'GDG João Pessoa', url: SITE_URL },
    subEvent: listSessions().map(({ session, start, end }) => ({
      '@type': 'Event',
      name: session.title,
      description: `${session.format === 'workshop' ? 'Workshop' : 'Palestra'} com ${formatSpeakers(session.speakers)}`,
      startDate: start,
      endDate: end,
      eventStatus: status,
      eventAttendanceMode: mode,
      location: place(`${session.room} · ${VENUE.name}`),
      performer: session.speakers.map((name) => ({ '@type': 'Person', name })),
    })),
  };

  // Escapa "<" para o JSON não conseguir fechar a tag <script>.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
