'use server';

import { SORTEIO, type EstadoSorteio, type Ganhador } from '@/lib/sorteio';
import { rpc } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Inscrição (pública)
// ---------------------------------------------------------------------------

export type EstadoInscricaoSorteio =
  | { tipo: 'inicial' }
  | {
      tipo: 'erro';
      mensagem: string;
      campos: Record<string, string>;
      valores: Record<string, string>;
      envio: number;
    }
  | { tipo: 'sucesso'; nome: string; jaInscrito: boolean };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** "(83) 99999-0000" → "5583999990000". Aceita com ou sem o 55. */
function normalizarWhatsapp(v: string): string | null {
  const digitos = v.replace(/\D/g, '');
  if (/^\d{10,11}$/.test(digitos)) return `55${digitos}`;
  if (/^55\d{10,11}$/.test(digitos)) return digitos;
  return null;
}

const texto = (fd: FormData, nome: string) => {
  const v = fd.get(nome);
  return typeof v === 'string' ? v.trim() : '';
};

const ERRO_GENERICO = 'Não foi possível concluir sua inscrição agora. Tente de novo em instantes.';

export async function inscreverNoSorteio(
  anterior: EstadoInscricaoSorteio,
  fd: FormData,
): Promise<EstadoInscricaoSorteio> {
  const envio = (anterior.tipo === 'erro' ? anterior.envio : 0) + 1;

  // Honeypot: campo invisível que só robôs preenchem.
  if (texto(fd, 'site')) {
    return { tipo: 'erro', mensagem: ERRO_GENERICO, campos: {}, valores: {}, envio };
  }

  const nome = texto(fd, 'nome').replace(/\s+/g, ' ');
  const email = texto(fd, 'email').toLowerCase();
  const whatsappDigitado = texto(fd, 'whatsapp');
  const whatsapp = normalizarWhatsapp(whatsappDigitado);
  const valores = { nome, email, whatsapp: whatsappDigitado };

  const campos: Record<string, string> = {};
  if (nome.length < 2 || nome.length > 120) campos.nome = 'Informe seu nome completo.';
  if (!EMAIL_RE.test(email) || email.length > 254) campos.email = 'Informe um e-mail válido.';
  if (!whatsapp) campos.whatsapp = 'Informe um WhatsApp com DDD, ex.: (83) 99999-0000.';
  if (Object.keys(campos).length > 0) {
    return { tipo: 'erro', mensagem: 'Confira os campos destacados.', campos, valores, envio };
  }

  const res = await rpc<{ ja_inscrito: boolean }>('sorteio_inscrever', {
    p_sorteio: SORTEIO.slug,
    p_nome: nome,
    p_email: email,
    p_whatsapp: whatsapp,
  });
  if (!res.ok) {
    const mensagem =
      res.erro === 'sorteio_encerrado'
        ? 'As inscrições para o sorteio foram encerradas.'
        : ERRO_GENERICO;
    return { tipo: 'erro', mensagem, campos: {}, valores, envio };
  }
  return { tipo: 'sucesso', nome, jaInscrito: res.data.ja_inscrito };
}

// ---------------------------------------------------------------------------
// Telão (todas exigem a senha; ela só vai do navegador ao banco, nunca fica
// salva no servidor)
// ---------------------------------------------------------------------------

export type RespostaTelao<T> = { ok: true; data: T } | { ok: false; erro: string };

const ERROS_TELAO: Record<string, string> = {
  senha_invalida: 'Senha incorreta.',
  senha_nao_definida: 'A senha do telão ainda não foi definida no Supabase (ver README).',
  sem_participantes: 'Não há mais participantes para sortear.',
};

function traduzir<T>(res: { ok: true; data: T } | { ok: false; erro: string }): RespostaTelao<T> {
  if (res.ok) return res;
  return { ok: false, erro: ERROS_TELAO[res.erro] ?? 'Falha ao falar com o banco. Tente de novo.' };
}

export async function painelSorteio(senha: string) {
  return traduzir(await rpc<EstadoSorteio>('sorteio_painel', { p_senha: senha, p_sorteio: SORTEIO.slug }));
}

export async function definirInscricoesSorteio(senha: string, aberto: boolean) {
  return traduzir(
    await rpc<EstadoSorteio>('sorteio_definir_aberto', {
      p_senha: senha,
      p_sorteio: SORTEIO.slug,
      p_aberto: aberto,
    }),
  );
}

export async function sortear(senha: string) {
  return traduzir(
    await rpc<{ ganhador: Pick<Ganhador, 'id' | 'nome' | 'final'>; estado: EstadoSorteio }>(
      'sorteio_sortear',
      { p_senha: senha, p_sorteio: SORTEIO.slug },
    ),
  );
}

export async function marcarAusente(senha: string, ganhadorId: string, ausente: boolean) {
  return traduzir(
    await rpc<EstadoSorteio>('sorteio_marcar_ausente', {
      p_senha: senha,
      p_ganhador: ganhadorId,
      p_ausente: ausente,
    }),
  );
}
