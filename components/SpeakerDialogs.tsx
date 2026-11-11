import Image from 'next/image';
import SpeakerDialogController from './SpeakerDialogController';
import { speakers, speakerAnchor, type Speaker } from '@/lib/speakers';

/**
 * Um <dialog id="palestrante-<id>"> por palestrante + o controlador que os abre
 * a partir de links `#palestrante-<id>`. Renderizado no servidor: bios e
 * palestras ficam no HTML. Na home, todos os modais existem mesmo com só os
 * destaques na seção, porque os cards da programação abrem qualquer um.
 */
export default function SpeakerDialogs() {
  return (
    <>
      {speakers.map((s) => (
        <SpeakerDialog key={s.id} speaker={s} />
      ))}
      <SpeakerDialogController />
    </>
  );
}

function SpeakerDialog({ speaker: s }: { speaker: Speaker }) {
  const anchor = speakerAnchor(s.id);
  const { slot, talk } = s;

  // Dentro do modal só <div>: as regras mobile de globals.css forçam padding em `section` e `header`.
  return (
    <dialog id={anchor} className="spk-dialog" aria-labelledby={`${anchor}-nome`}>
      <div className="spk-dialog-inner">
        <form method="dialog" className="spk-close-form">
          <button className="spk-close" aria-label="Fechar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </form>

        <div className="spk-dialog-head">
          <Image src={s.photo} alt={s.name} width={640} height={880} className="spk-avatar" unoptimized />
          <div className="spk-dialog-id">
            <h2 id={`${anchor}-nome`} className="spk-dialog-name">
              {s.name}
            </h2>
            <p className="spk-dialog-role">{s.role}</p>
            {s.social && (
              <a className="spk-social" href={s.social.href} target="_blank" rel="noopener noreferrer">
                {s.social.label}
              </a>
            )}
          </div>
        </div>

        <div className="spk-talk">
          <div className="spk-talk-meta">
            {talk.workshop && <span className="spk-pill">Workshop</span>}
            <span>
              {slot.weekday}, {slot.date} · {slot.start}–{slot.end} · {slot.room}
            </span>
          </div>
          <h3 className="spk-talk-title">{talk.title}</h3>
          {talk.subtitle && <p className="spk-talk-subtitle">{talk.subtitle}</p>}
          <p className="spk-text">{talk.summary}</p>
          <a className="prog-ics" href={`/ics/${slot.sessionId}.ics`} aria-label={`Adicionar à agenda: ${talk.title}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
            </svg>
            Adicionar à agenda
          </a>
        </div>

        <div className="spk-section">
          <h3 className="spk-eyebrow">Sobre {s.name.split(' ')[0]}</h3>
          <p className="spk-text">{s.bio}</p>
        </div>

        {talk.partner && (
          <div className="spk-section">
            <h3 className="spk-eyebrow">Apresenta junto</h3>
            <div className="spk-partner">
              {talk.partner.photo ? (
                <Image
                  src={talk.partner.photo}
                  alt={talk.partner.name}
                  width={640}
                  height={880}
                  className="spk-initials"
                  style={{ objectFit: 'cover', objectPosition: talk.partner.photoPosition }}
                  unoptimized
                />
              ) : (
                <span className="spk-initials" aria-hidden="true">
                  {talk.partner.initials}
                </span>
              )}
              <div>
                <p className="spk-partner-name">{talk.partner.name}</p>
                <p className="spk-dialog-role">{talk.partner.role}</p>
              </div>
            </div>
            <p className="spk-text">{talk.partner.bio}</p>
          </div>
        )}
      </div>
    </dialog>
  );
}
