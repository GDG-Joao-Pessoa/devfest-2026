'use client';

import { useEffect } from 'react';

const PREFIX = 'palestrante-';

/**
 * Liga os <dialog class="spk-dialog" id="palestrante-<id>"> (renderizados no
 * servidor em Palestrantes.tsx) ao hash da URL:
 *
 * - qualquer link para `#palestrante-<id>` abre o modal (cards de palestrantes
 *   e da programação), e o link pode ser compartilhado;
 * - o botão Voltar do navegador fecha o modal;
 * - fechar (X, Esc ou clique fora) limpa o hash da URL e devolve o foco a quem
 *   abriu o modal (a navegação por hash tira o foco do link, então a
 *   restauração nativa do <dialog> não basta).
 */
export default function SpeakerDialogController() {
  useEffect(() => {
    // true quando o modal foi aberto por navegação nesta página (há uma entrada
    // de histórico para desfazer); false quando a página já abriu com o hash.
    let pushedEntry = false;
    let opener: HTMLElement | null = null; // link que abriu o modal
    let focusAfterBack: HTMLElement | null = null;

    const openDialog = () => document.querySelector<HTMLDialogElement>('dialog.spk-dialog[open]');
    const restoreFocus = (el: HTMLElement | null) => {
      if (el?.isConnected) el.focus({ preventScroll: true });
    };

    const sync = (fromNavigation: boolean) => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id.startsWith(PREFIX) ? document.getElementById(id) : null;
      const current = openDialog();
      if (current && current !== target) current.close();
      if (target instanceof HTMLDialogElement && !target.open) {
        pushedEntry = fromNavigation;
        if (!fromNavigation) opener = null;
        target.showModal();
      }
    };

    const onHashChange = () => {
      sync(true);
      if (focusAfterBack) {
        restoreFocus(focusAfterBack);
        focusAfterBack = null;
      }
    };

    const onClose = (e: Event) => {
      const dialog = e.target;
      if (!(dialog instanceof HTMLDialogElement) || !dialog.classList.contains('spk-dialog')) return;
      const el = opener;
      opener = null;
      if (window.location.hash !== `#${dialog.id}`) {
        restoreFocus(el); // fechado pelo Voltar: a URL já mudou
      } else if (pushedEntry) {
        pushedEntry = false;
        focusAfterBack = el; // o foco volta no hashchange que o back() dispara
        window.history.back();
      } else {
        window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
        restoreFocus(el);
      }
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target;
      // Clique no fundo escurecido: o alvo é o próprio <dialog> (o conteúdo fica num wrapper interno).
      if (el instanceof HTMLDialogElement && el.classList.contains('spk-dialog')) {
        el.close();
        return;
      }
      // Guarda quem vai abrir o modal (o hashchange vem depois do clique).
      const link = el instanceof Element ? el.closest<HTMLAnchorElement>(`a[href^="#${PREFIX}"]`) : null;
      if (link) opener = link;
    };

    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('close', onClose, true); // `close` não borbulha
    document.addEventListener('click', onClick);
    sync(false); // link direto: /#palestrante-<id>

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('close', onClose, true);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
