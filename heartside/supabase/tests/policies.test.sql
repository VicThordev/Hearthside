-- Database regression tests for membership policies and the audit trail.
-- Run after all migrations; everything happens in one transaction that is rolled back.
\set ON_ERROR_STOP 1
begin;

insert into auth.users (id) values
  ('00000000-0000-4000-8000-00000000000a'),
  ('00000000-0000-4000-8000-00000000000b');

-- A user can create, and therefore belong to, more than one circle.
create temp table circles on commit drop as
  select (public.create_care_circle('Circle One', 'UTC', 'Recipient One', '00000000-0000-4000-8000-00000000000a', 'a@example.test', 'A')).id as id
  union all
  select (public.create_care_circle('Circle Two', 'UTC', 'Recipient Two', '00000000-0000-4000-8000-00000000000a', 'a@example.test', 'A')).id;
grant select on circles to authenticated;

do $$ begin
  if (select count(*) from public.circle_members where user_id = '00000000-0000-4000-8000-00000000000a') <> 2 then
    raise exception 'FAIL: user should belong to two circles';
  end if;
end $$;

-- A user cannot be added to the same circle twice.
do $$ begin
  insert into public.circle_members (circle_id, user_id, email, display_name, role)
    select id, '00000000-0000-4000-8000-00000000000a', 'other@example.test', 'A again', 'collaborator' from circles limit 1;
  raise exception 'FAIL: duplicate membership allowed';
exception when unique_violation then null;
end $$;

-- B joins circle one as a restricted helper.
insert into public.circle_members (circle_id, user_id, email, display_name, role)
  select id, '00000000-0000-4000-8000-00000000000b', 'b@example.test', 'B', 'restricted_helper' from circles order by id limit 1;

-- Through the browser role, B may rename themselves but not change role or circle.
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-00000000000b', true);

do $$
declare updated int;
begin
  update public.circle_members set display_name = 'B renamed' where user_id = auth.uid();
  get diagnostics updated = row_count;
  if updated <> 1 then raise exception 'FAIL: display name update affected % rows', updated; end if;
end $$;

do $$ begin
  update public.circle_members set role = 'owner' where user_id = auth.uid();
  raise exception 'FAIL: member escalated their own role';
exception when insufficient_privilege then null;
end $$;

do $$ begin
  update public.circle_members set circle_id = (select id from circles order by id desc limit 1) where user_id = auth.uid();
  raise exception 'FAIL: member moved themselves into another circle';
exception when insufficient_privilege then null;
end $$;

do $$ begin
  insert into public.circle_members (circle_id, user_id, email, display_name, role)
    select id, auth.uid(), 'b2@example.test', 'B', 'owner' from circles order by id desc limit 1;
  raise exception 'FAIL: member inserted their own membership';
exception when insufficient_privilege then null;
end $$;

reset role;

-- An insert produces exactly one audit row, attributed to the author.
insert into public.care_events (circle_id, created_by_member_id, title, starts_at, category)
  select m.circle_id, m.id, 'Pharmacy pickup', now(), 'errands'
  from public.circle_members m where m.user_id = '00000000-0000-4000-8000-00000000000b';

do $$
declare rows int; actor uuid;
begin
  select count(*), max(actor_member_id::text)::uuid into rows, actor
    from public.audit_events where resource_type = 'care_events' and action = 'insert';
  if rows <> 1 then raise exception 'FAIL: expected 1 audit row for insert, found %', rows; end if;
  if actor is distinct from (select id from public.circle_members where user_id = '00000000-0000-4000-8000-00000000000b') then
    raise exception 'FAIL: insert audit row is not attributed to the author';
  end if;
end $$;

-- Audit rows stay append-only.
do $$ begin
  update public.audit_events set action = 'tampered';
  raise exception 'FAIL: audit row was updated';
exception when raise_exception then
  if sqlerrm like 'FAIL:%' then raise; end if;
end $$;

-- Removing a member who has acted, and deleting circles, succeed and keep the trail.
delete from public.circle_members where user_id = '00000000-0000-4000-8000-00000000000b';
delete from auth.users where id = '00000000-0000-4000-8000-00000000000a';
delete from public.care_circles where id in (select id from circles);

do $$ begin
  if exists (select 1 from public.care_circles where id in (select id from circles)) then
    raise exception 'FAIL: circles were not deleted';
  end if;
  if not exists (select 1 from public.audit_events where resource_type = 'care_events') then
    raise exception 'FAIL: audit trail was lost on deletion';
  end if;
end $$;

-- Invites: history may repeat, but only one pending invite per email per circle.
insert into public.care_circles (id, name) values ('00000000-0000-4000-8000-0000000000c1', 'Invite Circle');
insert into public.circle_invites (circle_id, email, role, token_hash, status, expires_at) values
  ('00000000-0000-4000-8000-0000000000c1', 'c@example.test', 'collaborator', 'h1', 'revoked', now()),
  ('00000000-0000-4000-8000-0000000000c1', 'c@example.test', 'collaborator', 'h2', 'revoked', now()),
  ('00000000-0000-4000-8000-0000000000c1', 'c@example.test', 'collaborator', 'h3', 'pending', now() + interval '7 days');

do $$ begin
  insert into public.circle_invites (circle_id, email, role, token_hash, status, expires_at)
    values ('00000000-0000-4000-8000-0000000000c1', 'c@example.test', 'collaborator', 'h4', 'pending', now() + interval '7 days');
  raise exception 'FAIL: second pending invite allowed';
exception when unique_violation then null;
end $$;

-- The circle-creation RPC trusts its owner argument, so browser roles must not call it.
do $$ begin
  if has_function_privilege('authenticated', 'public.create_care_circle(text, text, text, uuid, text, text)', 'execute') then
    raise exception 'FAIL: authenticated can execute create_care_circle';
  end if;
end $$;

\echo 'All database policy tests passed.'
rollback;
