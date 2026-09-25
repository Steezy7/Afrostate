create extension if not exists pgcrypto;

create table if not exists public.waiting_list (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 100),
  phone_number text not null unique check (phone_number ~ '^\+234[789][01][0-9]{8}$'),
  email text null check (
    email is null or (
      char_length(email) <= 255 and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    )
  ),
  created_at timestamptz not null default now()
);

grant insert on public.waiting_list to anon;
grant insert on public.waiting_list to authenticated;
grant all on public.waiting_list to service_role;

alter table public.waiting_list enable row level security;

create policy "Public can join waiting list"
on public.waiting_list
for insert
to anon, authenticated
with check (true);

create policy "Deny anonymous read access to waiting list"
on public.waiting_list
for select
to anon, authenticated
using (false);

create policy "Deny anonymous update access to waiting list"
on public.waiting_list
for update
to anon, authenticated
using (false)
with check (false);

create policy "Deny anonymous delete access to waiting list"
on public.waiting_list
for delete
to anon, authenticated
using (false);

create index if not exists waiting_list_created_at_idx on public.waiting_list (created_at desc);
