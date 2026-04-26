import { getDashboardKPIs } from '@/lib/dashboard-kpis'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Users, FolderKanban, Inbox, TrendingUp } from 'lucide-react'
import Link from 'next/link'

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  won: 'Cerrado',
  lost: 'Perdido',
  approved: 'Aprobado',
}

function getStatusColor(status: string) {
  if (status === 'approved') return 'text-primary'
  if (status === 'new') return 'text-[#ffd000]'
  if (status === 'contacted') return 'text-[#00e7c6]'
  if (status === 'qualified') return 'text-[#ff7a7a]'
  return 'text-white'
}

export default async function DashboardOverviewPage() {
  const kpis = await getDashboardKPIs()

  const leadsChange = kpis.leadsLastWeek > 0 
    ? Math.round(((kpis.leadsThisWeek - kpis.leadsLastWeek) / kpis.leadsLastWeek) * 100)
    : kpis.leadsThisWeek > 0 ? 100 : 0

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="muga-badge muga-badge--sm">Dashboard</p>
        <h2 className="section-title">Resumen ejecutivo</h2>
        <p className="section-lead max-w-3xl text-base">
          Métricas clave del negocio y actividad reciente.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="muga-shell-panel">
          <CardContent className="space-y-2 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">Leads esta semana</p>
              <Inbox className="h-4 w-4 text-[var(--color-graylight)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-white">{kpis.leadsThisWeek}</p>
              <div className={`flex items-center text-xs ${leadsChange >= 0 ? 'text-[#41e3a0]' : 'text-[#ff7a7a]'}`}>
                {leadsChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(leadsChange)}%
              </div>
            </div>
            <p className="text-xs text-[var(--color-graylight)]">{kpis.leadsLastWeek} la semana pasada</p>
          </CardContent>
        </Card>

        <Card className="muga-shell-panel">
          <CardContent className="space-y-2 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">Tasa conversion</p>
              <TrendingUp className="h-4 w-4 text-[var(--color-graylight)]" />
            </div>
            <p className="text-3xl font-semibold text-white">{kpis.leadsConversionRate}%</p>
            <p className="text-xs text-[var(--color-graylight)]">Leads aprobados ultimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="muga-shell-panel">
          <CardContent className="space-y-2 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">Proyectos activos</p>
              <FolderKanban className="h-4 w-4 text-[var(--color-graylight)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-white">{kpis.activeProjects}</p>
              <p className="text-xs text-[var(--color-graylight)]">
                {kpis.publishedProjects} publicados
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="muga-shell-panel">
          <CardContent className="space-y-2 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">Clientes activos</p>
              <Users className="h-4 w-4 text-[var(--color-graylight)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-white">{kpis.activeClients}</p>
              <p className="text-xs text-[var(--color-graylight)]">
                / {kpis.totalClients} totales
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="muga-shell-panel">
          <CardContent className="space-y-4 py-5">
            <div className="flex items-center justify-between">
              <p className="muga-badge muga-badge--sm">Leads recientes</p>
              <Link href="/admin/leads" className="text-xs text-primary hover:underline">
                Ver todos
              </Link>
            </div>
            
            {kpis.recentLeads.length > 0 ? (
              <div className="space-y-3">
                {kpis.recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                    <div>
                      <p className="font-semibold text-white text-sm">{lead.name}</p>
                      <p className="text-xs text-[var(--color-graylight)]">{lead.email}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${getStatusColor(lead.status)}`}>
                        {STATUS_LABELS[lead.status] || lead.status}
                      </p>
                      <p className="text-xs text-[var(--color-graylight)]">{formatDate(lead.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-graylight)]">No hay leads recientes.</p>
            )}
          </CardContent>
        </Card>

        <Card className="muga-shell-panel">
          <CardContent className="space-y-4 py-5">
            <div className="flex items-center justify-between">
              <p className="muga-badge muga-badge--sm">Acciones rapidas</p>
            </div>
            
            <div className="grid gap-3">
              <Link 
                href="/admin/leads?status=new&ready=1" 
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
              >
                <span className="text-sm text-white">Leads listos para aprobar</span>
                <span className="text-xs text-[var(--color-graylight)]">→</span>
              </Link>
              
              <Link 
                href="/admin/leads?status=new" 
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
              >
                <span className="text-sm text-white">Ver leads nuevos</span>
                <span className="text-xs text-[var(--color-graylight)]">→</span>
              </Link>
              
              <Link 
                href="/admin/proyectos" 
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
              >
                <span className="text-sm text-white">Administrar proyectos</span>
                <span className="text-xs text-[var(--color-graylight)]">→</span>
              </Link>
              
              <Link 
                href="/admin/clientes" 
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
              >
                <span className="text-sm text-white">Ver clientes</span>
                <span className="text-xs text-[var(--color-graylight)]">→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}