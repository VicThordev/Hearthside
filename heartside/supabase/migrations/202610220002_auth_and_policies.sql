-- Supabase Auth integration. Run after 202610220001_initial_schema.sql.
alter table public.circle_members
  add constraint circle_members_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- Authenticated members may read only their own membership rows. Application data
-- continues to be accessed through the server API, which independently validates
-- membership before using its service-role client.
create policy "members can read their own membership"
  on public.circle_members for select to authenticated
  using (user_id = auth.uid());

create policy "members can update their own display name"
  on public.circle_members for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
