'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { dentroDaJanela, type Janela } from '@/lib/inscricoes';

/**
 * Relógio para mostrar/esconder links de inscrição conforme a janela de cada
 * atividade. O 1º render usa `inicial` (calculado no servidor, igual ao HTML,
 * sem erro de hidratação); depois do mount o navegador confere a cada minuto.
 * Assim páginas estáticas (home) mudam sozinhas na hora certa, sem novo deploy.
 */
export function useNaJanela(janelas: Janela[], inicial: boolean[]): boolean[] {
  const [visiveis, setVisiveis] = useState(inicial);

  useEffect(() => {
    const atualizar = () => {
      const agora = Date.now();
      setVisiveis((atual) => {
        const novo = janelas.map((j) => dentroDaJanela(j, agora));
        return novo.every((v, i) => v === atual[i]) ? atual : novo;
      });
    };
    atualizar();
    const id = setInterval(atualizar, 60_000);
    return () => clearInterval(id);
  }, [janelas]);

  return visiveis;
}

/** Mostra `children` só dentro da janela da atividade. */
export default function NaJanela({
  janela,
  inicial,
  children,
}: {
  janela: Janela;
  inicial: boolean;
  children: ReactNode;
}) {
  const [janelas] = useState(() => [janela]);
  const [iniciais] = useState(() => [inicial]);
  const [visivel] = useNaJanela(janelas, iniciais);
  return visivel ? <>{children}</> : null;
}
