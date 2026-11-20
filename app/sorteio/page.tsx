import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import gdgLogo from '@/public/assets/gdg-jp-logo-white.png';
import devfestLogo from '@/public/assets/devfest-2026-w3.png';
import SorteioForm from '@/components/sorteio/SorteioForm';
import { SORTEIO } from '@/lib/sorteio';
import { rpc } from '@/lib/supabase';

// Abertura/encerramento vem do Supabase a cada acesso (o telão encerra na hora).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${SORTEIO.titulo} — DevFest João Pessoa 2026`,
  description: 'Inscreva-se no sorteio do DevFest João Pessoa 2026.',
  // O link circula só pelo QR Code do telão.
  robots: { index: false, follow: false },
};

export default async function SorteioPage() {
  const res = await rpc<{ existe: boolean; aberto: boolean }>('sorteio_situacao', {
    p_sorteio: SORTEIO.slug,
  });
  // Se o banco não responder, mostra o formulário; o envio informa o erro.
  const aberto = res.ok ? res.data.aberto : true;

  return (
    <main className="srt-pagina">
      <div className="srt-blobs" aria-hidden="true">
        <span className="srt-blob srt-blob--azul" />
        <span className="srt-blob srt-blob--vermelho" />
        <span className="srt-blob srt-blob--amarelo" />
        <span className="srt-blob srt-blob--verde" />
      </div>

      <div className="srt-inscricao">
        <header className="srt-topo">
          <Image src={gdgLogo} alt="GDG João Pessoa" className="srt-logo-gdg" priority />
        </header>

        <Image src={devfestLogo} alt="DevFest 2026" className="srt-logo-devfest" priority />
        <div className="srt-cidade">João Pessoa</div>

        <div className="srt-pill">
          <span className="srt-pill-ponto" aria-hidden="true" />
          {SORTEIO.quando}
        </div>
        <h1 className="srt-titulo">
          Sorteio <span className="srt-gradiente">do 1º dia</span>
        </h1>

        <div className="srt-card">
          {aberto ? (
            <>
              <p className="srt-card-texto">
                Deixe seus dados e concorra. O sorteio acontece no telão do evento, e é preciso
                estar presente na hora.
              </p>
              <SorteioForm />
            </>
          ) : (
            <div className="srt-fechado">
              <h2 className="srt-resultado-titulo">Inscrições encerradas</h2>
              <p className="srt-card-texto">
                As inscrições para este sorteio já foram encerradas. Fique de olho no telão!
              </p>
            </div>
          )}
        </div>

        <Link href="/" className="srt-voltar">
          devfestjoaopessoa.gdgjoaopessoa.com.br
        </Link>
      </div>
    </main>
  );
}
