-- Client portal access controls

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS portal_status TEXT NOT NULL DEFAULT 'invited' CHECK (portal_status IN ('invited', 'accepted', 'disabled')),
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_clients_auth_user_id ON clients(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_clients_portal_status ON clients(portal_status);
