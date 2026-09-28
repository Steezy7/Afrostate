-- Store which colourway was liked (e.g. drop 001 / Red).
-- A person can like several colours of the same drop; drop totals still count each person once.
alter table public.design_likes
  add column if not exists color text not null default '' check (char_length(color) <= 40);

alter table public.design_likes drop constraint if exists design_likes_design_id_waiting_list_id_key;
alter table public.design_likes drop constraint if exists design_likes_design_color_person_key;
alter table public.design_likes
  add constraint design_likes_design_color_person_key unique (design_id, waiting_list_id, color);

create or replace function public.get_design_like_counts()
returns table (design_id text, like_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select dl.design_id, count(distinct dl.waiting_list_id)::bigint
  from public.design_likes dl
  group by dl.design_id
$$;

grant execute on function public.get_design_like_counts() to anon, authenticated, service_role;
