
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  preferred_date timestamp with time zone NOT NULL,
  preferred_time text,
  subject text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  admin_response text,
  admin_suggested_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create appointments" ON public.appointments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all appointments" ON public.appointments
  FOR ALL TO authenticated USING (public.is_admin());
