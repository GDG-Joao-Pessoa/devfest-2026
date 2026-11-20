import type { Metadata } from 'next';
import QRCode from 'qrcode';
import Telao from '@/components/sorteio/Telao';
import { SORTEIO, URL_INSCRICAO_SORTEIO } from '@/lib/sorteio';

export const metadata: Metadata = {
  title: `Telão · ${SORTEIO.titulo} — DevFest João Pessoa 2026`,
  robots: { index: false, follow: false },
};

/**
 * Tela do sorteio, para projetar. Estática: o QR Code é gerado no build e
 * todo o resto (senha, participantes, sorteio) acontece no navegador via
 * Server Actions (app/sorteio/actions.ts).
 */
export default async function TelaoPage() {
  const qrSvg = await QRCode.toString(URL_INSCRICAO_SORTEIO, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#08080f', light: '#ffffff' },
  });
  return (
    <Telao
      qrSvg={qrSvg}
      urlInscricao={URL_INSCRICAO_SORTEIO.replace(/^https:\/\//, '')}
      quando={SORTEIO.quando}
    />
  );
}
