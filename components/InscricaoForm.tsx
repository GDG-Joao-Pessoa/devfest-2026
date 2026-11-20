'use client';

import { useActionState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { inscrever, type EstadoInscricao } from '@/app/inscricoes/actions';
import type { SlugAtividade } from '@/lib/inscricoes';

type Props = {
  slug: SlugAtividade;
  titulo: string;
  /** Vagas cheias: a inscrição vai para a lista de espera. */
  esgotado: boolean;
  /** Sem formulário: ainda não abriu, encerrada, ou vagas e lista de espera completas. */
  fechado:
    | { motivo: 'em_breve'; abertura: string }
    | { motivo: 'encerrada' }
    | { motivo: 'lotada' }
    | null;
  cabecalho: { titulo: string; texto: string };
};

const INICIAL: EstadoInscricao = { tipo: 'inicial' };

export default function InscricaoForm({ slug, titulo, esgotado, fechado, cabecalho }: Props) {
  const [estado, acao, enviando] = useActionState(inscrever, INICIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);

  // Erro: foco no primeiro campo inválido. Sucesso: foco no resultado (leitores de tela).
  useEffect(() => {
    if (estado.tipo === 'erro') {
      const primeiro = Object.keys(estado.campos)[0];
      const alvo = primeiro
        ? formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)
        : formRef.current?.querySelector<HTMLElement>('.insc-alerta');
      alvo?.focus();
    } else if (estado.tipo === 'sucesso') {
      resultadoRef.current?.focus();
    }
  }, [estado]);

  // O resultado do envio vem antes de tudo: a página pode ter sido renderizada de
  // novo já como lotada justamente por causa desta inscrição.
  if (estado.tipo === 'sucesso') {
    return <Resultado estado={estado} titulo={titulo} refEl={resultadoRef} />;
  }

  if (fechado) {
    const [tituloFechado, textoFechado] =
      fechado.motivo === 'em_breve'
        ? [
            'Inscrições em breve',
            `As inscrições abrem ${fechado.abertura}. Volte aqui nesse horário para garantir sua vaga.`,
          ]
        : fechado.motivo === 'encerrada'
          ? [
              'Inscrições encerradas',
              'As inscrições para esta atividade já foram encerradas. Confira o restante da programação do DevFest.',
            ]
          : [
              'Vagas esgotadas',
              'Todas as vagas e a lista de espera já foram preenchidas. Confira o restante da programação do DevFest.',
            ];
    return (
      <div className="insc-encerrada">
        <h2 className="insc-resultado-titulo">{tituloFechado}</h2>
        <p className="insc-resultado-texto">{textoFechado}</p>
        <Link href="/#programacao" className="spk-all-link">
          Ver a programação →
        </Link>
      </div>
    );
  }

  const erro = estado.tipo === 'erro' ? estado : null;
  const valor = (nome: string) => erro?.valores[nome] ?? '';
  const erroDe = (nome: string) => erro?.campos[nome];

  return (
    <>
    <h2 className="insc-card-titulo">{cabecalho.titulo}</h2>
    <p className="insc-card-texto">{cabecalho.texto}</p>
    {/* `key`: depois de um erro o form remonta com os valores devolvidos pelo servidor
        (o React 19 limpa formulários com `action` ao fim de cada envio). */}
    <form key={erro?.envio ?? 0} ref={formRef} action={acao} className="insc-form" noValidate>
      <input type="hidden" name="atividade" value={slug} />
      <div className="insc-honeypot" aria-hidden="true">
        <label>
          Não preencha este campo
          <input type="text" name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {erro && (
        <div className="insc-alerta" role="alert" tabIndex={-1}>
          {erro.mensagem}
        </div>
      )}

      <CampoTexto
        nome="nome"
        rotulo="Nome completo"
        max={120}
        autoComplete="name"
        valor={valor('nome')}
        erro={erroDe('nome')}
      />
      <CampoTexto
        nome="email"
        rotulo="E-mail"
        tipo="email"
        max={254}
        autoComplete="email"
        valor={valor('email')}
        erro={erroDe('email')}
      />
      <CampoTexto
        nome="whatsapp"
        rotulo="WhatsApp"
        tipo="tel"
        max={20}
        placeholder="(83) 99999-0000"
        autoComplete="tel"
        valor={valor('whatsapp')}
        erro={erroDe('whatsapp')}
      />

      <button type="submit" className="insc-enviar" disabled={enviando}>
        {enviando ? 'Enviando…' : esgotado ? 'Entrar na lista de espera →' : 'Confirmar inscrição →'}
      </button>
      <p className="insc-ajuda insc-lgpd">
        Seus dados são usados só para organizar esta atividade (LGPD).
      </p>
    </form>
    </>
  );
}

