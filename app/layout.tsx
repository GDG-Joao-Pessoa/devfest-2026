import type { Metadata, Viewport } from 'next';
import { Sora, Figtree, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-figtree',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://devfest-jp.dev'),
  title: 'DevFest João Pessoa 2026 — 20 & 21 Nov · Uniesp',
  description:
    'O maior evento de tecnologia do GDG João Pessoa. Dois dias de palestras, código ao vivo e comunidade — 20 e 21 de novembro de 2026, no Uniesp Centro Universitário.',
  keywords: [
    'DevFest',
    'GDG João Pessoa',
    'Google Developer Groups',
    'tecnologia',
    'Paraíba',
    'evento dev',
  ],
  openGraph: {
    title: 'DevFest João Pessoa 2026',
    description:
      'A comunidade de tecnologia e inovação se encontra aqui. 20 & 21 Nov · Uniesp Centro Universitário · João Pessoa · PB.',
    url: 'https://devfest-jp.dev',
    siteName: 'DevFest João Pessoa 2026',
    locale: 'pt_BR',
    type: 'website',
    images: ['/banner/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevFest João Pessoa 2026',
    description:
      'A comunidade de tecnologia e inovação se encontra aqui. 20 & 21 Nov · Uniesp · João Pessoa · PB.',
    images: ['/banner/opengraph-image'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Pinta a barra do navegador no mobile com o fundo do site.
  themeColor: '#08080f',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${figtree.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
