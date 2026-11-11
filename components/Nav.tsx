import Image from 'next/image';
import gdgLogo from '@/public/assets/gdg-jp-logo-white.png';
import devfestBrackets from '@/public/assets/devfest-brackets-w3.png';
import NavMenu, { type NavLink } from './NavMenu';

const links: NavLink[] = [
  { href: '#palestrantes', label: 'Palestrantes' },
  { href: '#programacao', label: 'Programação' },
  { href: '#local', label: 'Local' },
  { href: '#faq', label: 'FAQ' },
];

// Layout responsivo (padding, tamanho dos logos, menu mobile) em .site-nav no globals.css.
export default function Nav({
  base = '',
}: {
  /** prefixo dos links de seção: '' na home, '/' nas outras páginas */
  base?: string;
}) {
  const items = links.map((l) => ({ ...l, href: base + l.href }));

  return (
    <nav className="site-nav">
      <a href={base ? '/' : '#top'} className="nav-brand">
        <Image
          src={gdgLogo}
          alt="GDG João Pessoa"
          className="nav-logo-gdg"
          style={{ width: 'auto', objectFit: 'contain' }}
          priority
        />
        <span className="nav-divider" />
        <Image
          src={devfestBrackets}
          alt="DevFest"
          className="nav-logo-devfest"
          style={{ width: 'auto', objectFit: 'contain' }}
          priority
        />
      </a>
      <div className="nav-links">
        {items.map((l) => (
          <a key={l.href} href={l.href} className="nav-link">
            {l.label}
          </a>
        ))}
        <a href={`${base}#ingressos`} className="nav-cta">
          Ingressos
        </a>
        <NavMenu links={items} />
      </div>
    </nav>
  );
}
