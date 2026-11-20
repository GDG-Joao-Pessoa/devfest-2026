'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import gdgLogo from '@/public/assets/gdg-jp-logo-white.png';
import devfestLogo from '@/public/assets/devfest-2026-w3.png';
import {
  definirInscricoesSorteio,
  marcarAusente,
  painelSorteio,
  sortear,
} from '@/app/sorteio/actions';
import type { EstadoSorteio, Ganhador } from '@/lib/sorteio';

type Props = { qrSvg: string; urlInscricao: string; quando: string };
type Sorteado = Pick<Ganhador, 'id' | 'nome' | 'final'>;
type Fase = 'pronto' | 'girando' | 'revelado';

const CORES = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];
const CHAVE_SENHA = 'devfest-sorteio-senha';

const lerSenha = () => {
  try {
    return sessionStorage.getItem(CHAVE_SENHA);
  } catch {
    return null;
  }
};
const salvarSenha = (s: string | null) => {
  try {
    if (s) sessionStorage.setItem(CHAVE_SENHA, s);
    else sessionStorage.removeItem(CHAVE_SENHA);
  } catch {
    /* sem storage: a senha vale só enquanto a página estiver aberta */
  }
};
const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Telao({ qrSvg, urlInscricao, quando }: Props) {
  const [senha, setSenha] = useState<string | null>(null);
  const [estado, setEstado] = useState<EstadoSorteio | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [fase, setFase] = useState<Fase>('pronto');
  const [rolando, setRolando] = useState({ nome: '', cor: 0 });
  const [ganhador, setGanhador] = useState<Sorteado | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const confeteRef = useRef<HTMLCanvasElement>(null);
  const faseRef = useRef<Fase>('pronto');
  faseRef.current = fase;

  const entrar = useCallback(async (tentativa: string) => {
    setVerificando(true);
    setErro(null);
    const res = await painelSorteio(tentativa);
    setVerificando(false);
    if (!res.ok) {
      setErro(res.erro);
      salvarSenha(null);
      return;
    }
    salvarSenha(tentativa);
    setSenha(tentativa);
    setEstado(res.data);
  }, []);

  // Recupera a senha da aba (ex.: recarregou a página).
  useEffect(() => {
    const s = lerSenha();
    if (s) void entrar(s);
  }, [entrar]);

  // Atualiza a contagem de participantes a cada 5 s (fora da animação).
  useEffect(() => {
    if (!senha) return;
    const id = setInterval(async () => {
      if (faseRef.current === 'girando') return;
      const res = await painelSorteio(senha);
      if (res.ok) setEstado(res.data);
    }, 5000);
    return () => clearInterval(id);
  }, [senha]);

  const sair = () => {
    salvarSenha(null);
    setSenha(null);
    setEstado(null);
    setGanhador(null);
    setFase('pronto');
  };

  const alternarInscricoes = async () => {
    if (!senha || !estado) return;
    setOcupado(true);
    const res = await definirInscricoesSorteio(senha, !estado.aberto);
    setOcupado(false);
    if (res.ok) setEstado(res.data);
    else setErro(res.erro);
  };

  const rodarSorteio = async (ausenteAnterior?: string) => {
    if (!senha || !estado || fase === 'girando') return;
    setErro(null);
    setGanhador(null);
    setFase('girando');

    if (ausenteAnterior) await marcarAusente(senha, ausenteAnterior, true);
    // O resultado sai do banco já no início; a animação só dá o suspense.
    const resultado = sortear(senha);

    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nomes = estado.nomes.length > 0 ? estado.nomes : ['…'];
    if (!reduzir) {
      const passos = 38;
      for (let i = 0; i < passos; i++) {
        setRolando({ nome: nomes[Math.floor(Math.random() * nomes.length)], cor: i % CORES.length });
        await esperar(45 + Math.pow(i / passos, 3) * 420);
      }
    }

    const res = await resultado;
    if (!res.ok) {
      setErro(res.erro);
      setFase('pronto');
      const atual = await painelSorteio(senha);
      if (atual.ok) setEstado(atual.data);
      return;
    }
    setGanhador(res.data.ganhador);
    setEstado(res.data.estado);
    setFase('revelado');
    if (!reduzir && confeteRef.current) soltarConfete(confeteRef.current);
  };

  const alternarAusente = async (g: Ganhador) => {
    if (!senha) return;
    const res = await marcarAusente(senha, g.id, !g.ausente);
    if (res.ok) setEstado(res.data);
  };

  const telaCheia = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  };

  // ------------------------------------------------------------------ login
  if (!senha || !estado) {
    return (
      <main className="srt-pagina srt-telao-login">
        <Blobs />
        <form
          className="srt-card srt-login"
          onSubmit={(e) => {
            e.preventDefault();
            const s = new FormData(e.currentTarget).get('senha');
            if (typeof s === 'string' && s) void entrar(s);
          }}
        >
          <Image src={devfestLogo} alt="DevFest 2026" className="srt-logo-devfest" priority />
          <h1 className="srt-resultado-titulo">Telão do sorteio</h1>
          <p className="srt-card-texto">Área da organização. Digite a senha para abrir o sorteio.</p>
          <label htmlFor="srt-senha" className="insc-rotulo">
            Senha
          </label>
          <input
            id="srt-senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            className="insc-input"
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? 'srt-senha-erro' : undefined}
          />
          {erro && (
            <p id="srt-senha-erro" className="insc-erro" role="alert">
              {erro}
            </p>
          )}
          <button type="submit" className="insc-enviar srt-enviar" disabled={verificando}>
            {verificando ? 'Verificando…' : 'Entrar →'}
          </button>
        </form>
      </main>
    );
  }

  // ------------------------------------------------------------------ telão
  const presentes = estado.ganhadores.filter((g) => !g.ausente);

  return (
    <main className="srt-pagina srt-telao">
      <Blobs />
      <canvas ref={confeteRef} className="srt-confete" aria-hidden="true" />

      <header className="srt-telao-topo">
        <div className="srt-telao-marcas">
          <Image src={gdgLogo} alt="GDG João Pessoa" className="srt-logo-gdg" priority />
          <span className="srt-divisor" aria-hidden="true" />
          <Image src={devfestLogo} alt="DevFest 2026" className="srt-telao-devfest" priority />
        </div>
        <div className="srt-pill">
          <span className="srt-pill-ponto" aria-hidden="true" />
          {quando}
        </div>
      </header>

      <div className="srt-telao-corpo">
        <aside className={estado.aberto ? 'srt-qr' : 'srt-qr srt-qr--fechado'}>
          <div className="srt-qr-codigo" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <div className="srt-qr-texto">
            {estado.aberto ? (
              <>
                <strong>Aponte a câmera e participe!</strong>
                {/* quebra de linha só antes do caminho ("…com.br" / "/sorteio") */}
                <span>
                  {urlInscricao.slice(0, urlInscricao.lastIndexOf('/'))}
                  <wbr />
                  {urlInscricao.slice(urlInscricao.lastIndexOf('/'))}
                </span>
              </>
            ) : (
              <strong>Inscrições encerradas</strong>
            )}
          </div>
        </aside>

        <section className="srt-palco" aria-live="polite">
          <h1 className="srt-telao-titulo">
            Sorteio <span className="srt-gradiente">do 1º dia</span>
          </h1>
          <div className="srt-contador">
            <span className="srt-contador-numero">{estado.total}</span>
            <span className="srt-contador-rotulo">
              {estado.total === 1 ? 'participante' : 'participantes'}
            </span>
          </div>

          <div className={`srt-roleta srt-roleta--${fase}`}>
            {fase === 'girando' && (
              <span className="srt-roleta-nome" style={{ color: CORES[rolando.cor] }}>
                {rolando.nome}
              </span>
            )}
            {fase === 'revelado' && ganhador && (
              <div className="srt-ganhador">
                <span className="srt-ganhador-rotulo">🎉 E o prêmio vai para…</span>
                <span className="srt-ganhador-nome">{ganhador.nome}</span>
                <span className="srt-ganhador-final">WhatsApp final {ganhador.final}</span>
              </div>
            )}
            {fase === 'pronto' && (
              <span className="srt-roleta-espera">
                {estado.disponiveis > 0 ? 'Quem será?' : 'Ninguém para sortear ainda'}
              </span>
            )}
          </div>

          {erro && (
            <p className="insc-alerta srt-erro" role="alert">
              {erro}
            </p>
          )}

          <div className="srt-acoes">
            <button
              type="button"
              className="srt-sortear"
              onClick={() => void rodarSorteio()}
              disabled={fase === 'girando' || estado.disponiveis === 0}
            >
              {fase === 'girando' ? 'Sorteando…' : fase === 'revelado' ? 'Sortear outro →' : 'Sortear →'}
            </button>
            {fase === 'revelado' && ganhador && (
              <button
                type="button"
                className="srt-secundario"
                onClick={() => void rodarSorteio(ganhador.id)}
                disabled={estado.disponiveis === 0}
              >
                Ausente? Sortear de novo
              </button>
            )}
          </div>
        </section>
      </div>

      {estado.ganhadores.length > 0 && (
        <section className="srt-ganhadores" aria-label="Ganhadores">
          <h2>Ganhadores · {presentes.length}</h2>
          <ol>
            {estado.ganhadores.map((g, i) => (
              <li key={g.id} className={g.ausente ? 'srt-chip srt-chip--ausente' : 'srt-chip'}>
                <span className="srt-chip-n" style={{ background: CORES[i % CORES.length] }}>
                  {i + 1}
                </span>
                <span className="srt-chip-nome">{g.nome}</span>
                <span className="srt-chip-final">•{g.final}</span>
                <button
                  type="button"
                  className="srt-chip-acao"
                  onClick={() => void alternarAusente(g)}
                  title={g.ausente ? 'Desfazer ausência' : 'Marcar como ausente'}
                >
                  {g.ausente ? 'ausente ↺' : 'ausente?'}
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      <footer className="srt-controles">
        <button type="button" onClick={() => void alternarInscricoes()} disabled={ocupado}>
          {estado.aberto ? '⏹ Encerrar inscrições' : '▶ Reabrir inscrições'}
        </button>
        <button type="button" onClick={telaCheia}>
          ⛶ Tela cheia
        </button>
        <button type="button" onClick={sair}>
          Sair
        </button>
      </footer>
    </main>
  );
}

function Blobs() {
  return (
    <div className="srt-blobs" aria-hidden="true">
      <span className="srt-blob srt-blob--azul" />
      <span className="srt-blob srt-blob--vermelho" />
      <span className="srt-blob srt-blob--amarelo" />
      <span className="srt-blob srt-blob--verde" />
    </div>
  );
}

/** Confete nas 4 cores do Google, desenhado num canvas por ~4 s. */
function soltarConfete(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = (canvas.width = window.innerWidth * dpr);
  const h = (canvas.height = window.innerHeight * dpr);
  const pecas = Array.from({ length: 220 }, () => ({
    x: w / 2 + (Math.random() - 0.5) * w * 0.3,
    y: h * 0.45,
    vx: (Math.random() - 0.5) * 26 * dpr,
    vy: (-Math.random() * 26 - 8) * dpr,
    giro: Math.random() * Math.PI,
    vGiro: (Math.random() - 0.5) * 0.3,
    tam: (6 + Math.random() * 9) * dpr,
    cor: CORES[Math.floor(Math.random() * CORES.length)],
    forma: Math.random() < 0.5 ? 0 : 1,
  }));
  const inicio = performance.now();
  const quadro = (t: number) => {
    const dt = t - inicio;
    ctx.clearRect(0, 0, w, h);
    for (const p of pecas) {
      p.vy += 0.55 * dpr;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.giro += p.vGiro;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - dt / 4200);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.fillStyle = p.cor;
      if (p.forma === 0) ctx.fillRect(-p.tam / 2, -p.tam / 4, p.tam, p.tam / 2);
      else {
        ctx.beginPath();
        ctx.arc(0, 0, p.tam / 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (dt < 4200) requestAnimationFrame(quadro);
    else ctx.clearRect(0, 0, w, h);
  };
  requestAnimationFrame(quadro);
}
