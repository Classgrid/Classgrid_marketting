CREATE TABLE IF NOT EXISTS help_article_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL,
  is_helpful boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Note: In a real Supabase setup, you might want to add RLS (Row Level Security)
-- allowing public inserts but restricting selects.
