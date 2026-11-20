-- ---------------------------------------------------------------------------
-- Sorteio do DevFest JP 2026: inscrição pública (/sorteio) e telão protegido
-- por senha (/sorteio/telao).
--
-- Mesmo modelo das inscrições: tabelas com RLS ligado e sem políticas; o site
-- só chama funções security definer. As funções do telão exigem a senha da
-- organização, guardada como hash bcrypt (pgcrypto) — nunca no código.
--
-- O sorteio acontece AQUI no banco (`order by random()`), então ninguém
-- consegue escolher o ganhador pelo navegador. Quem já foi sorteado não entra
-- de novo (mesmo marcado como ausente).
--
-- Depois de rodar este arquivo, defina a senha do telão no SQL Editor:
--   update public.sorteio_config
--      set senha_hash = extensions.crypt('SUA-SENHA-FORTE', extensions.gen_salt('bf'))
--    where id = 1;
-- ---------------------------------------------------------------------------

create extension if not exists pgcrypto with schema extensions;

create table public.sorteios (
  slug               text primary key,
  nome               text not null,
  inscricoes_abertas boolean not null default true,
  criado_em          timestamptz not null default now()
);

insert into public.sorteios (slug, nome) values ('dia-1', 'Sorteio do 1º dia');

create table public.sorteio_config (
  id         integer primary key default 1 check (id = 1),
  -- bcrypt da senha do telão (ver o comentário no topo).
  senha_hash text
);

insert into public.sorteio_config (id) values (1);

create table public.sorteio_participantes (
  id        uuid primary key default gen_random_uuid(),
  sorteio   text not null references public.sorteios (slug),
  nome      text not null check (char_length(nome) between 2 and 120),
  email     text not null check (
              email = lower(email)
              and char_length(email) <= 254
              and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
            ),
  whatsapp  text not null check (whatsapp ~ '^\d{10,13}$'),
  criado_em timestamptz not null default now(),
  unique (sorteio, email)
);

create table public.sorteio_ganhadores (
  id           uuid primary key default gen_random_uuid(),
  sorteio      text not null references public.sorteios (slug),
  participante uuid not null unique references public.sorteio_participantes (id),
  -- Não estava presente: fica registrado, e o telão sorteia de novo.
  ausente      boolean not null default false,
  sorteado_em  timestamptz not null default now()
);

alter table public.sorteios enable row level security;
alter table public.sorteio_config enable row level security;
alter table public.sorteio_participantes enable row level security;
alter table public.sorteio_ganhadores enable row level security;

revoke all on public.sorteios, public.sorteio_config, public.sorteio_participantes,
  public.sorteio_ganhadores from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Inscrição (pública)
-- ---------------------------------------------------------------------------

-- {"existe": bool, "aberto": bool}
create function public.sorteio_situacao(p_sorteio text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'existe', count(*) > 0,
    'aberto', coalesce(bool_or(s.inscricoes_abertas), false)
  )
  from public.sorteios s
  where s.slug = p_sorteio;
$$;

-- {"ja_inscrito": bool}. Erros: sorteio_inexistente | sorteio_encerrado
create function public.sorteio_inscrever(
  p_sorteio  text,
  p_nome     text,
  p_email    text,
  p_whatsapp text
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_aberto boolean;
  v_email  text := lower(btrim(p_email));
begin
  select s.inscricoes_abertas into v_aberto from public.sorteios s where s.slug = p_sorteio;
  if not found then
    raise exception 'sorteio_inexistente' using errcode = 'P0002';
  end if;
  if not v_aberto then
    raise exception 'sorteio_encerrado' using errcode = 'P0001';
  end if;

  insert into public.sorteio_participantes (sorteio, nome, email, whatsapp)
  values (p_sorteio, btrim(p_nome), v_email, p_whatsapp)
  on conflict (sorteio, email) do nothing;

  return jsonb_build_object('ja_inscrito', not found);
end;
$$;

-- ---------------------------------------------------------------------------
-- Telão (exigem a senha)
-- ---------------------------------------------------------------------------

-- Interna: confere a senha. Senha errada espera 1 s (freia tentativas em massa).
create function public.sorteio_checar_senha(p_senha text)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_hash text;
begin
  select c.senha_hash into v_hash from public.sorteio_config c where c.id = 1;
  if v_hash is null then
    raise exception 'senha_nao_definida' using errcode = 'P0001';
  end if;
  if p_senha is null or extensions.crypt(p_senha, v_hash) <> v_hash then
    perform pg_sleep(1);
    raise exception 'senha_invalida' using errcode = '28P01';
  end if;
end;
$$;

-- Estado do telão: aberto, total, ganhadores e uma amostra de nomes para a
-- animação. Nunca devolve e-mail; do WhatsApp, só os 4 últimos dígitos.
create function public.sorteio_estado(p_sorteio text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'aberto', s.inscricoes_abertas,
    'total', (select count(*) from public.sorteio_participantes p where p.sorteio = s.slug),
    'disponiveis', (
      select count(*) from public.sorteio_participantes p
      where p.sorteio = s.slug
        and not exists (select 1 from public.sorteio_ganhadores g where g.participante = p.id)
    ),
    'ganhadores', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', g.id,
               'nome', p.nome,
               'final', right(p.whatsapp, 4),
               'ausente', g.ausente,
               'sorteado_em', g.sorteado_em
             ) order by g.sorteado_em)
      from public.sorteio_ganhadores g
      join public.sorteio_participantes p on p.id = g.participante
      where g.sorteio = s.slug
    ), '[]'::jsonb),
    'nomes', coalesce((
      select jsonb_agg(n.nome)
      from (
        select p.nome from public.sorteio_participantes p
        where p.sorteio = s.slug
        order by random()
        limit 60
      ) n
    ), '[]'::jsonb)
  )
  from public.sorteios s
  where s.slug = p_sorteio;
