-- Fixes from CODEBASE_EVALUATION.md (3 November 2026). Run after 202610220004.

-- §3.1: The self-update policy allowed members to change role and circle_id with the
-- browser anon key. Members may now update only their own display_name.
revoke insert, update, delete on public.circle_members from anon, authenticated;
grant update (display_name) on public.circle_members to authenticated;

drop policy "members can update their own display name" on public.circle_members;
create policy "members can update their own display name"
  on public.circle_members for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- §3.2: A user may belong to many circles, but only once per circle.
alter table public.circle_members drop constraint circle_members_user_id_key;
alter table public.circle_members add constraint circle_members_circle_user_key unique (circle_id, user_id);
create index circle_members_user_id_idx on public.circle_members(user_id);

-- §3.3: audit_events is append-only, so it must not hold foreign keys whose
-- ON DELETE actions update or delete audit rows. IDs are retained as plain UUIDs so
-- the trail survives member removal and circle deletion.
alter table public.audit_events drop constraint audit_events_circle_id_fkey;
alter table public.audit_events drop constraint audit_events_actor_member_id_fkey;

-- §3.4 / M5: Record the author on each row so the audit trigger can attribute
-- inserts in the same statement, and the API no longer writes duplicate audit rows.
alter table public.care_events add column created_by_member_id uuid references public.circle_members(id) on delete set null;
alter table public.care_notes add column created_by_member_id uuid references public.circle_members(id) on delete set null;
alter table public.documents add column created_by_member_id uuid references public.circle_members(id) on delete set null;

-- Inserts are attributed to created_by_member_id. Updates and deletes are attributed to
-- app.actor_member_id when the caller sets it (for example inside an RPC); otherwise null.
create or replace function public.audit_row_change()
returns trigger language plpgsql as $$
declare
  actor uuid := nullif(current_setting('app.actor_member_id', true), '')::uuid;
begin
  if tg_op = 'DELETE' then
    insert into public.audit_events (circle_id, actor_member_id, action, resource_type, resource_id)
    values (old.circle_id, actor, lower(tg_op), tg_table_name, old.id);
    return old;
  end if;

  if tg_op = 'INSERT' then
    actor := coalesce(new.created_by_member_id, actor);
  end if;

  insert into public.audit_events (circle_id, actor_member_id, action, resource_type, resource_id)
  values (new.circle_id, actor, lower(tg_op), tg_table_name, new.id);
  return new;
end;
$$;

-- M9: Only one pending invite per email per circle; revoked/expired history may repeat.
alter table public.circle_invites drop constraint circle_invites_circle_id_email_status_key;
create unique index circle_invites_pending_email_idx on public.circle_invites(circle_id, email) where status = 'pending';

-- M8: create_care_circle trusts p_owner_id, so it must stay callable only by service_role.
-- 202610220003 revokes it from public, anon, and authenticated; do not re-grant it.
