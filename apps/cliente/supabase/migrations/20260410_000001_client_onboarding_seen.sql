alter table if exists public.clients
  add column if not exists portal_onboarding_seen_at timestamptz,
  add column if not exists portal_onboarding_version text;

create index if not exists idx_clients_portal_onboarding_seen_at
  on public.clients (portal_onboarding_seen_at);
