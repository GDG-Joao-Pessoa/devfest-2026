import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SpeakerCard from '@/components/SpeakerCard';
import SpeakerDialogs from '@/components/SpeakerDialogs';
import { speakers } from '@/lib/speakers';

export const metadata: Metadata = {
  title: 'Palestrantes — DevFest João Pessoa 2026',
  description:
    'Conheça quem sobe ao palco no DevFest João Pessoa 2026: bios, palestras e horários de todos os palestrantes. 20 e 21 de novembro, no Uniesp.',
  alternates: { canonical: '/palestrantes' },
};

export default function PalestrantesPage() {
  return (
    <div className="page">
      <Nav base="/" />
      <main>
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 40px 90px' }}>
          <Link href="/" className="spk-back-link">
            ← Voltar para o início
          </Link>
          <div style={{ textAlign: 'center', margin: '28px 0 48px' }}>
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
            <h1
              style={{
                margin: 0,
                font: '800 clamp(34px, 6vw, 52px)/1.05 var(--font-sora)',
                letterSpacing: '-1.5px',
              }}
            >
              Quem sobe ao palco
            </h1>
            <p
              style={{
                margin: '18px auto 0',
                maxWidth: 520,
                fontSize: 16,
                lineHeight: 1.6,
                color: 'rgba(242,242,247,.66)',
              }}
            >
              {speakers.length} palestras e workshops em dois dias. Escolha alguém para ver a bio, a
              palestra e o horário.
            </p>
          </div>

          <ul className="spk-grid">
            {speakers.map((s, i) => (
              <li key={s.id}>
                <SpeakerCard speaker={s} index={i} />
              </li>
            ))}
          </ul>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link href="/#programacao" className="spk-all-link">
              Ver a programação completa →
            </Link>
          </div>

          <SpeakerDialogs />
        </section>
      </main>
      <Footer base="/" />
    </div>
  );
}
