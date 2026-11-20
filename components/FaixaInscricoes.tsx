'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export type ItemFaixa = { href: string; chamada: string; encerraEm: string };

const abertos = (itens: ItemFaixa[], agora: number) =>
  itens.filter((i) => agora < Date.parse(i.encerraEm));

/**
 * Faixa de aviso acima do menu, em todas as páginas com <Nav />: links diretos
 * para as inscrições com vagas limitadas. Cada link some quando as inscrições
 * da atividade fecham, e a faixa some junto com o último. Não consulta o
 * Supabase, para as páginas continuarem estáticas.
 */
export default function FaixaInscricoes({ itens }: { itens: ItemFaixa[] }) {
  // 1º render igual ao HTML estático (todos); depois do mount, filtra pelo relógio.
  const [visiveis, setVisiveis] = useState(itens);

  useEffect(() => {
    const atualizar = () => setVisiveis(abertos(itens, Date.now()));
    atualizar();
    const id = setInterval(atualizar, 60_000);
    return () => clearInterval(id);
  }, [itens]);

  if (visiveis.length === 0) return null;

  return (
    <aside className="faixa-insc" aria-label="Inscrições com vagas limitadas">
      <span className="faixa-insc-rotulo">
        <span className="faixa-insc-ponto" aria-hidden="true" />
        Vagas limitadas
      </span>
      <span className="faixa-insc-links">
        {visiveis.map((i) => (
          <Link key={i.href} href={i.href} className="faixa-insc-link">
            {i.chamada} <span aria-hidden="true">→</span>
          </Link>
        ))}
      </span>
    </aside>
  );
}
