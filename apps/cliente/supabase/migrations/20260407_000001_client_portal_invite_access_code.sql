-- Add numeric access code for invite-only portal entry

ALTER TABLE client_portal_invites
  ADD COLUMN IF NOT EXISTS access_code_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_client_portal_invites_access_code_hash
  ON client_portal_invites(access_code_hash)
  WHERE access_code_hash IS NOT NULL;
