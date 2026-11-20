'use client';

import Link from 'next/link';
import { useState } from 'react';
import Reveal from './Reveal';
import { useNaJanela } from './NaJanela';
import type { Janela } from '@/lib/inscricoes';

export type CardInscricao = {
  slug: string;
  href: string;
  cor: string;
  corTexto: string;
  eyebrow: string;
  titulo: string;
  com: string | null;
  resumo: string;
  quando: string;
  janela: Janela;
  inicial: boolean;
};

/** Seção "Vagas limitadas" da home; some inteira quando nenhuma inscrição está aberta. */
export default function SecaoInscricoes({ cards }: { cards: CardInscricao[] }) {
  const [janelas] = useState(() => cards.map((c) => c.janela));
  const [iniciais] = useState(() => cards.map((c) => c.inicial));
  const visiveis = useNaJanela(janelas, iniciais);
  const abertos = cards.filter((_, i) => visiveis[i]);

  if (abertos.length === 0) return null;

  return (
    <Reveal
      as="section"
      id="inscricoes"
      style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 90px', scrollMarginTop: 80 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div
          style={{
            font: '600 12px/1 var(--font-ibm)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#8ab4f8',
            marginBottom: 16,
          }}
        >
          // Inscrições
        </div>
        <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
          Vagas limitadas
        </h2>
        <p
          style={{
            margin: '18px auto 0',
            maxWidth: 520,
            fontSize: 16,
            lineHeight: 1.6,
            color: 'rgba(242,242,247,.66)',
          }}
        >
          Algumas atividades têm lugares contados. Garanta o seu com uma inscrição rápida, separada do
          ingresso.
        </p>
      </div>

      <div className={abertos.length === 1 ? 'insc-home-grid insc-home-grid--um' : 'insc-home-grid'}>
        {abertos.map((c) => (
          <Link
            key={c.slug}
            href={c.href}
            className="insc-home-card"
            style={{ '--insc-cor': c.cor, '--insc-cor-texto': c.corTexto } as React.CSSProperties}
          >
            <span className="insc-home-eyebrow">{c.eyebrow}</span>
            <h3 className="insc-home-titulo">{c.titulo}</h3>
            {c.com && <span className="insc-home-com">com {c.com}</span>}
            <p className="insc-home-texto">{c.resumo}</p>
            <span className="insc-home-meta">{c.quando}</span>
            <span className="insc-home-cta">Quero me inscrever →</span>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
