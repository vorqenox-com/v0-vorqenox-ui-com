-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image TEXT,
  category TEXT NOT NULL DEFAULT '',
  keywords TEXT NOT NULL DEFAULT '',
  target_url TEXT NOT NULL DEFAULT '',
  card_type TEXT NOT NULL DEFAULT 'normal',
  show_ads BOOLEAN NOT NULL DEFAULT true,
  show_landing_page BOOLEAN NOT NULL DEFAULT false,
  auto_refresh BOOLEAN NOT NULL DEFAULT false,
  counter_mode TEXT NOT NULL DEFAULT 'fixed',
  counter_fixed INTEGER NOT NULL DEFAULT 10,
  counter_min INTEGER NOT NULL DEFAULT 500,
  counter_max INTEGER NOT NULL DEFAULT 1500,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  lead_gen_mode TEXT NOT NULL DEFAULT 'none',
  traffic_wash_mode TEXT NOT NULL DEFAULT 'off',
  visibility TEXT NOT NULL DEFAULT 'grid',
  info_boxes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD')
);

-- Allow public read access for articles (anon can select)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "articles_public_read" ON public.articles
  FOR SELECT USING (true);

CREATE POLICY "articles_authenticated_insert" ON public.articles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "articles_authenticated_update" ON public.articles
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "articles_authenticated_delete" ON public.articles
  FOR DELETE USING (auth.uid() IS NOT NULL);
