-- ---------------------------------------------------------------------------
-- Inscrições das atividades com vagas limitadas do DevFest JP 2026
-- (Code in the Dark e Workshop de Google ADK).
--
-- Modelo de acesso:
-- - As tabelas ficam com RLS ligado e SEM políticas: nem `anon` nem
--   `authenticated` leem ou escrevem nelas diretamente.
-- - O site só chama duas funções (security definer):
--     public.inscrever(...)          → cria a inscrição (ou devolve a existente)
--     public.situacao_atividade(...) → vagas restantes / se está aberta
--   Assim, mesmo com a chave anon/publishable, ninguém lista os inscritos.
-- - A organização lê e edita tudo pelo painel do Supabase (role postgres).
--
-- Vagas e lista de espera: `inscrever` trava a linha da atividade
-- (SELECT ... FOR UPDATE), então duas inscrições simultâneas nunca passam do
-- limite. Com as vagas cheias, a pessoa entra na lista de espera; com a lista
-- de espera cheia (quando ela tem limite), a inscrição é recusada.
-- ---------------------------------------------------------------------------

create table public.atividades (
  slug               text primary key,
  nome               text not null,
  vagas              integer not null check (vagas >= 0),
  -- Tamanho máximo da lista de espera. NULL = sem limite.
  vagas_espera       integer check (vagas_espera >= 0),
  inscricoes_abertas boolean not null default true,
  -- Fecha as inscrições automaticamente a partir deste instante (opcional).
  encerra_em         timestamptz,
  atualizado_em      timestamptz not null default now()
);

comment on table public.atividades is
  'Atividades com inscrição. Edite `vagas`, `vagas_espera`, `inscricoes_abertas` e `encerra_em` pelo painel: o site lê na hora.';

-- Inscrições fecham no início de cada atividade.
insert into public.atividades (slug, nome, vagas, vagas_espera, encerra_em) values
  ('code-in-the-dark', 'Code in the Dark', 9, 9, '2026-11-21 17:00:00-03'),
  ('workshop-adk',
   'Workshop: assistente de revisão de código com IA usando o Google ADK',
   40, null, '2026-11-20 14:00:00-03');

create table public.inscricoes (
  id               uuid primary key default gen_random_uuid(),
  atividade        text not null references public.atividades (slug),
  nome             text not null check (char_length(nome) between 2 and 120),
  email            text not null check (
                     email = lower(email)
                     and char_length(email) <= 254
                     and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
                   ),
  whatsapp         text not null check (whatsapp ~ '^\d{10,13}$'),
  -- Respostas específicas de cada atividade (ver lib/inscricoes.ts).
  respostas        jsonb not null default '{}' check (jsonb_typeof(respostas) = 'object'),
  status           text not null default 'confirmada'
                     check (status in ('confirmada', 'lista_espera', 'cancelada')),
  consentimento_em timestamptz not null default now(),
  criado_em        timestamptz not null default now()
);

comment on column public.inscricoes.status is
  'confirmada | lista_espera | cancelada. Para liberar uma vaga: marque a inscrição como cancelada e promova a próxima da lista de espera para confirmada.';

-- Uma inscrição ativa por e-mail em cada atividade.
create unique index inscricoes_atividade_email_ativa
  on public.inscricoes (atividade, email)
  where status <> 'cancelada';

create index inscricoes_atividade_status_criado
  on public.inscricoes (atividade, status, criado_em);

alter table public.atividades enable row level security;
alter table public.inscricoes enable row level security;

revoke all on public.atividades, public.inscricoes from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Funções expostas ao site
-- ---------------------------------------------------------------------------

