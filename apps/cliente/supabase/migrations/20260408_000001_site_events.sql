-- Analytics foundation tables for admin dashboard

CREATE TABLE IF NOT EXISTS site_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  site_host TEXT NOT NULL,
  page_path TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'cta_click', 'form_start', 'form_submit')),
  zone_id TEXT,
  x NUMERIC,
  y NUMERIC,
  viewport_w INTEGER,
  viewport_h INTEGER,
  session_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_events_created_at ON site_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_type_created ON site_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_page_created ON site_events(page_path, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_zone_created ON site_events(zone_id, created_at DESC) WHERE zone_id IS NOT NULL;

ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;
