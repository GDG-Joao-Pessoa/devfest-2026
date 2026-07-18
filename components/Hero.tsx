import Image from 'next/image';
import devfest2026 from '@/public/assets/devfest-2026-w3.png';
import Reveal from './Reveal';
// import Countdown from './Countdown';
import { TICKETS_URL } from '@/lib/data';

const signatureGradient =
  'linear-gradient(90deg,#4285F4 0%,#34A853 42%,#FBBC04 72%,#EA4335 100%)';

const gradientText: React.CSSProperties = {
  background: signatureGradient,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

export default function Hero() {
  return (
    <header style={{ position: 'relative', padding: '110px 40px 150px', overflow: 'hidden' }}>
      {/* animated radial blobs */}
      <div
        className="floaty"
        style={{
          position: 'absolute',
          top: -120,
          left: -80,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(66,133,244,.32),transparent 62%)',
          filter: 'blur(20px)',
          animation: 'floaty 9s ease-in-out infinite',
        }}
      />
      <div
        className="floaty"
        style={{
          position: 'absolute',
          top: 40,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(52,168,83,.26),transparent 62%)',
          filter: 'blur(20px)',
          animation: 'floaty 11s ease-in-out infinite',
        }}
      />
      <div
        className="floaty"
        style={{
          position: 'absolute',
          bottom: -160,
          left: '38%',
          width: 460,
          height: 460,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(251,188,4,.16),transparent 62%)',
          filter: 'blur(24px)',
          animation: 'floaty 13s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: '34%',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(234,67,53,.14),transparent 62%)',
          filter: 'blur(24px)',
        }}
      />

      <Reveal style={{ position: 'relative', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <Image
          src={devfest2026}
          alt="DevFest 2026"
          style={{
            height: 82,
            width: 'auto',
            display: 'block',
            margin: '0 auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 30px rgba(66,133,244,.3))',
          }}
          priority
        />
        <div
          style={{
            font: '700 22px/1 var(--font-sora)',
            letterSpacing: 9,
            textTransform: 'uppercase',
            margin: '-2px 0 30px',
            paddingLeft: 9,
            background: 'linear-gradient(90deg,#4285F4,#34A853 40%,#FBBC04 70%,#EA4335)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          João Pessoa
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 20px',
              border: '1px solid rgba(255,255,255,.16)',
              borderRadius: 999,
              font: '600 12px/1 var(--font-ibm)',
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'rgba(242,242,247,.88)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#34A853',
                boxShadow: '0 0 10px #34A853',
              }}
            />
            João Pessoa · 1ª Edição · Inscrições abertas
          </div>
        </div>
        <h1 style={{ margin: 0, font: '800 84px/.98 var(--font-sora)', letterSpacing: '-2.5px' }}>
          A comunidade de
          <br />
          tecnologia e inovação
          <br />
          <span style={gradientText}>se encontra aqui.</span>
        </h1>
        <p
          style={{
            margin: '30px auto 0',
            maxWidth: 560,
            fontSize: 18,
            lineHeight: 1.6,
            color: 'rgba(242,242,247,.66)',
          }}
        >
          O maior evento de tecnologia do GDG João Pessoa. Dois dias de palestras, código ao vivo e
          comunidade — do primeiro commit ao keynote.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '16px 34px',
              borderRadius: 999,
              background: 'linear-gradient(90deg,#4285F4,#34A853)',
              color: '#fff',
              font: '700 15px var(--font-figtree)',
              boxShadow: '0 12px 34px -10px rgba(66,133,244,.6)',
            }}
          >
            Compre seu ingresso →
          </a>
        </div>

        {/* <Countdown /> */}
      </Reveal>

      {/* floating info bar */}
      <Reveal style={{ position: 'relative', maxWidth: 920, margin: '64px auto 0' }}>
        <div
          className="hero-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            padding: '22px 30px',
            background: 'rgba(18,18,28,.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 20,
            boxShadow: '0 24px 60px -24px rgba(0,0,0,.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(66,133,244,.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              📅
            </div>
            <div>
              <div style={{ font: '800 18px/1 var(--font-sora)' }}>20 &amp; 21 Nov</div>
              <div style={{ font: '600 12px/1 var(--font-ibm)', color: 'rgba(242,242,247,.5)', marginTop: 6 }}>
                2026
              </div>
            </div>
          </div>
          <span className="hero-bar-divider" style={{ width: 1, height: 40, background: 'rgba(255,255,255,.12)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(52,168,83,.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              📍
            </div>
            <div>
              <div style={{ font: '800 18px/1 var(--font-sora)' }}>Uniesp</div>
              <div style={{ font: '600 12px/1 var(--font-ibm)', color: 'rgba(242,242,247,.5)', marginTop: 6 }}>
                João Pessoa · PB
              </div>
            </div>
          </div>
          <span className="hero-bar-divider" style={{ width: 1, height: 40, background: 'rgba(255,255,255,.12)' }} />
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '15px 28px',
              borderRadius: 999,
              background: '#fff',
              color: '#08080f',
              font: '700 14px var(--font-figtree)',
              whiteSpace: 'nowrap',
            }}
          >
            Garantir lugar →
          </a>
        </div>
      </Reveal>
    </header>
  );
}