/** Campo obrigatório de texto, com a mensagem de erro ligada por aria-describedby. */
function CampoTexto({
  nome,
  rotulo,
  tipo = 'text',
  max,
  placeholder,
  autoComplete,
  valor,
  erro,
}: {
  nome: string;
  rotulo: string;
  tipo?: 'text' | 'email' | 'tel';
  max: number;
  placeholder?: string;
  autoComplete: string;
  valor: string;
  erro?: string;
}) {
  return (
    <div className="insc-campo">
      <label htmlFor={`f-${nome}`} className="insc-rotulo">
        {rotulo}
      </label>
      <input
        id={`f-${nome}`}
        name={nome}
        type={tipo}
        inputMode={tipo === 'tel' ? 'tel' : undefined}
        required
        maxLength={max}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={valor}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${nome}-erro` : undefined}
        className="insc-input"
      />
      {erro && (
        <p id={`${nome}-erro`} className="insc-erro">
          {erro}
        </p>
      )}
    </div>
  );
}

function Resultado({
  estado,
  titulo,
  refEl,
}: {
  estado: Extract<EstadoInscricao, { tipo: 'sucesso' }>;
  titulo: string;
  refEl: React.RefObject<HTMLDivElement | null>;
}) {
  const primeiroNome = estado.nome.split(' ')[0];
  const espera = estado.status === 'lista_espera';

  return (
    <div
      ref={refEl}
      tabIndex={-1}
      role="status"
      className={espera ? 'insc-resultado insc-resultado--espera' : 'insc-resultado'}
    >
      <div className="insc-resultado-icone" aria-hidden="true">
        {espera ? '⏳' : '✓'}
      </div>
      <h2 className="insc-resultado-titulo">
        {espera
          ? `${primeiroNome}, você está na lista de espera`
          : estado.jaInscrito
            ? `${primeiroNome}, sua inscrição já estava feita!`
            : `Inscrição confirmada, ${primeiroNome}!`}
      </h2>
      <p className="insc-resultado-texto">
        {espera ? (
          <>
            As vagas de <strong>{titulo}</strong> acabaram
            {estado.posicao ? (
              <>
                {' '}e você é a <strong>{estado.posicao}ª pessoa</strong> da fila
              </>
            ) : null}
            . Se uma vaga abrir, a organização entra em contato pelo WhatsApp ou pelo e-mail{' '}
            <strong>{estado.email}</strong>.
          </>
        ) : (
          <>
            Sua vaga em <strong>{titulo}</strong> está garantida com o e-mail{' '}
            <strong>{estado.email}</strong>. Se não puder mais participar, avise a organização para
            liberarmos a vaga para a lista de espera.
          </>
        )}
      </p>
      {estado.jaInscrito && (
        <p className="insc-ajuda">Este e-mail já tinha uma inscrição, então nada foi duplicado.</p>
      )}
      <div className="insc-resultado-acoes">
        <Link href="/#programacao" className="spk-all-link">
          Ver a programação →
        </Link>
      </div>
    </div>
  );
}
