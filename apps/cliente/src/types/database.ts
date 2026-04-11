export type Plan = 'free' | 'pro' | 'agency' | 'enterprise'
export type SiteStatus = 'draft' | 'published' | 'archived'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: Plan
  created_at: string
  updated_at: string
}

export interface Site {
  id: string
  user_id: string
  name: string
  subdomain: string | null
  custom_domain: string | null
  template_id: string
  config: Record<string, unknown>
  status: SiteStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  site_id: string
  form_id: string | null
  data: Record<string, unknown>
  source_url: string | null
  created_at: string
}
