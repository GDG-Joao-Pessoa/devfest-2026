// TEMPORÁRIO — diagnóstico do preview da PR #4. Remover antes do merge.
export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  const out: Record<string, unknown> = {
    temUrl: Boolean(url),
    temChave: Boolean(key),
    prefixoChave: key?.slice(0, 15),
  };
  if (url && key) {
    for (const [nome, init] of [
      ['com_cache_e_timeout', { cache: 'no-store', signal: AbortSignal.timeout(10_000) }],
      ['simples', {}],
    ] as const) {
      try {
        const res = await fetch(`${url}/rest/v1/rpc/situacao_atividade`, {
          method: 'POST',
          headers: { apikey: key, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_atividade: 'workshop-adk' }),
          ...init,
        });
        out[nome] = { status: res.status, corpo: (await res.text()).slice(0, 300) };
      } catch (e) {
        out[nome] = { erro: String(e) };
      }
    }
  }
  return Response.json(out);
}
