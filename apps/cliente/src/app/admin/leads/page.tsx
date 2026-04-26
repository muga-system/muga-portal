import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { AdminLeadsHelpModal } from '@/components/leads/admin-leads-help-modal'
import { getAdminProjectDetailHref } from '@/lib/admin-project-route'
import { getAdminLeadsFiltered, getAdminLeadsPaginated, type PaginatedLeadsResult, type AdminLeadIntake } from '@/lib/portal-data'

interface AdminLeadsPageProps {
  searchParams: Promise<{
    days?: string
    q?: string
    status?: string
    source?: string
    utmSource?: string
    utmCampaign?: string
    leadApproved?: string
    projectId?: string
    leadError?: string
    status_update?: string
    followup_update?: string
    ready?: string
    stale?: string
    page?: string
    limit?: string
    inviteUrl?: string
  }>
}

function toPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.floor(parsed)
}

function normalizeFilter(value: string | undefined) {
  return (value || 'all').trim().toLowerCase()
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  won: 'Cerrado',
  lost: 'Perdido',
  approved: 'Aprobado',
}

function getStatusTextClass(status: string) {
  if (status === 'approved') return 'text-primary font-semibold'
  if (status === 'new') return 'text-[#ffd000] font-bold tracking-[0.01em]'
  if (status === 'contacted') return 'text-[#00e7c6] font-bold tracking-[0.01em]'
  if (status === 'qualified') return 'text-[#ff7a7a] font-semibold'
  if (status === 'won') return 'text-[#41e3a0] font-semibold'
  if (status === 'lost') return 'text-[#8c8c8c] font-medium'
  return 'text-white font-medium'
}

const LEAD_ERROR_MESSAGES: Record<string, string> = {
  'internal-email-blocked': 'Este email pertenece al equipo interno. Usa un email de cliente para aprobar portal.',
  'lead-not-found': 'No encontramos ese lead en base de datos. Recarga la pantalla y reintenta.',
  'approve-failed': 'Falló una parte del onboarding (usuario, cliente, proyecto o invitación). Revisá logs del servidor.',
}

function classifyUrgency(hours: number) {
  if (hours > 48) return 'critico'
  if (hours > 24) return 'warning'
  return 'normal'
}

