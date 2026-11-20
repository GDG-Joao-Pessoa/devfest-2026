import Image from 'next/image';
import gdgLogo from '@/public/assets/gdg-jp-logo-white.png';
import devfestBrackets from '@/public/assets/devfest-brackets-w3.png';
import NavMenu, { type NavLink } from './NavMenu';
import FaixaInscricoes from './FaixaInscricoes';
import { dentroDaJanela, janelaDe, listaAtividades } from '@/lib/inscricoes';

const porEncerramento = listaAtividades.slice().sort((a, b) => a.encerraEm.localeCompare(b.encerraEm));

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
  // `inicial`: visibilidade no momento do render (build nas páginas estáticas,
  // request nas dinâmicas); o navegador reavalia depois (components/NaJanela.tsx).
  const agora = Date.now();
  const faixa = porEncerramento.map((a) => ({
    href: `/inscricoes/${a.rota}`,
    chamada: a.chamada,
    janela: janelaDe(a),
    inicial: dentroDaJanela(janelaDe(a), agora),
  }));

  return (
    <>
    {/* Fora do <nav> sticky: rola junto com a página e libera espaço no mobile. */}
    <FaixaInscricoes itens={faixa} />
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
    </>
  );
}
