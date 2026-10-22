-- Hearthside's database foundation. Apply with the Supabase CLI or SQL editor.
-- Browser clients must not receive the service-role key used by the API server.

create extension if not exists pgcrypto;

create type public.member_role as enum ('owner', 'organizer', 'collaborator', 'restricted_helper', 'clinical');
create type public.event_category as enum ('medical', 'vitals', 'transport', 'errands', 'social');
create type public.note_category as enum ('medical', 'vitals', 'errands', 'social', 'critical');
create type public.document_category as enum ('insurance', 'legal', 'clinical', 'prescriptions', 'home_safety');

create table public.care_circles (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  timezone text not null default 'America/Los_Angeles',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.care_recipients (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null unique references public.care_circles(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 160),
  preferred_name text,
  date_of_birth date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- user_id stays nullable until Supabase Auth is introduced. Do not use this as authorization.
create table public.circle_members (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  user_id uuid unique,
  email text not null,
  display_name text not null,
  role public.member_role not null default 'collaborator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (circle_id, email)
);

create table public.care_events (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  starts_at timestamptz not null,
  ends_at timestamptz,
  category public.event_category not null,
  assignee_name text,
  location text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);
create index care_events_circle_starts_at_idx on public.care_events(circle_id, starts_at);

create table public.care_notes (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 10000),
  category public.note_category not null,
  is_critical boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index care_notes_circle_created_at_idx on public.care_notes(circle_id, created_at desc);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  filename text not null check (char_length(filename) between 1 and 255),
  storage_path text not null unique,
  content_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  category public.document_category not null,
  checksum_sha256 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index documents_circle_created_at_idx on public.documents(circle_id, created_at desc);

create table public.audit_events (
  id bigint generated always as identity primary key,
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  actor_member_id uuid references public.circle_members(id) on delete set null,
  action text not null check (char_length(action) between 1 and 120),
  resource_type text not null check (char_length(resource_type) between 1 and 120),
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_events_circle_created_at_idx on public.audit_events(circle_id, created_at desc);

-- Records metadata only; clinical content is never copied into the audit trail.
create or replace function public.audit_row_change()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    insert into public.audit_events (circle_id, action, resource_type, resource_id)
    values (old.circle_id, lower(tg_op), tg_table_name, old.id);
    return old;
  end if;

  insert into public.audit_events (circle_id, action, resource_type, resource_id)
  values (new.circle_id, lower(tg_op), tg_table_name, new.id);
  return new;
end;
$$;

create trigger care_events_audit after insert or update or delete on public.care_events
  for each row execute function public.audit_row_change();
create trigger care_notes_audit after insert or update or delete on public.care_notes
  for each row execute function public.audit_row_change();
create trigger documents_audit after insert or update or delete on public.documents
  for each row execute function public.audit_row_change();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger care_circles_updated_at before update on public.care_circles for each row execute function public.set_updated_at();
create trigger care_recipients_updated_at before update on public.care_recipients for each row execute function public.set_updated_at();
create trigger circle_members_updated_at before update on public.circle_members for each row execute function public.set_updated_at();
create trigger care_events_updated_at before update on public.care_events for each row execute function public.set_updated_at();
create trigger care_notes_updated_at before update on public.care_notes for each row execute function public.set_updated_at();
create trigger documents_updated_at before update on public.documents for each row execute function public.set_updated_at();

-- RLS is enabled now and has no client policies. The server uses a service-role key;
-- member-specific policies are added only when authentication is implemented.
alter table public.care_circles enable row level security;
alter table public.care_recipients enable row level security;
alter table public.circle_members enable row level security;
alter table public.care_events enable row level security;
alter table public.care_notes enable row level security;
alter table public.documents enable row level security;
alter table public.audit_events enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('care-documents', 'care-documents', false, 26214400, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;
