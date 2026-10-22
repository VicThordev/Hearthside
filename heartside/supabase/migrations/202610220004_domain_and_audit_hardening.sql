-- Additional product domains and an append-only audit table.
create type public.task_status as enum ('open', 'in_progress', 'completed', 'cancelled');
create type public.task_priority as enum ('low', 'normal', 'high', 'urgent');
create type public.invite_status as enum ('pending', 'accepted', 'revoked', 'expired');

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  status public.task_status not null default 'open',
  priority public.task_priority not null default 'normal',
  due_at timestamptz,
  assigned_member_id uuid references public.circle_members(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_circle_status_due_at_idx on public.tasks(circle_id, status, due_at);
create trigger tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_member_id uuid references public.circle_members(id) on delete set null,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);

create table public.circle_invites (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  email text not null,
  role public.member_role not null,
  token_hash text not null unique,
  invited_by_member_id uuid references public.circle_members(id) on delete set null,
  status public.invite_status not null default 'pending',
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique(circle_id, email, status)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  recipient_member_id uuid references public.circle_members(id) on delete cascade,
  type text not null check (char_length(type) between 1 and 80),
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.medications (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 200),
  dosage text,
  instructions text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger medications_updated_at before update on public.medications for each row execute function public.set_updated_at();

create table public.vital_readings (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.care_circles(id) on delete cascade,
  recorded_by_member_id uuid references public.circle_members(id) on delete set null,
  kind text not null check (char_length(kind) between 1 and 80),
  value jsonb not null,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index vital_readings_circle_recorded_at_idx on public.vital_readings(circle_id, recorded_at desc);

alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.circle_invites enable row level security;
alter table public.notifications enable row level security;
alter table public.medications enable row level security;
alter table public.vital_readings enable row level security;

-- The audit table is append-only even for the database owner; only insert is allowed.
create or replace function public.reject_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'audit_events are append-only';
end;
$$;
create trigger audit_events_no_update before update or delete on public.audit_events
  for each row execute function public.reject_audit_mutation();
