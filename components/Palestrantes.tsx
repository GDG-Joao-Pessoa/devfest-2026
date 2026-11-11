import Link from 'next/link';
import Reveal from './Reveal';
import SpeakerCard from './SpeakerCard';
import SpeakerDialogs from './SpeakerDialogs';
import { featuredSpeakers } from '@/lib/speakers';

/** Seção da home: só os destaques + link para a página com todos (/palestrantes). */
export default function Palestrantes() {
  return (
    <section
      id="palestrantes"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 90px', scrollMarginTop: 80 }}
    >
      <Reveal style={{ textAlign: 'center', marginBottom: 48 }}>
        <div
          style={{
            font: '600 12px/1 var(--font-ibm)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#8ab4f8',
            marginBottom: 16,
          }}
        >
          // Palestrantes
        </div>
        <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
          Quem sobe ao palco
        </h2>
        <p
          style={{
            margin: '18px auto 0',
            maxWidth: 500,
            fontSize: 16,
            lineHeight: 1.6,
            color: 'rgba(242,242,247,.66)',
          }}
        >
          Referências nacionais e talentos da nossa comunidade. Escolha alguém para ver a bio e os
          detalhes da palestra.
        </p>
      </Reveal>

      <ul className="spk-grid spk-grid--featured">
        {featuredSpeakers.map((s, i) => (
          <li key={s.id}>
            <SpeakerCard speaker={s} index={i} featured />
          </li>
        ))}
      </ul>

      <div style={{ textAlign: 'center', marginTop: 36 }}>
        <Link href="/palestrantes" className="spk-all-link">
          Conferir todos os palestrantes →
        </Link>
      </div>

      <SpeakerDialogs />
    </section>
  );
}
