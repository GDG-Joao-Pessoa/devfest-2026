// TEMPORÁRIO — diagnóstico do preview da PR #4. Remover antes do merge.
export const dynamic = 'force-dynamic';

export async function GET() {
  const { getCloudflareContext } = await import('@opennextjs/cloudflare');
  let cfEnv: Record<string, unknown> = {};
  let cfErro: string | undefined;
  try {
    cfEnv = (await getCloudflareContext({ async: true })).env as Record<string, unknown>;
  } catch (e) {
    cfErro = String(e);
  }
  const url = process.env.SUPABASE_URL ?? (cfEnv.SUPABASE_URL as string | undefined);
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? (cfEnv.SUPABASE_PUBLISHABLE_KEY as string | undefined);
  const out: Record<string, unknown> = {
    processEnvUrl: Boolean(process.env.SUPABASE_URL),
    cfEnvChaves: Object.keys(cfEnv),
    cfErro,
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
