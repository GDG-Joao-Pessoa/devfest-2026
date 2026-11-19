'use client';

import { useActionState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { inscrever, type EstadoInscricao } from '@/app/inscricoes/actions';
import type { Campo, SlugAtividade } from '@/lib/inscricoes';

type Props = {
  slug: SlugAtividade;
  titulo: string;
  campos: Campo[];
  confirmacoes: string[];
  /** Vagas cheias: a inscrição vai para a lista de espera. */
  esgotado: boolean;
  /** Sem formulário: inscrições encerradas, ou vagas e lista de espera completas. */
  fechado: 'encerrada' | 'lotada' | null;
  cabecalho: { titulo: string; texto: string };
};

const INICIAL: EstadoInscricao = { tipo: 'inicial' };

export default function InscricaoForm({
  slug,
  titulo,
  campos,
  confirmacoes,
  esgotado,
  fechado,
  cabecalho,
}: Props) {
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
    return (
      <div className="insc-encerrada">
        <h2 className="insc-resultado-titulo">
          {fechado === 'encerrada' ? 'Inscrições encerradas' : 'Vagas esgotadas'}
        </h2>
        <p className="insc-resultado-texto">
          {fechado === 'encerrada'
            ? 'As inscrições para esta atividade já foram encerradas.'
            : 'Todas as vagas e a lista de espera já foram preenchidas.'}{' '}
          Confira o restante da programação do DevFest.
        </p>
        <Link href="/#programacao" className="spk-all-link">
          Ver a programação →
        </Link>
      </div>
    );
  }

  const erro = estado.tipo === 'erro' ? estado : null;
  const valor = (nome: string) => erro?.valores[nome] ?? '';
  const erroDe = (nome: string) => erro?.campos[nome];
  const ajuda = (nome: string, extra?: string) =>
    [erroDe(nome) && `${nome}-erro`, extra && `${nome}-ajuda`].filter(Boolean).join(' ') || undefined;

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
        obrigatorio
        max={120}
        autoComplete="name"
        valor={valor('nome')}
        erro={erroDe('nome')}
        descritoPor={ajuda('nome')}
      />
      <CampoTexto
        nome="email"
        rotulo="E-mail"
        tipo="email"
        obrigatorio
        max={254}
        autoComplete="email"
        valor={valor('email')}
        erro={erroDe('email')}
        descritoPor={ajuda('email')}
      />
      <CampoTexto
        nome="whatsapp"
        rotulo="WhatsApp"
        tipo="tel"
        obrigatorio
        max={20}
        placeholder="(83) 99999-0000"
        autoComplete="tel"
        valor={valor('whatsapp')}
        erro={erroDe('whatsapp')}
        descritoPor={ajuda('whatsapp')}
      />

      {campos.map((c) => {
        if (c.tipo === 'texto') {
          return (
            <CampoTexto
              key={c.nome}
              nome={c.nome}
              rotulo={c.rotulo}
              obrigatorio={c.obrigatorio}
              max={c.max}
              placeholder={c.placeholder}
              autoComplete={c.autoComplete}
              textoAjuda={c.ajuda}
              valor={valor(c.nome)}
              erro={erroDe(c.nome)}
              descritoPor={ajuda(c.nome, c.ajuda)}
            />
          );
        }
        if (c.tipo === 'opcoes') {
          return (
            <div key={c.nome} className="insc-campo">
              <label htmlFor={`f-${c.nome}`} className="insc-rotulo">
                {c.rotulo}
              </label>
              <select
                id={`f-${c.nome}`}
                name={c.nome}
                required
                defaultValue={valor(c.nome)}
                aria-invalid={erroDe(c.nome) ? true : undefined}
                aria-describedby={ajuda(c.nome, c.ajuda)}
                className="insc-input"
              >
                <option value="" disabled>
                  Selecione
                </option>
                {c.opcoes.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
              <Mensagens nome={c.nome} erro={erroDe(c.nome)} ajuda={c.ajuda} />
            </div>
          );
        }
        return (
          <fieldset
            key={c.nome}
            className="insc-campo insc-fieldset"
            aria-invalid={erroDe(c.nome) ? true : undefined}
            aria-describedby={ajuda(c.nome, c.ajuda)}
          >
            <legend className="insc-rotulo">{c.rotulo}</legend>
            <div className="insc-simnao">
              {(['sim', 'nao'] as const).map((v) => (
                <label key={v} className="insc-radio">
                  <input type="radio" name={c.nome} value={v} required defaultChecked={valor(c.nome) === v} />
                  {v === 'sim' ? 'Sim' : 'Não'}
                </label>
              ))}
            </div>
            <Mensagens nome={c.nome} erro={erroDe(c.nome)} ajuda={c.ajuda} />
          </fieldset>
        );
      })}

      <div className="insc-confirmacoes">
        {confirmacoes.map((texto, i) => (
          <Caixa
            key={i}
            nome={`confirmacao_${i}`}
            marcada={valor(`confirmacao_${i}`) === 'on'}
            erro={erroDe(`confirmacao_${i}`)}
          >
            {texto}
          </Caixa>
        ))}
        <Caixa nome="consentimento" marcada={valor('consentimento') === 'on'} erro={erroDe('consentimento')}>
          Autorizo o GDG João Pessoa a usar meus dados apenas para organizar esta atividade, conforme a
          LGPD.
        </Caixa>
      </div>

      <button type="submit" className="insc-enviar" disabled={enviando}>
        {enviando ? 'Enviando…' : esgotado ? 'Entrar na lista de espera →' : 'Confirmar inscrição →'}
      </button>
    </form>
    </>
  );
}

function CampoTexto({
  nome,
  rotulo,
  tipo = 'text',
  obrigatorio,
  max,
  placeholder,
  autoComplete,
  textoAjuda,
  valor,
  erro,
  descritoPor,
}: {
  nome: string;
  rotulo: string;
  tipo?: 'text' | 'email' | 'tel';
  obrigatorio: boolean;
  max: number;
  placeholder?: string;
  autoComplete?: string;
  textoAjuda?: string;
  valor: string;
  erro?: string;
  descritoPor?: string;
}) {
  return (
    <div className="insc-campo">
      <label htmlFor={`f-${nome}`} className="insc-rotulo">
        {rotulo}
        {!obrigatorio && <span className="insc-opcional"> (opcional)</span>}
      </label>
      <input
        id={`f-${nome}`}
        name={nome}
        type={tipo}
        inputMode={tipo === 'tel' ? 'tel' : undefined}
        required={obrigatorio}
        maxLength={max}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={valor}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descritoPor}
        className="insc-input"
      />
      <Mensagens nome={nome} erro={erro} ajuda={textoAjuda} />
    </div>
  );
}

function Mensagens({ nome, erro, ajuda }: { nome: string; erro?: string; ajuda?: string }) {
  return (
    <>
      {ajuda && (
        <p id={`${nome}-ajuda`} className="insc-ajuda">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={`${nome}-erro`} className="insc-erro">
          {erro}
        </p>
      )}
    </>
  );
}

function Caixa({
  nome,
  marcada,
  erro,
  children,
}: {
  nome: string;
  marcada: boolean;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="insc-caixa">
        <input
          type="checkbox"
          name={nome}
          required
          defaultChecked={marcada}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${nome}-erro` : undefined}
        />
        <span>{children}</span>
      </label>
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
