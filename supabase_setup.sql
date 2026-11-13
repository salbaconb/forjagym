-- Forja Gym: tabla de datos por usuario con seguridad por filas (RLS).
-- Ejecútalo una vez en Supabase > SQL Editor.

create table if not exists public.forja_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.forja_data enable row level security;

drop policy if exists "forja_select_own" on public.forja_data;
drop policy if exists "forja_insert_own" on public.forja_data;
drop policy if exists "forja_update_own" on public.forja_data;
drop policy if exists "forja_delete_own" on public.forja_data;

create policy "forja_select_own" on public.forja_data
  for select to authenticated using (auth.uid() = user_id);
create policy "forja_insert_own" on public.forja_data
  for insert to authenticated with check (auth.uid() = user_id);
create policy "forja_update_own" on public.forja_data
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "forja_delete_own" on public.forja_data
  for delete to authenticated using (auth.uid() = user_id);

-- La app llama a esta función al pulsar "Eliminar mi cuenta".
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  delete from public.forja_data where user_id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
