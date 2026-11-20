// ---------------------------------------------------------------------------
// Sorteio do DevFest JP 2026 (supabase/migrations/20261120090000_sorteio.sql).
// /sorteio: inscrição pública (o link circula pelo QR Code do telão).
// /sorteio/telao: tela do sorteio, protegida pela senha da organização.
// ---------------------------------------------------------------------------

import { SITE_URL } from '@/lib/data';

export const SORTEIO = {
  /** `sorteios.slug` no Supabase */
  slug: 'dia-1',
  titulo: 'Sorteio do 1º dia',
  quando: 'Sexta-feira · 20/11',
} as const;

/** Endereço que o QR Code do telão abre. */
export const URL_INSCRICAO_SORTEIO = `${SITE_URL}/sorteio`;

export type Ganhador = {
  id: string;
  nome: string;
  /** 4 últimos dígitos do WhatsApp (diferencia nomes iguais no telão) */
  final: string;
  ausente: boolean;
  sorteado_em: string;
};

/** Estado do telão (`sorteio_estado` no banco). Nunca traz e-mail. */
export type EstadoSorteio = {
  aberto: boolean;
  total: number;
  /** participantes que ainda não foram sorteados */
  disponiveis: number;
  ganhadores: Ganhador[];
  /** amostra aleatória de nomes, para a animação */
  nomes: string[];
};
