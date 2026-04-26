import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export interface DashboardKPIs {
  leadsThisWeek: number
  leadsLastWeek: number
  leadsConversionRate: number
  avgTimeToFirstContact: number
  activeProjects: number
  publishedProjects: number
  totalClients: number
  activeClients: number
  recentLeads: Array<{
    id: number
    name: string
    email: string
    status: string
    createdAt: string
  }>
}

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const supabase = createSupabaseAdminClient()
  
  const now = new Date()
  const startOfThisWeek = new Date(now)
  startOfThisWeek.setDate(now.getDate() - now.getDay())
  startOfThisWeek.setHours(0, 0, 0, 0)
  
  const startOfLastWeek = new Date(startOfThisWeek)
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7)

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    thisWeekLeadsResult,
    lastWeekLeadsResult,
    approvedLeadsResult,
    totalLeadsResult,
    projectsResult,
    activeProjectsResult,
    publishedProjectsResult,
    clientsResult,
    activeClientsResult,
    recentLeadsResult,
  ] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', startOfThisWeek.toISOString()),
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', startOfLastWeek.toISOString()).lt('created_at', startOfThisWeek.toISOString()),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'approved').gte('created_at', thirtyDaysAgo),
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }).neq('current_stage', 'publicado').eq('status', 'active'),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('current_stage', 'publicado'),
    supabase.from('clients').select('id', { count: 'exact', head: true }),
    supabase.from('clients').select('id', { count: 'exact', head: true }).eq('portal_status', 'accepted'),
    supabase
      .from('leads')
      .select('id, name, email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const leadsThisWeek = thisWeekLeadsResult.count ?? 0
  const leadsLastWeek = lastWeekLeadsResult.count ?? 0
  const totalLeads = totalLeadsResult.count ?? 0
  const approvedLeads = approvedLeadsResult.count ?? 0
  const leadsConversionRate = totalLeads > 0 ? Math.round((approvedLeads / totalLeads) * 100) : 0

  return {
    leadsThisWeek,
    leadsLastWeek,
    leadsConversionRate,
    avgTimeToFirstContact: 0,
    activeProjects: activeProjectsResult.count ?? 0,
    publishedProjects: publishedProjectsResult.count ?? 0,
    totalClients: clientsResult.count ?? 0,
    activeClients: activeClientsResult.count ?? 0,
    recentLeads: (recentLeadsResult.data ?? []).map((lead) => ({
      id: lead.id,
      name: lead.name || 'Sin nombre',
      email: lead.email || '',
      status: lead.status || 'new',
      createdAt: lead.created_at,
    })),
  }
}