function formatHours(hours: number) {
  if (hours <= 0) return '0 h'
  if (hours < 1) return `${Math.round(hours * 60)} min`
  return `${hours.toFixed(1)} h`
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

function toDatetimeLocalValue(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const query = await searchParams
  const days = toPositiveInt(query.days, 30)
  const term = String(query.q || '').trim()
  const termLower = term.toLowerCase()
  const status = normalizeFilter(query.status)
  const source = normalizeFilter(query.source)
  const utmSource = normalizeFilter(query.utmSource)
  const utmCampaign = normalizeFilter(query.utmCampaign)
  const readyOnly = query.ready === '1'
  const staleOnly = query.stale === '1'

  const leads = await getAdminLeadsFiltered({ days, status, source, utmSource, utmCampaign }, 500)
  const nowMillis = Date.parse(new Date().toISOString())
  const searchedLeads = termLower
    ? leads.filter((lead) => {
        const haystack = [lead.name, lead.email, lead.phone, lead.project].map((item) => String(item || '').toLowerCase())
        return haystack.some((item) => item.includes(termLower))
      })
    : leads

  const allLeads = leads
    .filter((lead) => searchedLeads.some((item) => item.id === lead.id))
    .map((lead) => {
      const lastTouchAt = lead.lastContactAt || lead.firstContactAt || lead.createdAt
      const staleHours = Math.max(0, (nowMillis - new Date(lastTouchAt).getTime()) / (1000 * 60 * 60))
      const isReadyForPortal = ['new', 'contacted', 'qualified'].includes((lead.status || 'new').toLowerCase())
      const isStaleFollowup = ['contacted', 'qualified'].includes((lead.status || 'new').toLowerCase()) && staleHours >= 72

      return {
        ...lead,
        staleHours,
        isReadyForPortal,
        isStaleFollowup,
      }
    })
    .filter((lead) => {
      if (readyOnly && !lead.isReadyForPortal) return false
      if (staleOnly && !lead.isStaleFollowup) return false
      return true
    })

  const queue = leads
    .filter((lead) => searchedLeads.some((item) => item.id === lead.id))
    .filter((lead) => (lead.status || 'new') === 'new')
    .map((lead) => {
      const ageHours = Math.max(0, (nowMillis - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60))
      return {
        ...lead,
        ageHours,
        urgency: classifyUrgency(ageHours),
      }
    })
    .sort((a, b) => b.ageHours - a.ageHours)

  const params = new URLSearchParams({
    days: String(days),
    q: term,
    status,
    source,
    utmSource,
    utmCampaign,
  })
  if (readyOnly) params.set('ready', '1')
  if (staleOnly) params.set('stale', '1')
  const returnTo = `/admin/leads?${params.toString()}`

  const queueSummary = {
    total: queue.length,
    critico: queue.filter((lead) => lead.urgency === 'critico').length,
    warning: queue.filter((lead) => lead.urgency === 'warning').length,
    normal: queue.filter((lead) => lead.urgency === 'normal').length,
  }

  const prioritySummary = {
    overdue: queueSummary.critico,
    risk: queueSummary.warning,
    ready: allLeads.filter((lead) => lead.isReadyForPortal).length,
  }

  const buildHref = (overrides: Record<string, string>) => {
    const next = new URLSearchParams({
      days: String(days),
      q: term,
      status,
      source,
      utmSource,
      utmCampaign,
      ...(readyOnly ? { ready: '1' } : {}),
      ...(staleOnly ? { stale: '1' } : {}),
      ...overrides,
    })
    return `/admin/leads?${next.toString()}`
  }

  const recentLeads = searchedLeads.slice(0, 3)
  const newLast24h = searchedLeads.filter((lead) => {
    const ageHours = Math.max(0, (nowMillis - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60))
    return ageHours <= 24
  }).length

  return (
    <section className="space-y-12">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="muga-badge muga-badge--sm">Leads</p>
          <AdminLeadsHelpModal />
        </div>
        <h2 className="section-title">Operacion comercial</h2>
        <p className="section-lead max-w-3xl text-base">Vista de accion inmediata para priorizar, contactar y aprobar sin friccion.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Nuevos hoy', value: newLast24h },
            { label: 'Vencidos (+48h)', value: prioritySummary.overdue },
            { label: 'Listos para portal', value: prioritySummary.ready },
          ].map((metric) => (
            <Card key={metric.label} className="muga-shell-panel">
              <CardContent className="space-y-1 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">{metric.label}</p>
                <p className="text-2xl font-semibold text-white">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 lg:flex-col lg:justify-center">
          <a
            href={buildHref({ status: 'new', ready: '0', stale: '0' })}
            className="inline-flex h-10 items-center justify-center border border-white/20 px-3 text-xs font-semibold text-white hover:border-white/40"
          >
            Ver pendientes criticos
          </a>
          <a
            href={buildHref({ status: 'all', ready: '1', stale: '0' })}
            className="inline-flex h-10 items-center justify-center border border-primary/70 bg-primary px-3 text-xs font-semibold text-black hover:bg-primary/90"
          >
            Aprobar listos
          </a>
        </div>
      </div>

      <Card className="muga-shell-panel">
        <CardContent className="space-y-4 py-5">
          <p className="muga-badge muga-badge--sm">Ultimos 3 ingresos</p>
          <div className="grid gap-3 lg:grid-cols-3">
            {recentLeads.map((lead) => {
              const leadStatus = (lead.status || 'new').toLowerCase()
              const canApprovePortal = ['new', 'contacted', 'qualified'].includes(leadStatus)
              const isApproved = leadStatus === 'approved'

              return (
                <article key={`recent-${lead.id}`} className="muga-shell-section space-y-3 p-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{lead.name}</p>
                    <p className="text-xs text-[var(--color-graylight)]">{lead.email}</p>
                    <p className="text-xs text-[var(--color-graylight)]">Ingreso: {formatDateTime(lead.createdAt)}</p>
                    <div className="pt-1">
                      <span className={`text-xs font-semibold ${getStatusTextClass(leadStatus)}`}>
                        {STATUS_LABELS[leadStatus] || leadStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {leadStatus !== 'contacted' ? (
                      <form action="/api/leads/status" method="post" className="inline-flex">
                        <input type="hidden" name="lead_id" value={lead.id} />
                        <input type="hidden" name="status" value="contacted" />
                        <input type="hidden" name="return_to" value={returnTo} />
                        <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                          Contactado
                        </button>
                      </form>
                    ) : null}

                    {isApproved ? (
                      <span className="inline-flex h-8 items-center text-xs text-[var(--color-graylight)]">Portal activo</span>
                    ) : canApprovePortal ? (
                      <form action={`/admin/leads/${lead.id}/approve`} method="post" className="inline-flex">
                        <button type="submit" className="muga-btn-primary h-8 px-2 text-xs">
                          Aprobar portal
                        </button>
                      </form>
                    ) : (
                      <span className="inline-flex h-8 items-center text-xs text-[var(--color-graylight)]">Sin accion directa</span>
                    )}
                  </div>
                </article>
              )
            })}
            {recentLeads.length === 0 ? <p className="text-sm text-[var(--color-graylight)]">No hay ingresos recientes para los filtros actuales.</p> : null}
          </div>
        </CardContent>
      </Card>

      {query.leadApproved ? (
        <Alert variant="success">
          <AlertTitle>Lead aprobado e invitacion enviada</AlertTitle>
          <AlertDescription>
            Se envio la invitacion al cliente. El portal estara disponible una vez que acepte la invitacion.
            {query.projectId ? (
              <span className="ml-2">
                <Link href={getAdminProjectDetailHref(query.projectId)} className="muga-shell-link">
                  Abrir proyecto
                </Link>
              </span>
            ) : null}
            {query.inviteUrl ? (
              <div className="mt-2 text-xs">
                <p className="text-white/70">Enlace de invitacion:</p>
                <Link href={query.inviteUrl} className="text-primary hover:underline break-all">
                  {query.inviteUrl}
                </Link>
              </div>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      {query.leadError ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo aprobar el lead</AlertTitle>
          <AlertDescription>
            {LEAD_ERROR_MESSAGES[query.leadError] || `Código: ${query.leadError}`}
          </AlertDescription>
        </Alert>
      ) : null}

      {query.status_update === 'ok' ? (
        <Alert variant="success">
          <AlertTitle>Estado actualizado</AlertTitle>
          <AlertDescription>El lead se movió de estado correctamente.</AlertDescription>
        </Alert>
      ) : null}

      {query.followup_update === 'ok' ? (
        <Alert variant="success">
          <AlertTitle>Seguimiento guardado</AlertTitle>
          <AlertDescription>La próxima acción quedó registrada para este lead.</AlertDescription>
        </Alert>
      ) : null}

      {query.followup_update && query.followup_update !== 'ok' ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo guardar el seguimiento</AlertTitle>
          <AlertDescription>Código: {query.followup_update}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-3">
        <form method="GET" className="flex items-center gap-2 border border-white/10 bg-[rgba(24,23,23,0.45)] p-2">
          <input type="hidden" name="days" value={String(days)} />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="source" value={source} />
          <input type="hidden" name="utmSource" value={utmSource} />
          <input type="hidden" name="utmCampaign" value={utmCampaign} />
          {readyOnly ? <input type="hidden" name="ready" value="1" /> : null}
          {staleOnly ? <input type="hidden" name="stale" value="1" /> : null}
          <input
            type="search"
            name="q"
            defaultValue={term}
            placeholder="Buscar por nombre, email, telefono o proyecto"
            className="muga-field h-10 flex-1 border border-white/15 px-3 text-sm text-white"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center border border-primary/70 bg-primary px-4 text-sm font-semibold text-black hover:bg-primary/90"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="muga-shell-divider" aria-hidden="true" />

      <Card className="muga-shell-panel">
        <CardContent className="px-0 py-0">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="muga-badge muga-badge--sm">Bandeja hoy · leads nuevos</p>
          </div>
          <div className="overflow-x-auto hidden lg:block">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">
                  <th className="px-3 py-2">Antiguedad</th>
                  <th className="px-3 py-2">Lead</th>
                  <th className="px-3 py-2">Proyecto</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Accion</th>
                </tr>
              </thead>
              <tbody>
                {queue.slice(0, 80).map((lead) => {
                  const isApproved = (lead.status || '').toLowerCase() === 'approved'

                  return (
                    <tr key={lead.id} className="border-b border-white/10 last:border-0">
                      <td className="px-3 py-2 font-semibold text-white">
                        {formatHours(lead.ageHours)} · {lead.urgency}
                      </td>
                      <td className="px-3 py-2">
                        <p className="font-semibold text-white">{lead.name}</p>
                        <p className="text-xs text-[var(--color-graylight)]">{lead.email}</p>
                      </td>
                      <td className="px-3 py-2 text-[var(--color-graylight)]">{lead.project || '-'}</td>
                      <td className="px-3 py-2">
                        <span className={`text-xs font-semibold ${getStatusTextClass((lead.status || 'new').toLowerCase())}`}>
                          {STATUS_LABELS[lead.status || 'new'] || lead.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {isApproved ? (
                          <span className="text-xs text-[var(--color-graylight)]">Portal activo</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <form action="/api/leads/status" method="post" className="inline-flex">
                              <input type="hidden" name="lead_id" value={lead.id} />
                              <input type="hidden" name="status" value="contacted" />
                              <input type="hidden" name="return_to" value={returnTo} />
                              <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                                Contactado
                              </button>
                            </form>
                            <form action={`/admin/leads/${lead.id}/approve`} method="post" className="inline-flex">
                              <button type="submit" className="muga-btn-primary h-8 px-2 text-xs">
                                Aprobar portal
                              </button>
                            </form>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {queue.length === 0 ? (
                  <tr>
                    <td className="px-3 py-5 text-sm text-[var(--color-graylight)]" colSpan={5}>
                      No hay leads nuevos para los filtros seleccionados.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {queue.slice(0, 40).map((lead) => {
              const isApproved = (lead.status || '').toLowerCase() === 'approved'

              return (
                <article key={lead.id} className="muga-shell-section space-y-3 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{lead.name}</p>
                      <p className="text-xs text-[var(--color-graylight)]">{lead.email}</p>
                    </div>
                    <p className="text-xs text-[var(--color-graylight)]">{formatHours(lead.ageHours)}</p>
                  </div>
                  <p className="text-xs text-[var(--color-graylight)]">Proyecto: {lead.project || '-'}</p>
                  <div>
                    <span className={`text-xs font-semibold ${getStatusTextClass((lead.status || 'new').toLowerCase())}`}>
                      {STATUS_LABELS[lead.status || 'new'] || lead.status}
                    </span>
                  </div>
                  {isApproved ? (
                    <p className="text-xs text-[var(--color-graylight)]">Portal activo</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <form action="/api/leads/status" method="post" className="inline-flex">
                        <input type="hidden" name="lead_id" value={lead.id} />
                        <input type="hidden" name="status" value="contacted" />
                        <input type="hidden" name="return_to" value={returnTo} />
                        <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                          Contactado
                        </button>
                      </form>
                      <form action={`/admin/leads/${lead.id}/approve`} method="post" className="inline-flex">
                        <button type="submit" className="muga-btn-primary h-8 px-2 text-xs">
                          Aprobar portal
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              )
            })}
            {queue.length === 0 ? <p className="text-sm text-[var(--color-graylight)]">No hay leads nuevos para los filtros seleccionados.</p> : null}
          </div>
        </CardContent>
      </Card>

      <Card className="muga-shell-panel">
        <CardContent className="px-0 py-0">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="muga-badge muga-badge--sm">Todos los leads (filtrados)</p>
            <p className="text-xs text-[var(--color-graylight)]">
              {allLeads.length} leads {allLeads.length >= 500 && '(limite alcanzado)'}
            </p>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">
                  <th className="px-3 py-2">Lead</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Ultimo contacto</th>
                  <th className="px-3 py-2">Proxima accion</th>
                  <th className="px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allLeads.map((lead) => {
                  const leadStatus = (lead.status || 'new').toLowerCase()
                  const canApprovePortal = ['new', 'contacted', 'qualified'].includes(leadStatus)
                  const canReopen = ['contacted', 'qualified', 'lost'].includes(leadStatus)
                  const isApproved = leadStatus === 'approved'

                  return (
                    <tr key={`all-${lead.id}`} className="border-b border-white/10 last:border-0 align-top">
                      <td className="px-3 py-2">
                        <p className="font-semibold text-white">{lead.name}</p>
                        <p className="text-xs text-[var(--color-graylight)]">{lead.email}</p>
                        <p className="text-xs text-[var(--color-graylight)]">{lead.project || '-'}</p>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`text-xs font-semibold ${getStatusTextClass(leadStatus)}`}>
                          {STATUS_LABELS[leadStatus] || leadStatus}
                        </span>
                        {lead.isStaleFollowup ? <p className="text-[11px] text-primary">Sin movimiento +72h</p> : null}
                      </td>
                      <td className="px-3 py-2 text-[var(--color-graylight)]">{formatDateTime(lead.lastContactAt || lead.firstContactAt || lead.createdAt)}</td>
                      <td className="px-3 py-2">
                        <form action="/api/leads/followup" method="post" className="grid gap-2">
                          <input type="hidden" name="lead_id" value={lead.id} />
                          <input type="hidden" name="return_to" value={returnTo} />
                          <input
                            type="text"
                            name="next_action"
                            defaultValue={lead.nextAction || ''}
                            maxLength={280}
                            placeholder="Ej: seguimiento por presupuesto"
                            className="muga-field h-8 w-[240px] border border-white/15 px-2 text-xs text-white"
                          />
                          <input
                            type="datetime-local"
                            name="next_action_at"
                            defaultValue={toDatetimeLocalValue(lead.nextActionAt)}
                            className="muga-field h-8 w-[240px] border border-white/15 px-2 text-xs text-white"
                          />
                          <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                            Guardar seguimiento
                          </button>
                        </form>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          {leadStatus !== 'contacted' ? (
                            <form action="/api/leads/status" method="post" className="inline-flex">
                              <input type="hidden" name="lead_id" value={lead.id} />
                              <input type="hidden" name="status" value="contacted" />
                              <input type="hidden" name="return_to" value={returnTo} />
                              <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                                Contactado
                              </button>
                            </form>
                          ) : null}

                          {canReopen ? (
                            <form action="/api/leads/status" method="post" className="inline-flex">
                              <input type="hidden" name="lead_id" value={lead.id} />
                              <input type="hidden" name="status" value="new" />
                              <input type="hidden" name="return_to" value={returnTo} />
                              <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                                Reabrir
                              </button>
                            </form>
                          ) : null}

                          {isApproved ? (
                            <span className="inline-flex h-8 items-center text-xs text-[var(--color-graylight)]">Portal activo</span>
                          ) : canApprovePortal ? (
                            <form action={`/admin/leads/${lead.id}/approve`} method="post" className="inline-flex">
                              <button type="submit" className="muga-btn-primary h-8 px-2 text-xs">
                                Aprobar portal
                              </button>
                            </form>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {allLeads.length === 0 ? (
                  <tr>
                    <td className="px-3 py-5 text-sm text-[var(--color-graylight)]" colSpan={5}>
                      No hay leads para la combinacion actual de filtros.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {allLeads.map((lead) => {
              const leadStatus = (lead.status || 'new').toLowerCase()
              const canApprovePortal = ['new', 'contacted', 'qualified'].includes(leadStatus)
              const canReopen = ['contacted', 'qualified', 'lost'].includes(leadStatus)
              const isApproved = leadStatus === 'approved'

              return (
                <article key={`all-mobile-${lead.id}`} className="muga-shell-section space-y-3 p-3">
                  <div>
                    <p className="font-semibold text-white">{lead.name}</p>
                    <p className="text-xs text-[var(--color-graylight)]">{lead.email}</p>
                    <div className="pt-1">
                      <span className={`text-xs font-semibold ${getStatusTextClass(leadStatus)}`}>
                        {STATUS_LABELS[leadStatus] || leadStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-graylight)]">Ultimo contacto: {formatDateTime(lead.lastContactAt || lead.firstContactAt || lead.createdAt)}</p>
                    {lead.isStaleFollowup ? <p className="text-xs text-primary">Sin movimiento +72h</p> : null}
                  </div>

                  <form action="/api/leads/followup" method="post" className="grid gap-2">
                    <input type="hidden" name="lead_id" value={lead.id} />
                    <input type="hidden" name="return_to" value={returnTo} />
                    <input
                      type="text"
                      name="next_action"
                      defaultValue={lead.nextAction || ''}
                      maxLength={280}
                      placeholder="Proxima accion"
                      className="muga-field h-9 border border-white/15 px-2 text-xs text-white"
                    />
                    <input
                      type="datetime-local"
                      name="next_action_at"
                      defaultValue={toDatetimeLocalValue(lead.nextActionAt)}
                      className="muga-field h-9 border border-white/15 px-2 text-xs text-white"
                    />
                    <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                      Guardar seguimiento
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2">
                    {leadStatus !== 'contacted' ? (
                      <form action="/api/leads/status" method="post" className="inline-flex">
                        <input type="hidden" name="lead_id" value={lead.id} />
                        <input type="hidden" name="status" value="contacted" />
                        <input type="hidden" name="return_to" value={returnTo} />
                        <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                          Contactado
                        </button>
                      </form>
                    ) : null}

                    {canReopen ? (
                      <form action="/api/leads/status" method="post" className="inline-flex">
                        <input type="hidden" name="lead_id" value={lead.id} />
                        <input type="hidden" name="status" value="new" />
                        <input type="hidden" name="return_to" value={returnTo} />
                        <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                          Reabrir
                        </button>
                      </form>
                    ) : null}

                    {isApproved ? (
                      <span className="inline-flex h-8 items-center text-xs text-[var(--color-graylight)]">Portal activo</span>
                    ) : canApprovePortal ? (
                      <form action={`/admin/leads/${lead.id}/approve`} method="post" className="inline-flex">
                        <button type="submit" className="muga-btn-primary h-8 px-2 text-xs">
                          Aprobar portal
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              )
            })}
            {allLeads.length === 0 ? <p className="text-sm text-[var(--color-graylight)]">No hay leads para los filtros actuales.</p> : null}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
