-- Add missing timestamp columns to the blog_subscribers table
ALTER TABLE blog_subscribers
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Backfill created_at for existing users (so they don't break the charts)
-- We'll just set it to now() since we don't know when they subscribed, 
-- or we can leave it as now() because of the DEFAULT clause above which automatically fills existing rows in Postgres.
