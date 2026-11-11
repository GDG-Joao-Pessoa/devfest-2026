'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type NavLink = { href: string; label: string };

/**
 * Menu hambúrguer da nav (só aparece em telas ≤ 900px; ver .nav-menu no CSS).
 * Fecha ao escolher um link, com Esc (devolvendo o foco ao botão) e ao tocar
 * fora da nav.
 */
export default function NavMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      const nav = rootRef.current?.closest('nav');
      if (nav && !nav.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="nav-menu">
      <button
        ref={buttonRef}
        type="button"
        className="nav-menu-btn"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="nav-menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <div id={panelId} className="nav-menu-panel" hidden={!open}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
