-- Creates the circle, owner membership, and recipient as one transaction.
create or replace function public.create_care_circle(
  p_name text, p_timezone text, p_recipient_name text,
  p_owner_id uuid, p_owner_email text, p_owner_display_name text
) returns public.care_circles
language plpgsql security definer set search_path = public as $$
declare
  new_circle public.care_circles;
begin
  insert into public.care_circles (name, timezone) values (p_name, p_timezone) returning * into new_circle;
  insert into public.circle_members (circle_id, user_id, email, display_name, role)
    values (new_circle.id, p_owner_id, p_owner_email, p_owner_display_name, 'owner');
  insert into public.care_recipients (circle_id, display_name) values (new_circle.id, p_recipient_name);
  return new_circle;
end;
$$;

revoke all on function public.create_care_circle(text, text, text, uuid, text, text) from public, anon, authenticated;
grant execute on function public.create_care_circle(text, text, text, uuid, text, text) to service_role;
