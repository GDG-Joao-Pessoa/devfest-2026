import { ImageResponse } from 'next/og';

export const alt = 'DevFest João Pessoa 2026 — 20 & 21 Nov · Uniesp';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Fetch a Google Font as raw TTF for Satori (next/og). Returns null on failure
// so the OG image still renders with the fallback font instead of breaking build.
async function loadFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`;
    const css = await (
      await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    ).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!src) return null;
    return await (await fetch(src[1])).arrayBuffer();
  } catch {
    return null;
  }
}

const signature = 'linear-gradient(120deg,#4285F4,#34A853 45%,#FBBC04 72%,#EA4335)';

export default async function Image() {
  const [sora800, sora700] = await Promise.all([
    loadFont('Sora', 800),
    loadFont('Sora', 700),
  ]);

  const fonts = [
    sora800 && { name: 'Sora', data: sora800, weight: 800 as const, style: 'normal' as const },
    sora700 && { name: 'Sora', data: sora700, weight: 700 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 700 | 800; style: 'normal' }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(120% 130% at 50% 0%,#141426 0%,#0a0a14 55%,#08080f 100%)',
          fontFamily: 'Sora',
          position: 'relative',
        }}
      >
        {/* date pill */}
        <div
          style={{
            position: 'absolute',
            top: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 22px',
            border: '1px solid rgba(255,255,255,.18)',
            borderRadius: 999,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            color: '#f2f2f7',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#34A853' }} />
          20 &amp; 21 NOV · 2026
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, color: '#f2f2f7', letterSpacing: -3 }}>
              DevFest
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 14,
                marginTop: 4,
                background: signature,
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              JOÃO PESSOA
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 190,
              fontWeight: 800,
              letterSpacing: -6,
              marginLeft: 24,
              background: signature,
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            26
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, fontSize: 26, fontWeight: 700, color: '#f2f2f7' }}>
          <div style={{ display: 'flex' }}>Uniesp Centro Universitário</div>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: '#FBBC04' }} />
          <div style={{ display: 'flex' }}>Paraíba</div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 52,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'rgba(242,242,247,.5)',
          }}
        >
          A comunidade de tecnologia e inovação se encontra aqui
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
