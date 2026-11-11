import Image from 'next/image';
import gdgLogo from '@/public/assets/gdg-jp-logo-white.png';
import devfestBrackets from '@/public/assets/devfest-brackets-w3.png';
import NavMenu, { type NavLink } from './NavMenu';

const links: NavLink[] = [
  { href: '#trilhas', label: 'Trilhas' },
  { href: '#palestrantes', label: 'Palestrantes' },
  { href: '#programacao', label: 'Programação' },
  { href: '#local', label: 'Local' },
  { href: '#faq', label: 'FAQ' },
];

// Layout responsivo (padding, tamanho dos logos, menu mobile) em .site-nav no globals.css.
export default function Nav() {
  return (
    <nav className="site-nav">
      <a href="#top" className="nav-brand">
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
        {links.map((l) => (
          <a key={l.href} href={l.href} className="nav-link">
            {l.label}
          </a>
        ))}
        <a href="#ingressos" className="nav-cta">
          Ingressos
        </a>
        <NavMenu links={links} />
      </div>
    </nav>
  );
}
