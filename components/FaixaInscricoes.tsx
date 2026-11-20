'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useNaJanela } from './NaJanela';
import type { Janela } from '@/lib/inscricoes';

export type ItemFaixa = { href: string; chamada: string; janela: Janela; inicial: boolean };

/**
 * Faixa de aviso acima do menu, em todas as páginas com <Nav />: links diretos
 * para as inscrições com vagas limitadas. Cada link só aparece dentro da janela
 * da atividade (da abertura ao encerramento das inscrições), e a faixa some
 * quando não sobra nenhum. Não consulta o Supabase, para as páginas
 * continuarem estáticas.
 */
export default function FaixaInscricoes({ itens }: { itens: ItemFaixa[] }) {
  const [janelas] = useState(() => itens.map((i) => i.janela));
  const [iniciais] = useState(() => itens.map((i) => i.inicial));
  const visiveis = useNaJanela(janelas, iniciais);
  const abertos = itens.filter((_, i) => visiveis[i]);

  if (abertos.length === 0) return null;

  return (
    <aside className="faixa-insc" aria-label="Inscrições com vagas limitadas">
      <span className="faixa-insc-rotulo">
        <span className="faixa-insc-ponto" aria-hidden="true" />
        Vagas limitadas
      </span>
      <span className="faixa-insc-links">
        {abertos.map((i) => (
          <Link key={i.href} href={i.href} className="faixa-insc-link">
            {i.chamada} <span aria-hidden="true">→</span>
          </Link>
        ))}
      </span>
    </aside>
  );
}
