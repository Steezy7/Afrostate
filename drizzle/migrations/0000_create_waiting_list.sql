CREATE TABLE public.waiting_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 100),
  phone_number TEXT NOT NULL UNIQUE CHECK (phone_number ~ '^\+234[789][01][0-9]{8}$'),
  email TEXT NULL CHECK (email IS NULL OR (char_length(email) <= 255 AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.waiting_list TO anon;
GRANT INSERT ON public.waiting_list TO authenticated;
GRANT ALL ON public.waiting_list TO service_role;
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can join waiting list"
ON public.waiting_list
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
CREATE INDEX waiting_list_created_at_idx ON public.waiting_list (created_at DESC);