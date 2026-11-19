import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InscricaoPagina from '@/components/InscricaoPagina';
import { atividadePorRota } from '@/lib/inscricoes';

// Vagas restantes vêm do Supabase a cada acesso.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ atividade: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const atividade = atividadePorRota((await params).atividade);
  if (!atividade) return {};
  return {
    title: `Inscrição: ${atividade.titulo} — DevFest João Pessoa 2026`,
    description: atividade.resumo,
    alternates: { canonical: `/inscricoes/${atividade.rota}` },
  };
}

export default async function Page({ params }: Props) {
  const atividade = atividadePorRota((await params).atividade);
  if (!atividade) notFound();
  return <InscricaoPagina atividade={atividade} />;
}