-- Posição na lista de espera (1 = próxima a ser chamada). NULL se não estiver nela.
create function public.posicao_lista_espera(p_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select nullif(count(*), 0)::integer
  from public.inscricoes outra
  join public.inscricoes minha on minha.id = p_id
  where minha.status = 'lista_espera'
    and outra.atividade = minha.atividade
    and outra.status = 'lista_espera'
    and outra.criado_em <= minha.criado_em;
$$;

create function public.situacao_atividade(p_atividade text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'vagas', a.vagas,
    'confirmadas', (
      select count(*) from public.inscricoes i
      where i.atividade = a.slug and i.status = 'confirmada'
    ),
    'vagas_espera', a.vagas_espera,
    'em_espera', (
      select count(*) from public.inscricoes i
      where i.atividade = a.slug and i.status = 'lista_espera'
    ),
    'abertas', a.inscricoes_abertas and (a.encerra_em is null or now() < a.encerra_em)
  )
  from public.atividades a
  where a.slug = p_atividade;
$$;

-- Retorna {"status": "confirmada" | "lista_espera", "posicao": int | null, "ja_inscrito": bool}.
-- Erros (campo `message` da resposta do PostgREST):
--   atividade_inexistente | inscricoes_encerradas | vagas_esgotadas
create function public.inscrever(
  p_atividade text,
  p_nome      text,
  p_email     text,
  p_whatsapp  text,
  p_respostas jsonb default '{}'
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_atividade   public.atividades%rowtype;
  v_email       text := lower(btrim(p_email));
  v_id          uuid;
  v_status      text;
  v_confirmadas integer;
begin
  -- Trava a atividade: serializa as inscrições dela e evita estourar as vagas.
  select * into v_atividade
  from public.atividades
  where slug = p_atividade
  for update;

  if not found then
    raise exception 'atividade_inexistente' using errcode = 'P0002';
  end if;

  if not v_atividade.inscricoes_abertas
     or (v_atividade.encerra_em is not null and now() >= v_atividade.encerra_em) then
    raise exception 'inscricoes_encerradas' using errcode = 'P0001';
  end if;

  -- Já inscrita? Devolve a inscrição existente em vez de duplicar.
  select i.id, i.status into v_id, v_status
  from public.inscricoes i
  where i.atividade = p_atividade
    and i.email = v_email
    and i.status <> 'cancelada';

  if found then
    return jsonb_build_object(
      'status', v_status,
      'posicao', public.posicao_lista_espera(v_id),
      'ja_inscrito', true
    );
  end if;

  select count(*) into v_confirmadas
  from public.inscricoes i
  where i.atividade = p_atividade and i.status = 'confirmada';

  v_status := case when v_confirmadas < v_atividade.vagas then 'confirmada' else 'lista_espera' end;

  -- Lista de espera com limite e já cheia: recusa.
  if v_status = 'lista_espera' and v_atividade.vagas_espera is not null
     and (select count(*) from public.inscricoes i
          where i.atividade = p_atividade and i.status = 'lista_espera') >= v_atividade.vagas_espera then
    raise exception 'vagas_esgotadas' using errcode = 'P0001';
  end if;

  insert into public.inscricoes (atividade, nome, email, whatsapp, respostas, status)
  values (p_atividade, btrim(p_nome), v_email, p_whatsapp, coalesce(p_respostas, '{}'), v_status)
  returning id into v_id;

  return jsonb_build_object(
    'status', v_status,
    'posicao', public.posicao_lista_espera(v_id),
    'ja_inscrito', false
  );
end;
$$;

revoke execute on function public.posicao_lista_espera(uuid) from public, anon, authenticated;
revoke execute on function public.situacao_atividade(text) from public;
revoke execute on function public.inscrever(text, text, text, text, jsonb) from public;
grant execute on function public.situacao_atividade(text) to anon, authenticated, service_role;
grant execute on function public.inscrever(text, text, text, text, jsonb) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Views para a organização (painel / export CSV). security_invoker: respeitam
-- o RLS de quem consulta, então continuam fechadas para anon/authenticated.
-- ---------------------------------------------------------------------------

create view public.inscricoes_code_in_the_dark
with (security_invoker = true) as
select
  i.criado_em,
  i.status,
  public.posicao_lista_espera(i.id) as posicao_espera,
  i.nome,
  i.email,
  i.whatsapp,
  i.respostas ->> 'github'              as github,
  i.respostas ->> 'experiencia'         as experiencia_html_css,
  (i.respostas ->> 'ja_participou')::boolean as ja_participou,
  i.id
from public.inscricoes i
where i.atividade = 'code-in-the-dark'
order by case i.status when 'confirmada' then 0 when 'lista_espera' then 1 else 2 end, i.criado_em;

create view public.inscricoes_workshop_adk
with (security_invoker = true) as
select
  i.criado_em,
  i.status,
  public.posicao_lista_espera(i.id) as posicao_espera,
  i.nome,
  i.email,
  i.whatsapp,
  i.respostas ->> 'empresa'        as empresa,
  i.respostas ->> 'area'           as area,
  i.respostas ->> 'nivel_python'   as nivel_python,
  (i.respostas ->> 'leva_notebook')::boolean as leva_notebook,
  i.id
from public.inscricoes i
where i.atividade = 'workshop-adk'
order by case i.status when 'confirmada' then 0 when 'lista_espera' then 1 else 2 end, i.criado_em;

revoke all on public.inscricoes_code_in_the_dark, public.inscricoes_workshop_adk
  from anon, authenticated;
