import Image from 'next/image';
import { speakerAnchor, type Speaker } from '@/lib/speakers';
import { GDG } from '@/lib/data';

// Barrinha colorida no canto da foto: cores GDG em rodízio (design original).
const BAR_COLORS = [GDG.blue, GDG.green, GDG.yellow, GDG.red];

const shortWeekday = (weekday: string) => weekday.slice(0, 3); // "Sexta-feira" → "Sex"
const shortRoom = (room: string) => room.replace(/^Auditório\s+/, '');

/** Card de palestrante; abre o modal `#palestrante-<id>` (ver SpeakerDialogs). */
export default function SpeakerCard({
  speaker: s,
  index,
  featured = false,
}: {
  speaker: Speaker;
  /** posição na lista, para a cor da barrinha */
  index: number;
  /** destaque da home: card maior, com o título da palestra */
  featured?: boolean;
}) {
  return (
    <a
      href={`#${speakerAnchor(s.id)}`}
      className={featured ? 'spk-card spk-card--featured' : 'spk-card'}
      aria-haspopup="dialog"
    >
      <div className="spk-photo">
        <Image
          src={s.photo}
          alt=""
          width={640}
          height={880}
          sizes={
            featured
              ? '(max-width: 560px) 104px, 360px'
              : '(max-width: 560px) 50vw, (max-width: 900px) 33vw, 260px'
          }
          unoptimized
        />
        <span className="spk-bar" style={{ background: BAR_COLORS[index % BAR_COLORS.length] }} />
      </div>
      <div className="spk-info">
        <span className="spk-name">{s.name}</span>
        <span className="spk-role">{s.role}</span>
        {featured && <span className="spk-card-talk">{s.talk.title}</span>}
        <span className="spk-meta">
          {shortWeekday(s.slot.weekday)} · {s.slot.start} · {shortRoom(s.slot.room)}
        </span>
      </div>
    </a>
  );
}
