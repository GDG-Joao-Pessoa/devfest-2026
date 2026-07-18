import Image from 'next/image';
import gdgClean from '@/public/assets/gdg-jp-clean.png';
import devfestClean from '@/public/assets/devfest-clean.png';

/**
 * The 1280×575 promotional banner, recreated faithfully from the prototype.
 * Rendered at native size — wrap in a scaling container for responsive preview.
 */
export default function Banner() {
  return (
    <div
      style={{
        width: 1280,
        height: 575,
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(120% 130% at 50% 0%,#141426 0%,#0a0a14 55%,#08080f 100%)',
        fontFamily: 'var(--font-sora)',
        flexShrink: 0,
      }}
    >
      {/* concentric ring motif (right) */}
      <div style={{ position: 'absolute', top: '50%', right: -260, transform: 'translateY(-50%)', width: 900, height: 900, borderRadius: '50%', border: '2px solid rgba(66,133,244,.16)' }} />
      <div style={{ position: 'absolute', top: '50%', right: -180, transform: 'translateY(-50%)', width: 740, height: 740, borderRadius: '50%', border: '2px solid rgba(52,168,83,.14)' }} />
      <div style={{ position: 'absolute', top: '50%', right: -100, transform: 'translateY(-50%)', width: 580, height: 580, borderRadius: '50%', border: '2px solid rgba(251,188,4,.12)' }} />
      <div style={{ position: 'absolute', top: '50%', right: -30, transform: 'translateY(-50%)', width: 420, height: 420, borderRadius: '50%', border: '2px solid rgba(234,67,53,.12)' }} />
      {/* mirror on left */}
      <div style={{ position: 'absolute', top: '50%', left: -320, transform: 'translateY(-50%)', width: 820, height: 820, borderRadius: '50%', border: '2px solid rgba(255,255,255,.05)' }} />

      {/* color glows */}
      <div style={{ position: 'absolute', top: -140, left: '8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(66,133,244,.32),transparent 62%)', filter: 'blur(14px)' }} />
      <div style={{ position: 'absolute', bottom: -180, right: '14%', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,168,83,.26),transparent 62%)', filter: 'blur(16px)' }} />
      <div style={{ position: 'absolute', bottom: -120, left: '26%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(251,188,4,.16),transparent 62%)', filter: 'blur(18px)' }} />

      {/* GDG JP logo top-left */}
      <Image src={gdgClean} alt="GDG João Pessoa" style={{ position: 'absolute', top: 44, left: 56, height: 60, width: 'auto', objectFit: 'contain' }} priority />

      {/* date top-right */}
      <div style={{ position: 'absolute', top: 52, right: 56, display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', border: '1px solid rgba(255,255,255,.18)', borderRadius: 999, font: '600 15px/1 var(--font-ibm)', letterSpacing: 2, color: '#f2f2f7' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34A853', boxShadow: '0 0 12px #34A853' }} />
        20 &amp; 21 NOV · 2026
      </div>

      {/* center lockup */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Image src={devfestClean} alt="DevFest" style={{ height: 120, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 10px 40px rgba(66,133,244,.35))' }} priority />
            <span style={{ font: '700 24px/1 var(--font-sora)', letterSpacing: 12, textTransform: 'uppercase', marginTop: 2, paddingLeft: 12, background: 'linear-gradient(90deg,#4285F4,#34A853 45%,#FBBC04 72%,#EA4335)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              João Pessoa
            </span>
          </div>
          <span style={{ font: '800 150px/1 var(--font-sora)', letterSpacing: -5, background: 'linear-gradient(140deg,#4285F4,#34A853 45%,#FBBC04 72%,#EA4335)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            26
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, font: '600 22px/1 var(--font-sora)', color: '#f2f2f7' }}>
          <span>Uniesp Centro Universitário</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FBBC04' }} />
          <span>Paraíba</span>
        </div>
      </div>

      {/* bottom tagline */}
      <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', font: '500 15px/1 var(--font-ibm)', letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(242,242,247,.5)', whiteSpace: 'nowrap' }}>
        A comunidade de tecnologia e inovação se encontra aqui
      </div>
    </div>
  );
}
