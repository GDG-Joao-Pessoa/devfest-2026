import Image from 'next/image';
import gdgLogo from '@/public/assets/gdg-jp-logo-white.png';

const columns = [
  {
    title: 'Evento',
    links: [
      { href: '#trilhas', label: 'Trilhas' },
      { href: '#palestrantes', label: 'Palestrantes' },
      { href: '#agenda', label: 'Agenda' },
      { href: '#ingressos', label: 'Ingressos' },
    ],
  },
  {
    title: 'Comunidade',
    links: [
      { href: '#', label: 'Instagram' },
      { href: '#', label: 'LinkedIn' },
      { href: '#', label: 'Meetup' },
      { href: '#', label: 'Newsletter' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '56px 40px 40px' }}>
      <div
        className="footer-top"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 40,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: 320 }}>
          <Image
            src={gdgLogo}
            alt="GDG João Pessoa"
            style={{ height: 30, width: 'auto', marginBottom: 18 }}
          />
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(242,242,247,.55)', margin: 0 }}>
            DevFest João Pessoa 2026 — o maior evento de tecnologia da comunidade GDG na Paraíba.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
          {columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  font: '700 12px/1 var(--font-ibm)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: 'rgba(242,242,247,.5)',
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 11,
                  fontSize: 14,
                  color: 'rgba(242,242,247,.72)',
                }}
              >
                {col.links.map((l, i) => (
                  <a key={i} href={l.href}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="footer-bottom"
        style={{
          maxWidth: 1100,
          margin: '44px auto 0',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,.07)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          font: '500 12px var(--font-ibm)',
          color: 'rgba(242,242,247,.4)',
        }}
      >
        <span>© 2026 GDG João Pessoa</span>
        <span>20 &amp; 21 Nov · Uniesp · João Pessoa</span>
      </div>
    </footer>
  );
}
