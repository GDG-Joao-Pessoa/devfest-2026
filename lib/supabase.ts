// ---------------------------------------------------------------------------
// Chamadas às funções do Supabase (PostgREST /rest/v1/rpc), só no servidor.
//
// Usa a chave publishable: as tabelas têm RLS fechado e essa chave só
// consegue executar `inscrever` e `situacao_atividade`
// (supabase/migrations). Ela é pública por design, por isso o projeto de
// produção fica aqui no código: no Worker da Cloudflare as `vars` do
// wrangler.jsonc não chegam ao runtime (testado no preview da PR #4).
// NUNCA coloque aqui a secret / service_role key.
//
// SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY no ambiente (ex.: .env.local)
// substituem os valores abaixo, para apontar para outro projeto em dev/teste.
// ---------------------------------------------------------------------------

const PRODUCAO = {
  url: 'https://yqkfkarhhhcafuneweoa.supabase.co',
  chave: 'sb_publishable_hsqZTiUPRCUUQxULVG8l4w_is7Q1Cje',
};

export type RespostaRpc<T> = { ok: true; data: T } | { ok: false; erro: string };

export async function rpc<T>(funcao: string, args: Record<string, unknown>): Promise<RespostaRpc<T>> {
  const url = process.env.SUPABASE_URL || PRODUCAO.url;
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY || PRODUCAO.chave;

  const headers: Record<string, string> = {
    apikey: chave,
    'Content-Type': 'application/json',
  };
  // A anon key legada é um JWT e também vai no Authorization; as chaves novas
  // (sb_publishable_...) não são JWT e só podem ir no `apikey`.
  if (chave.startsWith('eyJ')) headers.Authorization = `Bearer ${chave}`;

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/${funcao}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(args),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      // Erros levantados nas funções (raise exception 'x') chegam em `message`.
      const erro = typeof body?.message === 'string' ? body.message : `http_${res.status}`;
      if (!erro.startsWith('inscricoes_') && !erro.startsWith('atividade_')) {
        console.error(`[supabase] ${funcao} falhou`, res.status, body);
      }
      return { ok: false, erro };
    }
    return { ok: true, data: body as T };
  } catch (e) {
    console.error(`[supabase] ${funcao} falhou`, e);
    return { ok: false, erro: 'rede' };
  }
}
