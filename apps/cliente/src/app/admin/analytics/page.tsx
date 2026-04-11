import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BadgeCheck, CircleX, UserCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { AdminAnalyticsHelpModal } from '@/components/analytics/admin-analytics-help-modal'
import { AdminAnalyticsStatusEnhancer } from '@/components/analytics/admin-analytics-status-enhancer'
import { WorldLeadsMap } from '@/components/analytics/world-leads-map'
import { getAdminProjectDetailHref } from '@/lib/admin-project-route'
import { isAdminAnalyticsEnabled } from '@/lib/feature-flags'
import { getAdminAnalyticsSummary, getAdminLeadsFiltered } from '@/lib/portal-data'

interface AdminAnalyticsPageProps {
  searchParams: Promise<{
    days?: string
    status?: string
    source?: string
    utmSource?: string
    utmCampaign?: string
    status_update?: string
    leadApproved?: string
    projectId?: string
    leadError?: string
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

function HelpBadge({ text }: { text: string }) {
  return (
    <span
      title={text}
      aria-label={text}
      className="inline-flex h-6 w-6 items-center justify-center border border-white/20 text-[11px] font-semibold text-white/85"
    >
      ?
    </span>
  )
}

export default async function AdminAnalyticsPage({ searchParams }: AdminAnalyticsPageProps) {
  if (!isAdminAnalyticsEnabled()) {
    redirect('/admin/leads')
  }

  const query = await searchParams
  const days = toPositiveInt(query.days, 30)
  const status = normalizeFilter(query.status)
  const source = normalizeFilter(query.source)
  const utmSource = normalizeFilter(query.utmSource)
  const utmCampaign = normalizeFilter(query.utmCampaign)

  const [analytics, leadsFiltered, leadsForOptions] = await Promise.all([
    getAdminAnalyticsSummary(days),
    getAdminLeadsFiltered({ days, status, source, utmSource, utmCampaign }, 500),
    getAdminLeadsFiltered({ days, status: 'all', source: 'all', utmSource: 'all', utmCampaign: 'all' }, 2000),
  ])

  const total = leadsFiltered.length
  const statusCounts = {
    new: leadsFiltered.filter((lead) => lead.status === 'new').length,
    contacted: leadsFiltered.filter((lead) => lead.status === 'contacted').length,
    qualified: leadsFiltered.filter((lead) => lead.status === 'qualified').length,
    won: leadsFiltered.filter((lead) => lead.status === 'won').length,
  }

  const contactRate = total > 0 ? Number(((statusCounts.contacted / total) * 100).toFixed(2)) : 0
  const qualificationRate = total > 0 ? Number(((statusCounts.qualified / total) * 100).toFixed(2)) : 0
  const winRate = total > 0 ? Number(((statusCounts.won / total) * 100).toFixed(2)) : 0

  const sources = Array.from(new Set(leadsForOptions.map((lead) => (lead.source || 'sin_fuente').toLowerCase()))).sort()
  const utmSources = Array.from(new Set(leadsForOptions.map((lead) => (lead.utmSource || 'sin_utm').toLowerCase()))).sort()
  const utmCampaigns = Array.from(
    new Set(leadsForOptions.map((lead) => (lead.utmCampaign || 'sin_campana').toLowerCase()))
  ).sort()

  const params = new URLSearchParams({
    days: String(days),
    status,
    source,
    utmSource,
    utmCampaign,
  })
  const returnTo = `/admin/analytics?${params.toString()}`
  const exportHref = `/api/leads/export?${params.toString()}`
  const quickPresetLinks = [
    {
      label: 'Hoy',
      href: '/admin/analytics?days=1&status=all&source=all&utmSource=all&utmCampaign=all',
    },
    {
      label: '7 dias',
      href: '/admin/analytics?days=7&status=all&source=all&utmSource=all&utmCampaign=all',
    },
    {
      label: '30 dias',
      href: '/admin/analytics?days=30&status=all&source=all&utmSource=all&utmCampaign=all',
    },
    {
      label: 'Solo nuevos',
      href: `/admin/analytics?days=${days}&status=new&source=all&utmSource=all&utmCampaign=all`,
    },
  ]

  const statusUpdateFeedback = query.status_update
    ? query.status_update === 'ok'
      ? { text: 'Estado actualizado correctamente.', className: 'text-emerald-300 border-emerald-500/35 bg-emerald-500/12' }
      : { text: 'No se pudo actualizar el estado.', className: 'text-red-300 border-red-500/35 bg-red-500/12' }
    : null

  const nowMillis = Date.parse(new Date().toISOString())

  const queue = leadsFiltered
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

  const queueSummary = {
    total: queue.length,
    critico: queue.filter((lead) => lead.urgency === 'critico').length,
    warning: queue.filter((lead) => lead.urgency === 'warning').length,
    normal: queue.filter((lead) => lead.urgency === 'normal').length,
  }

  const maxTrend = Math.max(1, ...analytics.dailyViews.map((item) => item.total))
  const maxHour = Math.max(1, ...analytics.activityByHour.map((item) => item.total))

  const topUtmSources = Array.from(
    leadsFiltered.reduce((acc, lead) => {
      const key = (lead.utmSource || 'sin_utm').toLowerCase()
      acc.set(key, (acc.get(key) || 0) + 1)
      return acc
    }, new Map<string, number>())
  )
    .map(([utm, count]) => ({ utm, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const topUtmCampaigns = Array.from(
    leadsFiltered.reduce((acc, lead) => {
      const key = (lead.utmCampaign || 'sin_campana').toLowerCase()
      acc.set(key, (acc.get(key) || 0) + 1)
      return acc
    }, new Map<string, number>())
  )
    .map(([campaign, count]) => ({ campaign, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const topSources = Array.from(
    leadsFiltered.reduce((acc, lead) => {
      const key = (lead.source || 'sin_fuente').toLowerCase()
      acc.set(key, (acc.get(key) || 0) + 1)
      return acc
    }, new Map<string, number>())
  )
    .map(([sourceKey, count]) => ({ sourceKey, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
  const countryCounts = analytics.topCountries.reduce<Record<string, number>>((acc, item) => {
    acc[item.country] = item.count
    return acc
  }, {})
  const argentinaProvinceCounts = analytics.topProvinces.reduce<Record<string, number>>((acc, item) => {
    acc[item.province] = item.count
    return acc
  }, {})

  return (
    <section className="space-y-12">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="muga-badge muga-badge--sm">Analytics</p>
          <AdminAnalyticsHelpModal />
        </div>
        <h2 className="section-title">Metricas y operacion comercial</h2>
        <p className="section-lead max-w-3xl text-base">
          Panel operativo para medir trafico, conversion y gestion de leads con filtros simples.
        </p>
      </div>

      <div data-analytics-feedback className="hidden" />

      {query.leadApproved ? (
        <Alert variant="success">
          <AlertTitle>Cliente aprobado y portal habilitado</AlertTitle>
          <AlertDescription>
            Se creó el acceso al portal y el proyecto inicial quedó disponible para seguimiento.
            {query.projectId ? (
              <span className="ml-2">
                <Link href={getAdminProjectDetailHref(query.projectId)} className="muga-shell-link">
                  Abrir proyecto
                </Link>
              </span>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      {query.leadError ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo aprobar el lead</AlertTitle>
          <AlertDescription>Código: {query.leadError}</AlertDescription>
        </Alert>
      ) : null}

      {statusUpdateFeedback ? (
        <div className={`border px-4 py-3 text-sm ${statusUpdateFeedback.className}`}>{statusUpdateFeedback.text}</div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {quickPresetLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="inline-flex h-9 items-center border border-white/20 px-3 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:border-white/40"
          >
            {item.label}
          </a>
        ))}
      </div>

      <form method="GET" className="grid gap-4 border border-white/10 bg-[rgba(24,23,23,0.45)] p-4 sm:grid-cols-2 lg:grid-cols-6">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">Periodo</span>
          <select name="days" defaultValue={String(days)} className="muga-field h-10 w-full border border-white/15 px-3 text-sm text-white">
            <option value="7">7 dias</option>
            <option value="15">15 dias</option>
            <option value="30">30 dias</option>
            <option value="60">60 dias</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">Estado</span>
          <select name="status" defaultValue={status} className="muga-field h-10 w-full border border-white/15 px-3 text-sm text-white">
            <option value="all">Todos</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">Fuente</span>
          <select name="source" defaultValue={source} className="muga-field h-10 w-full border border-white/15 px-3 text-sm text-white">
            <option value="all">Todas</option>
            {sources.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">UTM source</span>
          <select name="utmSource" defaultValue={utmSource} className="muga-field h-10 w-full border border-white/15 px-3 text-sm text-white">
            <option value="all">Todas</option>
            {utmSources.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">UTM campaign</span>
          <select
            name="utmCampaign"
            defaultValue={utmCampaign}
            className="muga-field h-10 w-full border border-white/15 px-3 text-sm text-white"
          >
            <option value="all">Todas</option>
            {utmCampaigns.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-end gap-2 lg:justify-end">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center border border-primary/70 bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary/90"
          >
            Aplicar
          </button>
          <a href={exportHref} className="inline-flex w-full items-center justify-center border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/40">
            Exportar CSV
          </a>
        </div>
      </form>

      <div className="space-y-1">
        <p className="muga-badge muga-badge--sm">Resumen comercial</p>
        <p className="text-sm text-[var(--color-graylight)]">Indicadores clave para lectura rapida del estado del negocio.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Leads filtrados', value: total },
          { label: 'Vistas web', value: analytics.views },
          { label: 'Sesiones', value: analytics.sessions },
          { label: 'Bounce aprox.', value: `${analytics.bounceRate}%` },
          { label: 'Clicks CTA', value: analytics.ctaClicks },
          { label: 'CTR', value: `${analytics.ctr}%` },
          { label: 'Conv. visita→lead', value: `${analytics.leadConversion}%` },
          { label: 'Cierre', value: `${winRate}%` },
        ].map((metric) => (
          <Card key={metric.label} className="muga-shell-panel">
            <CardContent className="space-y-1 py-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">{metric.label}</p>
              <p className="text-2xl font-semibold text-white">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-1">
        <p className="muga-badge muga-badge--sm">Operacion diaria</p>
        <p className="text-sm text-[var(--color-graylight)]">Prioriza acciones sobre leads y estado del embudo.</p>
      </div>

      <Card className="muga-shell-panel">
        <CardContent className="space-y-3 py-5">
          <div className="flex items-center justify-between">
            <p className="muga-badge muga-badge--sm">Fuentes principales</p>
            <HelpBadge text="Ranking de origen declarado del lead para los filtros activos." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topSources.length === 0 ? (
              <p className="text-sm text-[var(--color-graylight)]">Sin datos de fuente para este filtro.</p>
            ) : (
              topSources.map((item) => (
                <div key={item.sourceKey} className="border border-white/10 bg-[rgba(24,23,23,0.38)] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">{item.sourceKey}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{item.count}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="muga-shell-panel">
          <CardContent className="space-y-3 py-5">
            <p className="muga-badge muga-badge--sm">Embudo comercial</p>
            <div className="flex justify-end">
              <HelpBadge text="Ratio de avance de estado sobre leads filtrados." />
            </div>
            <p className="text-sm text-[var(--color-graylight)]">Contacto: {contactRate}%</p>
            <p className="text-sm text-[var(--color-graylight)]">Calificacion: {qualificationRate}%</p>
            <p className="text-sm text-[var(--color-graylight)]">Cierre: {winRate}%</p>
          </CardContent>
        </Card>

        <Card className="muga-shell-panel">
          <CardContent className="space-y-3 py-5">
            <p className="muga-badge muga-badge--sm">Bandeja SLA (leads nuevos)</p>
            <div className="flex justify-end">
              <HelpBadge text="Leads nuevos ordenados por antiguedad: warning >24h, critico >48h." />
            </div>
            <p className="text-sm text-[var(--color-graylight)]">Pendientes: {queueSummary.total}</p>
            <p className="text-sm text-[var(--color-graylight)]">Criticos &gt;48h: {queueSummary.critico}</p>
            <p className="text-sm text-[var(--color-graylight)]">Warning &gt;24h: {queueSummary.warning}</p>
            <p className="text-sm text-[var(--color-graylight)]">En tiempo: {queueSummary.normal}</p>
          </CardContent>
        </Card>
      </div>

      <div className="muga-shell-divider" aria-hidden="true" />

      <div className="space-y-1">
        <p className="muga-badge muga-badge--sm">Analitica web</p>
        <p className="text-sm text-[var(--color-graylight)]">Comportamiento de trafico, zonas de interes y origen de demanda.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="muga-shell-panel">
          <CardContent className="space-y-3 py-5">
            <div className="flex items-center justify-between">
              <p className="muga-badge muga-badge--sm">Tendencia diaria</p>
              <HelpBadge text="Page views por dia en el periodo seleccionado." />
            </div>
            <div className="overflow-x-auto">
              <div className="grid min-w-[420px] grid-cols-7 gap-2 sm:grid-cols-10 lg:min-w-0 lg:grid-cols-14">
                {analytics.dailyViews.map((item) => (
                  <div key={item.day} className="flex flex-col items-center gap-1">
                    <div className="flex h-20 w-full items-end bg-white/5 p-1">
                    <div className="w-full bg-[var(--color-accent)]/85" style={{ height: `${(item.total / maxTrend) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-[var(--color-graylight)]">{item.day.slice(5)}</p>
                  <p className="text-xs font-semibold text-white">{item.total}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="muga-shell-panel">
          <CardContent className="space-y-3 py-5">
            <div className="flex items-center justify-between">
              <p className="muga-badge muga-badge--sm">Actividad por hora</p>
              <HelpBadge text="Distribucion horaria de eventos page_view en UTC." />
            </div>
            <div className="overflow-x-auto">
              <div className="grid min-w-[420px] grid-cols-12 gap-1 lg:min-w-0">
                {analytics.activityByHour.map((item) => (
                  <div key={item.hour} className="flex flex-col items-center gap-1 text-center">
                    <div className="mx-auto flex h-16 w-full max-w-[16px] items-end bg-white/5 p-[1px]">
                    <div className="w-full bg-[var(--color-accent)]/85" style={{ height: `${(item.total / maxHour) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-[var(--color-graylight)]">{String(item.hour).padStart(2, '0')}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="muga-shell-panel">
          <CardContent className="space-y-3 py-5">
            <div className="flex items-center justify-between">
              <p className="muga-badge muga-badge--sm">Top paginas</p>
              <HelpBadge text="Paginas con mayor cantidad de page views en el periodo." />
            </div>
            <div className="space-y-2 text-sm text-[var(--color-graylight)]">
              {analytics.topPages.length === 0 ? <p>Sin datos por ahora.</p> : null}
              {analytics.topPages.map((item) => (
                <p key={item.pagePath}>
                  <span className="text-white">{item.pagePath}</span> · {item.views} vistas
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="muga-shell-panel">
          <CardContent className="space-y-3 py-5">
            <div className="flex items-center justify-between">
              <p className="muga-badge muga-badge--sm">Top referers</p>
              <HelpBadge text="Host de referencia detectado por navegador y normalizado en ingest." />
            </div>
            <div className="space-y-2 text-sm text-[var(--color-graylight)]">
              {analytics.topReferrers.length === 0 ? <p>Sin datos por ahora.</p> : null}
              {analytics.topReferrers.map((item) => (
                <p key={item.referrer}>
                  <span className="text-white">{item.referrer}</span> · {item.count}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="muga-shell-panel overflow-hidden">
          <CardContent className="space-y-3 px-0 py-5">
            <div className="flex items-center justify-between px-5">
              <p className="muga-badge muga-badge--sm">Paises</p>
              <HelpBadge text="Mapa de calor por pais. Si hay data AR, habilita modo provincias." />
            </div>
            <WorldLeadsMap countryCounts={countryCounts} argentinaProvinceCounts={argentinaProvinceCounts} />
            <div className="flex items-center gap-3 px-5 text-[11px] text-[var(--color-graylight)]">
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 border border-white/20 bg-[rgba(255,83,83,0.16)]" /> baja
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 border border-white/20 bg-[rgba(255,83,83,0.30)]" /> media
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 border border-white/20 bg-[rgba(255,83,83,0.46)]" /> alta
              </span>
            </div>
            <div className="grid gap-6 border-t border-white/10 px-5 pt-3 lg:grid-cols-2">
              <div className="space-y-2 text-sm text-[var(--color-graylight)]">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">Top paises</p>
                {analytics.topCountries.length === 0 ? <p>Sin datos por ahora.</p> : null}
                {analytics.topCountries.map((item) => (
                  <p key={item.country}>
                    <span className="text-white">{item.country}</span> · {item.count}
                  </p>
                ))}
              </div>

              <div className="space-y-2 text-sm text-[var(--color-graylight)]">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">Argentina por provincia</p>
                {analytics.topProvinces.length === 0 ? <p>Sin datos por ahora.</p> : null}
                {analytics.topProvinces.map((item) => (
                  <p key={item.province}>
                    <span className="text-white">{item.province}</span> · {item.count}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="muga-shell-panel">
          <CardContent className="space-y-3 py-5">
            <div className="flex items-center justify-between">
              <p className="muga-badge muga-badge--sm">Zonas con mas clicks</p>
              <HelpBadge text="Elementos trackeados con data-track-zone mas clickeados." />
            </div>
            <div className="space-y-2 text-sm text-[var(--color-graylight)]">
              {analytics.topZones.length === 0 ? <p>Sin datos por ahora.</p> : null}
              {analytics.topZones.map((item) => (
                <p key={item.zoneId}>
                  <span className="text-white">{item.zoneId}</span> · {item.clicks} clicks
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="muga-shell-panel">
          <CardContent className="space-y-3 py-5">
            <div className="flex items-center justify-between">
              <p className="muga-badge muga-badge--sm">Canales UTM</p>
              <HelpBadge text="Ranking de utm_source sobre leads filtrados." />
            </div>
            <div className="space-y-2 text-sm text-[var(--color-graylight)]">
              {topUtmSources.length === 0 ? <p>Sin datos por ahora.</p> : null}
              {topUtmSources.map((item) => (
                <p key={item.utm}>
                  <span className="text-white">{item.utm}</span> · {item.count}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="muga-shell-panel">
          <CardContent className="space-y-3 py-5">
            <div className="flex items-center justify-between">
              <p className="muga-badge muga-badge--sm">Campanas UTM</p>
              <HelpBadge text="Ranking de utm_campaign sobre leads filtrados." />
            </div>
            <div className="space-y-2 text-sm text-[var(--color-graylight)]">
              {topUtmCampaigns.length === 0 ? <p>Sin datos por ahora.</p> : null}
              {topUtmCampaigns.map((item) => (
                <p key={item.campaign}>
                  <span className="text-white">{item.campaign}</span> · {item.count}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="muga-shell-divider" aria-hidden="true" />

      <Card className="muga-shell-panel">
        <CardContent className="px-0 py-0">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="muga-badge muga-badge--sm">Bandeja hoy · leads nuevos</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">
                  <th className="px-3 py-2">Antiguedad</th>
                  <th className="px-3 py-2">Lead</th>
                  <th className="px-3 py-2">Proyecto</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Accion rapida</th>
                  <th className="px-3 py-2">Accion completa</th>
                </tr>
              </thead>
              <tbody>
                {queue.slice(0, 40).map((lead) => (
                  <tr key={lead.id} className="border-b border-white/10 last:border-0" data-lead-row-id={lead.id}>
                    <td className="px-3 py-2 font-semibold text-white">{formatHours(lead.ageHours)}</td>
                    <td className="px-3 py-2">
                      <p className="font-semibold text-white">{lead.name}</p>
                      <p className="text-xs text-[var(--color-graylight)]">{lead.email}</p>
                    </td>
                    <td className="px-3 py-2 text-[var(--color-graylight)]">{lead.project || '-'}</td>
                    <td className="px-3 py-2 text-[var(--color-graylight)]" data-lead-status-id={lead.id}>
                      {STATUS_LABELS[lead.status || 'new'] || lead.status}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        {['contacted', 'qualified', 'lost'].map((nextStatus) => (
                          <form
                            key={nextStatus}
                            action="/api/leads/status"
                            method="post"
                            className="inline-flex"
                            data-status-form="1"
                            data-remove-when-resolved="1"
                          >
                            <input type="hidden" name="lead_id" value={lead.id} />
                            <input type="hidden" name="status" value={nextStatus} />
                            <input type="hidden" name="return_to" value={returnTo} />
                            <button type="submit" className="inline-flex h-8 items-center justify-center border border-white/20 px-2 text-xs font-semibold text-white hover:border-white/40">
                              <span className="sr-only">{STATUS_LABELS[nextStatus]}</span>
                              {nextStatus === 'contacted' ? <UserCheck size={14} strokeWidth={2} aria-hidden="true" /> : null}
                              {nextStatus === 'qualified' ? <BadgeCheck size={14} strokeWidth={2} aria-hidden="true" /> : null}
                              {nextStatus === 'lost' ? <CircleX size={14} strokeWidth={2} aria-hidden="true" /> : null}
                            </button>
                          </form>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <form action="/api/leads/status" method="post" className="flex items-center gap-2" data-status-form="1">
                        <input type="hidden" name="lead_id" value={lead.id} />
                        <input type="hidden" name="return_to" value={returnTo} />
                        <select
                          name="status"
                          defaultValue={lead.status || 'new'}
                          data-lead-select-id={lead.id}
                          className="muga-field h-9 border border-white/15 px-2 text-xs text-white"
                        >
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="inline-flex h-9 items-center justify-center border border-white/20 px-3 text-xs font-semibold text-white hover:border-white/40">
                          Guardar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {queue.length === 0 ? (
                  <tr>
                    <td className="px-3 py-5 text-sm text-[var(--color-graylight)]" colSpan={6}>
                      No hay leads nuevos para los filtros seleccionados.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AdminAnalyticsStatusEnhancer />
    </section>
  )
}
