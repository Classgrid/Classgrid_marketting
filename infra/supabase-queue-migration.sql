-- ═══════════════════════════════════════════════════════════════
-- Email Notification Queue Table
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS email_notification_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type TEXT NOT NULL CHECK (document_type IN ('post', 'changelogEntry')),
  document_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'skipped')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  
  UNIQUE(document_id)
);

-- Fast lookup for cron job
CREATE INDEX IF NOT EXISTS idx_queue_pending ON email_notification_queue(status, created_at) 
  WHERE status IN ('pending', 'failed');

-- Prevent stale "processing" rows (auto-reset after 10 min)
CREATE INDEX IF NOT EXISTS idx_queue_processing ON email_notification_queue(status, processed_at) 
  WHERE status = 'processing';
