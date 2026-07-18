import Image from 'next/image';
import gdgLogo from '@/public/assets/gdg-jp-logo-white.png';
import devfestBrackets from '@/public/assets/devfest-brackets-w3.png';

const links = [
  { href: '#trilhas', label: 'Trilhas' },
  { href: '#palestrantes', label: 'Palestrantes' },
  { href: '#agenda', label: 'Agenda' },
  { href: '#local', label: 'Local' },
  { href: '#faq', label: 'FAQ' },
];

export default function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 40px',
        background: 'rgba(8,8,15,.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,.07)',
      }}
    >
      <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <Image
          src={gdgLogo}
          alt="GDG João Pessoa"
          style={{ height: 28, width: 'auto', objectFit: 'contain' }}
          priority
        />
        <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,.16)' }} />
        <Image
          src={devfestBrackets}
          alt="DevFest"
          style={{ height: 26, width: 'auto', objectFit: 'contain' }}
          priority
        />
      </a>
      <div
        className="nav-links"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          font: "600 13.5px/1 var(--font-figtree)",
          color: 'rgba(242,242,247,.72)',
        }}
      >
        {links.map((l) => (
          <a key={l.href} href={l.href} className="nav-link">
            {l.label}
          </a>
        ))}
        <a
          href="#ingressos"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 22px',
            borderRadius: 999,
            background: 'linear-gradient(90deg,#4285F4,#34A853)',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          Ingressos
        </a>
      </div>
    </nav>
  );
}
