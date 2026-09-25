create table if not exists public.design_likes (
  id uuid primary key default gen_random_uuid(),
  design_id text not null check (char_length(design_id) between 1 and 32),
  waiting_list_id uuid not null references public.waiting_list(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (design_id, waiting_list_id)
);

grant all on public.design_likes to service_role;

alter table public.design_likes enable row level security;

create policy "Service role can manage design likes"
on public.design_likes
for all
to service_role
using (true)
with check (true);

create index if not exists design_likes_design_id_idx on public.design_likes (design_id);

create or replace function public.get_design_like_counts()
returns table (design_id text, like_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select dl.design_id, count(*)::bigint
  from public.design_likes dl
  group by dl.design_id
$$;

grant execute on function public.get_design_like_counts() to anon, authenticated, service_role;
