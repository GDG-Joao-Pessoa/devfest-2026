'use server';

import { antesDaAbertura, atividades, isSlugAtividade } from '@/lib/inscricoes';
import { rpc } from '@/lib/supabase';

/** Valores digitados, devolvidos em caso de erro para o formulário não perder nada. */
type Valores = Record<string, string>;

export type EstadoInscricao =
  | { tipo: 'inicial' }
  | {
      tipo: 'erro';
      mensagem: string;
      /** nome do campo → mensagem */
      campos: Record<string, string>;
      valores: Valores;
      /** muda a cada envio: remonta o form com os valores devolvidos */
      envio: number;
    }
  | {
      tipo: 'sucesso';
      status: 'confirmada' | 'lista_espera';
      posicao: number | null;
      jaInscrito: boolean;
      nome: string;
      email: string;
    };

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

/** Só nome, e-mail e WhatsApp. */
function validar(fd: FormData) {
  const campos: Record<string, string> = {};

  const nome = texto(fd, 'nome').replace(/\s+/g, ' ');
  const email = texto(fd, 'email').toLowerCase();
  const whatsappDigitado = texto(fd, 'whatsapp');
  const whatsapp = normalizarWhatsapp(whatsappDigitado);
  const valores: Valores = { nome, email, whatsapp: whatsappDigitado };

  if (nome.length < 2 || nome.length > 120) campos.nome = 'Informe seu nome completo.';
  if (!EMAIL_RE.test(email) || email.length > 254) campos.email = 'Informe um e-mail válido.';
  if (!whatsapp) campos.whatsapp = 'Informe um WhatsApp com DDD, ex.: (83) 99999-0000.';

  return { campos, valores, dados: { nome, email, whatsapp: whatsapp ?? '' } };
}

const MENSAGENS_ERRO: Record<string, string> = {
  inscricoes_encerradas: 'As inscrições para esta atividade foram encerradas.',
  vagas_esgotadas: 'As vagas e a lista de espera já estão completas.',
  atividade_inexistente: 'Atividade não encontrada.',
};
const ERRO_GENERICO = 'Não foi possível concluir sua inscrição agora. Tente de novo em instantes.';

export async function inscrever(
  anterior: EstadoInscricao,
  fd: FormData,
): Promise<EstadoInscricao> {
  const envio = (anterior.tipo === 'erro' ? anterior.envio : 0) + 1;
  const slug = fd.get('atividade');
  if (!isSlugAtividade(slug)) {
    return { tipo: 'erro', mensagem: 'Atividade não encontrada.', campos: {}, valores: {}, envio };
  }

  // Antes da abertura (ex.: Code in the Dark antes de sáb 08:00), recusa mesmo
  // quem tiver o link direto ou a página aberta desde antes.
  const atividade = atividades[slug];
  if (antesDaAbertura(atividade, Date.now()) && atividade.abertura) {
    return {
      tipo: 'erro',
      mensagem: `As inscrições abrem ${atividade.abertura.texto}.`,
      campos: {},
      valores: {},
      envio,
    };
  }

  // Honeypot: campo invisível que só robôs preenchem.
  if (texto(fd, 'site')) {
    return { tipo: 'erro', mensagem: ERRO_GENERICO, campos: {}, valores: {}, envio };
  }

  const { campos, valores, dados } = validar(fd);
  if (Object.keys(campos).length > 0) {
    return { tipo: 'erro', mensagem: 'Confira os campos destacados.', campos, valores, envio };
  }

  const res = await rpc<{ status: 'confirmada' | 'lista_espera'; posicao: number | null; ja_inscrito: boolean }>(
    'inscrever',
    {
      p_atividade: slug,
      p_nome: dados.nome,
      p_email: dados.email,
      p_whatsapp: dados.whatsapp,
      // p_respostas fica com o padrão do banco ('{}'): não há perguntas extras.
    },
  );

  if (!res.ok) {
    return {
      tipo: 'erro',
      mensagem: MENSAGENS_ERRO[res.erro] ?? ERRO_GENERICO,
      campos: {},
      valores,
      envio,
    };
  }

  return {
    tipo: 'sucesso',
    status: res.data.status,
    posicao: res.data.posicao,
    jaInscrito: res.data.ja_inscrito,
    nome: dados.nome,
    email: dados.email,
  };
}
