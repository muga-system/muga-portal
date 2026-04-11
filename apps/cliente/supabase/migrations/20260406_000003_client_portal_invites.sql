-- One-time invite links for client portal access

CREATE TABLE IF NOT EXISTS client_portal_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  token_hash TEXT NOT NULL UNIQUE,
  token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_portal_invites_client_id ON client_portal_invites(client_id);
CREATE INDEX IF NOT EXISTS idx_client_portal_invites_expires_at ON client_portal_invites(token_expires_at);

ALTER TABLE client_portal_invites ENABLE ROW LEVEL SECURITY;
