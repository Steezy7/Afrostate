CREATE TABLE public.design_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id TEXT NOT NULL CHECK (char_length(design_id) BETWEEN 1 AND 32),
  waiting_list_id UUID NOT NULL REFERENCES public.waiting_list(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (design_id, waiting_list_id)
);

GRANT ALL ON public.design_likes TO service_role;

ALTER TABLE public.design_likes ENABLE ROW LEVEL SECURITY;

CREATE INDEX design_likes_design_id_idx ON public.design_likes (design_id);

CREATE OR REPLACE FUNCTION public.get_design_like_counts()
RETURNS TABLE (design_id TEXT, like_count BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT dl.design_id, count(*)::bigint FROM public.design_likes dl GROUP BY dl.design_id
$$;

GRANT EXECUTE ON FUNCTION public.get_design_like_counts() TO anon, authenticated, service_role;