$$;

create function public.sorteio_painel(p_senha text, p_sorteio text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  perform public.sorteio_checar_senha(p_senha);
  return public.sorteio_estado(p_sorteio);
end;
$$;

create function public.sorteio_definir_aberto(p_senha text, p_sorteio text, p_aberto boolean)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  perform public.sorteio_checar_senha(p_senha);
  update public.sorteios set inscricoes_abertas = p_aberto where slug = p_sorteio;
  return public.sorteio_estado(p_sorteio);
end;
$$;

-- Sorteia entre quem ainda não foi sorteado. Erro: sem_participantes
-- Retorna {"ganhador": {id, nome, final}, "estado": {...}}
create function public.sorteio_sortear(p_senha text, p_sorteio text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_participante public.sorteio_participantes%rowtype;
  v_ganhador     uuid;
begin
  perform public.sorteio_checar_senha(p_senha);

  -- Serializa sorteios simultâneos do mesmo sorteio (dois cliques, duas abas).
  perform 1 from public.sorteios where slug = p_sorteio for update;

  select p.* into v_participante
  from public.sorteio_participantes p
  where p.sorteio = p_sorteio
    and not exists (select 1 from public.sorteio_ganhadores g where g.participante = p.id)
  order by random()
  limit 1;

  if not found then
    raise exception 'sem_participantes' using errcode = 'P0001';
  end if;

  insert into public.sorteio_ganhadores (sorteio, participante)
  values (p_sorteio, v_participante.id)
  returning id into v_ganhador;

  return jsonb_build_object(
    'ganhador', jsonb_build_object(
      'id', v_ganhador,
      'nome', v_participante.nome,
      'final', right(v_participante.whatsapp, 4)
    ),
    'estado', public.sorteio_estado(p_sorteio)
  );
end;
$$;

create function public.sorteio_marcar_ausente(p_senha text, p_ganhador uuid, p_ausente boolean)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_sorteio text;
begin
  perform public.sorteio_checar_senha(p_senha);
  update public.sorteio_ganhadores set ausente = p_ausente
  where id = p_ganhador
  returning sorteio into v_sorteio;
  return public.sorteio_estado(v_sorteio);
end;
$$;

revoke execute on function
  public.sorteio_checar_senha(text),
  public.sorteio_estado(text)
from public, anon, authenticated;

revoke execute on function
  public.sorteio_situacao(text),
  public.sorteio_inscrever(text, text, text, text),
  public.sorteio_painel(text, text),
  public.sorteio_definir_aberto(text, text, boolean),
  public.sorteio_sortear(text, text),
  public.sorteio_marcar_ausente(text, uuid, boolean)
from public;

grant execute on function
  public.sorteio_situacao(text),
  public.sorteio_inscrever(text, text, text, text),
  public.sorteio_painel(text, text),
  public.sorteio_definir_aberto(text, text, boolean),
  public.sorteio_sortear(text, text),
  public.sorteio_marcar_ausente(text, uuid, boolean)
to anon, authenticated, service_role;

-- Lista para a organização (painel do Supabase / CSV).
create view public.sorteio_lista
with (security_invoker = true) as
select
  p.sorteio,
  p.criado_em,
  p.nome,
  p.email,
  p.whatsapp,
  g.sorteado_em,
  g.ausente
from public.sorteio_participantes p
left join public.sorteio_ganhadores g on g.participante = p.id
order by p.sorteio, g.sorteado_em nulls last, p.criado_em;

revoke all on public.sorteio_lista from anon, authenticated;
