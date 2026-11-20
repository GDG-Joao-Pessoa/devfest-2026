'use client';

import { useActionState, useEffect, useRef } from 'react';
import { inscreverNoSorteio, type EstadoInscricaoSorteio } from '@/app/sorteio/actions';

const INICIAL: EstadoInscricaoSorteio = { tipo: 'inicial' };

/** Formulário do sorteio: nome, e-mail e WhatsApp. Funciona também sem JS. */
export default function SorteioForm() {
  const [estado, acao, enviando] = useActionState(inscreverNoSorteio, INICIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (estado.tipo === 'erro') {
      const primeiro = Object.keys(estado.campos)[0];
      (primeiro
        ? formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)
        : formRef.current?.querySelector<HTMLElement>('.insc-alerta')
      )?.focus();
    } else if (estado.tipo === 'sucesso') {
      resultadoRef.current?.focus();
    }
  }, [estado]);

  if (estado.tipo === 'sucesso') {
    const primeiroNome = estado.nome.split(' ')[0];
    return (
      <div ref={resultadoRef} tabIndex={-1} role="status" className="srt-sucesso">
        <div className="srt-sucesso-icone" aria-hidden="true">
          🍀
        </div>
        <h2 className="srt-resultado-titulo">
          {estado.jaInscrito ? `${primeiroNome}, você já está participando!` : `Boa sorte, ${primeiroNome}!`}
        </h2>
        <p className="srt-card-texto">
          {estado.jaInscrito
            ? 'Este e-mail já estava inscrito, então nada foi duplicado.'
            : 'Sua inscrição no sorteio está confirmada.'}{' '}
          Fique de olho no telão: se o seu nome aparecer, é só se apresentar à organização.
        </p>
      </div>
    );
  }

  const erro = estado.tipo === 'erro' ? estado : null;
  const campo = (
    nome: 'nome' | 'email' | 'whatsapp',
    rotulo: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div className="insc-campo">
      <label htmlFor={`s-${nome}`} className="insc-rotulo">
        {rotulo}
      </label>
      <input
        id={`s-${nome}`}
        name={nome}
        required
        defaultValue={erro?.valores[nome] ?? ''}
        aria-invalid={erro?.campos[nome] ? true : undefined}
        aria-describedby={erro?.campos[nome] ? `s-${nome}-erro` : undefined}
        className="insc-input"
        {...props}
      />
      {erro?.campos[nome] && (
        <p id={`s-${nome}-erro`} className="insc-erro">
          {erro.campos[nome]}
        </p>
      )}
    </div>
  );

  return (
    // `key`: remonta com os valores devolvidos depois de um erro (o React 19
    // limpa formulários com `action` ao fim de cada envio).
    <form key={erro?.envio ?? 0} ref={formRef} action={acao} className="insc-form" noValidate>
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
      {campo('nome', 'Nome completo', { autoComplete: 'name', maxLength: 120 })}
      {campo('email', 'E-mail', { type: 'email', autoComplete: 'email', maxLength: 254 })}
      {campo('whatsapp', 'WhatsApp', {
        type: 'tel',
        inputMode: 'tel',
        autoComplete: 'tel',
        maxLength: 20,
        placeholder: '(83) 99999-0000',
      })}
      <button type="submit" className="insc-enviar srt-enviar" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Quero participar →'}
      </button>
      <p className="insc-ajuda insc-lgpd">Seus dados são usados só para este sorteio (LGPD).</p>
    </form>
  );
}
