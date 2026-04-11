import { resolveAccessContext } from '@/lib/access-resolver'
import { getAdminLeadsFiltered } from '@/lib/portal-data'

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.floor(parsed)
}

function normalizeFilter(value: string | null) {
  return String(value || 'all').trim().toLowerCase()
}

function escapeCsv(value: unknown) {
  const text = String(value ?? '')
  if (!text.includes('"') && !text.includes(',') && !text.includes('\n')) return text
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(request: Request) {
  const access = await resolveAccessContext()

  if (access.role !== 'internal_admin') {
    return new Response('unauthorized', { status: 401 })
  }

  const url = new URL(request.url)
  const days = toPositiveInt(url.searchParams.get('days'), 30)
  const status = normalizeFilter(url.searchParams.get('status'))
  const source = normalizeFilter(url.searchParams.get('source'))
  const utmSource = normalizeFilter(url.searchParams.get('utmSource'))
  const utmCampaign = normalizeFilter(url.searchParams.get('utmCampaign'))

  const rows = await getAdminLeadsFiltered({ days, status, source, utmSource, utmCampaign }, 5000)
  const headers = [
    'created_at',
    'first_contact_at',
    'last_contact_at',
    'name',
    'email',
    'phone',
    'project',
    'status',
    'source',
    'utm_source',
    'utm_campaign',
  ]

  const lines = [headers.join(',')]
  rows.forEach((row) => {
    lines.push(
      [
        row.createdAt,
        row.firstContactAt,
        row.lastContactAt,
        row.name,
        row.email,
        row.phone,
        row.project,
        row.status,
        row.source,
        row.utmSource,
        row.utmCampaign,
      ]
        .map(escapeCsv)
        .join(',')
    )
  })

  const csv = lines.join('\n')
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
