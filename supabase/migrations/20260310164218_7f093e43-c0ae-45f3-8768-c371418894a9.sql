
-- Portfolio websites table
CREATE TABLE public.portfolio_websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  screenshot_url TEXT,
  category TEXT DEFAULT 'website',
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Portfolio video content table
CREATE TABLE public.portfolio_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'video_ia',
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Internal messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Special course purchases (one-time payments, not subscriptions)
CREATE TABLE public.special_course_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  payment_method TEXT DEFAULT 'wave',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_course_purchases ENABLE ROW LEVEL SECURITY;

-- Portfolio: public read, admin write
CREATE POLICY "Anyone can view published portfolio websites" ON public.portfolio_websites FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage portfolio websites" ON public.portfolio_websites FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Anyone can view published portfolio videos" ON public.portfolio_videos FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage portfolio videos" ON public.portfolio_videos FOR ALL TO authenticated USING (public.is_admin());

-- Messages: users can read/send their own
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can mark messages read" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() = receiver_id);
CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT TO authenticated USING (public.is_admin());

-- Special purchases
CREATE POLICY "Users can view own purchases" ON public.special_course_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create purchases" ON public.special_course_purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage purchases" ON public.special_course_purchases FOR ALL TO authenticated USING (public.is_admin());

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
