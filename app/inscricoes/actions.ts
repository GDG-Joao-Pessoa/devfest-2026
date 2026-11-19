'use server';

import { atividades, isSlugAtividade, type Atividade } from '@/lib/inscricoes';
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

function validar(atividade: Atividade, fd: FormData) {
  const campos: Record<string, string> = {};
  const valores: Valores = {};

  const nome = texto(fd, 'nome').replace(/\s+/g, ' ');
  const email = texto(fd, 'email').toLowerCase();
  const whatsappDigitado = texto(fd, 'whatsapp');
  const whatsapp = normalizarWhatsapp(whatsappDigitado);
  Object.assign(valores, { nome, email, whatsapp: whatsappDigitado });

  if (nome.length < 2 || nome.length > 120) campos.nome = 'Informe seu nome completo.';
  if (!EMAIL_RE.test(email) || email.length > 254) campos.email = 'Informe um e-mail válido.';
  if (!whatsapp) campos.whatsapp = 'Informe um WhatsApp com DDD, ex.: (83) 99999-0000.';

  const respostas: Record<string, string | boolean> = {};
  for (const campo of atividade.campos) {
    const v = texto(fd, campo.nome);
    valores[campo.nome] = v;
    if (campo.tipo === 'texto') {
      if (campo.obrigatorio && !v) campos[campo.nome] = 'Campo obrigatório.';
      else if (v.length > campo.max) campos[campo.nome] = `Use no máximo ${campo.max} caracteres.`;
      else if (v) respostas[campo.nome] = v;
    } else if (campo.tipo === 'opcoes') {
      if (!campo.opcoes.some((o) => o.valor === v)) campos[campo.nome] = 'Escolha uma opção.';
      else respostas[campo.nome] = v;
    } else {
      if (v !== 'sim' && v !== 'nao') campos[campo.nome] = 'Escolha sim ou não.';
      else respostas[campo.nome] = v === 'sim';
    }
  }

  atividade.confirmacoes.forEach((_, i) => {
    const nomeCampo = `confirmacao_${i}`;
    if (fd.get(nomeCampo) !== 'on') campos[nomeCampo] = 'Marque para continuar.';
    else valores[nomeCampo] = 'on';
  });
  if (fd.get('consentimento') !== 'on') campos.consentimento = 'Marque para continuar.';
  else valores.consentimento = 'on';

  return { campos, valores, dados: { nome, email, whatsapp: whatsapp ?? '', respostas } };
}

const MENSAGENS_ERRO: Record<string, string> = {
  inscricoes_encerradas: 'As inscrições para esta atividade foram encerradas.',
  vagas_esgotadas: 'As vagas e a lista de espera já estão completas.',
  atividade_inexistente: 'Atividade não encontrada.',
  nao_configurado: 'As inscrições estão indisponíveis no momento. Tente de novo mais tarde.',
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

  // Honeypot: campo invisível que só robôs preenchem.
  if (texto(fd, 'site')) {
    return { tipo: 'erro', mensagem: ERRO_GENERICO, campos: {}, valores: {}, envio };
  }

  const { campos, valores, dados } = validar(atividades[slug], fd);
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
      p_respostas: dados.respostas,
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
