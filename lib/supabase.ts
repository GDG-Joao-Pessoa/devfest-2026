// ---------------------------------------------------------------------------
// Chamadas às funções do Supabase (PostgREST /rest/v1/rpc), só no servidor.
//
// Usa a chave publishable (ou a anon legada): as tabelas têm RLS fechado e
// essa chave só consegue executar `inscrever` e `situacao_atividade`.
// Mesmo assim a chave fica fora do bundle do navegador (sem NEXT_PUBLIC_).
//
// Variáveis (ver .env.example):
//   SUPABASE_URL              https://<projeto>.supabase.co
//   SUPABASE_PUBLISHABLE_KEY  sb_publishable_... (ou a anon key legada, eyJ...)
// ---------------------------------------------------------------------------

export type RespostaRpc<T> = { ok: true; data: T } | { ok: false; erro: string };

export function supabaseConfigurado() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

export async function rpc<T>(funcao: string, args: Record<string, unknown>): Promise<RespostaRpc<T>> {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) return { ok: false, erro: 'nao_configurado' };

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
