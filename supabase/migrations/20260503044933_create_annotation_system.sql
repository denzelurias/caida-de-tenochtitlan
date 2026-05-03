create extension if not exists "pgcrypto";

create table if not exists public.annotation_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.annotations (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.annotation_pages(id) on delete cascade,
  anchor_id text not null,
  section_id text not null,
  section_title text not null,
  anchor_text text,
  context_type text,
  context_key text,
  x_ratio numeric(6,5) not null check (x_ratio >= 0 and x_ratio <= 1),
  y_ratio numeric(6,5) not null check (y_ratio >= 0 and y_ratio <= 1),
  viewport_width integer,
  viewport_height integer,
  author_id uuid,
  author_name text not null check (char_length(author_name) between 1 and 40),
  body text not null check (char_length(body) between 3 and 500),
  intent text check (intent in ('Pregunta', 'Observacion', 'Dato relacionado', 'Interpretacion', 'Correccion')),
  status text not null default 'visible' check (status in ('visible', 'pending', 'hidden', 'deleted')),
  edit_token_hash text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists annotations_page_status_created_idx
  on public.annotations (page_id, status, created_at desc);

create index if not exists annotations_anchor_idx
  on public.annotations (page_id, anchor_id);

create index if not exists annotations_section_idx
  on public.annotations (page_id, section_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists annotations_set_updated_at on public.annotations;
create trigger annotations_set_updated_at
before update on public.annotations
for each row
execute function public.set_updated_at();

alter table public.annotation_pages enable row level security;
alter table public.annotations enable row level security;

drop policy if exists "public can read annotation pages" on public.annotation_pages;
create policy "public can read annotation pages"
on public.annotation_pages
for select
to anon, authenticated
using (true);

drop policy if exists "public can read visible annotations" on public.annotations;
create policy "public can read visible annotations"
on public.annotations
for select
to anon, authenticated
using (status = 'visible');

revoke all on public.annotation_pages from anon, authenticated;
revoke all on public.annotations from anon, authenticated;

grant select on public.annotation_pages to anon, authenticated;
grant select (
  id,
  page_id,
  anchor_id,
  section_id,
  section_title,
  anchor_text,
  context_type,
  context_key,
  x_ratio,
  y_ratio,
  viewport_width,
  viewport_height,
  author_name,
  body,
  intent,
  status,
  created_at,
  updated_at
) on public.annotations to anon, authenticated;

insert into public.annotation_pages (slug, title)
values ('caida-tenochtitlan', 'Tenochtitlan: la ciudad que cayó de pie')
on conflict (slug) do nothing;
