import { daySlug, findSession, formatSpeakers, type SessionEntry } from '@/lib/schedule';
import { SITE_URL, VENUE } from '@/lib/data';

// GET /ics/<sessao>.ics — evento de calendário (RFC 5545) de uma sessão da
// programação. Servido como text/calendar para que o iOS/Android ofereçam
// "Adicionar ao calendário" direto, sem depender de JavaScript no cliente.

export async function GET(_request: Request, { params }: { params: Promise<{ arquivo: string }> }) {
  const { arquivo } = await params;
  const entry = arquivo.endsWith('.ics') ? findSession(arquivo.slice(0, -'.ics'.length)) : undefined;

  if (!entry) {
    return new Response('Sessão não encontrada.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(buildIcs(entry), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="devfest-jp-${entry.id}.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function buildIcs({ id, day, session, start, end }: SessionEntry) {
  const speakers = formatSpeakers(session.speakers);
  const format = session.format === 'workshop' ? 'Workshop' : 'Palestra';
  const pageUrl = `${SITE_URL}/?dia=${daySlug(day)}#programacao`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GDG Joao Pessoa//DevFest Joao Pessoa 2026//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${id}@devfest-jp.dev`,
    `DTSTAMP:${toIcsUtc(new Date().toISOString())}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeText(`${session.title} · DevFest JP`)}`,
    `LOCATION:${escapeText(`${VENUE.name} (${session.room}), ${VENUE.street} - ${VENUE.district}, ${VENUE.city} - ${VENUE.region}`)}`,
    `DESCRIPTION:${escapeText(`${format} com ${speakers} no DevFest João Pessoa 2026.\n${session.room}.\n\n${pageUrl}`)}`,
    `URL:${pageUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.map(fold).join('\r\n') + '\r\n';
}

/** "2026-11-20T10:00:00-03:00" → "20261120T130000Z" */
function toIcsUtc(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Escape de TEXT (RFC 5545 §3.3.11). */
function escapeText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Dobra linhas em 75 octetos (RFC 5545 §3.1) sem partir caracteres UTF-8. */
function fold(line: string) {
  const encoder = new TextEncoder();
  let out = '';
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) {
      out += '\r\n ';
      bytes = 1; // o espaço de continuação conta
    }
    out += char;
    bytes += size;
  }
  return out;
}
