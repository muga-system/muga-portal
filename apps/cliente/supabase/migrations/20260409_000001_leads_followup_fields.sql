alter table if exists public.leads
  add column if not exists next_action text,
  add column if not exists next_action_at timestamptz;

create index if not exists idx_leads_status_created_at on public.leads (status, created_at desc);
create index if not exists idx_leads_next_action_at on public.leads (next_action_at);
