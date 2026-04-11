import { isAnalyticsIngestEnabled } from '@/lib/feature-flags'

type TrackPayload = {
  eventType?: string
  pagePath?: string
  zoneId?: string
  x?: number
  y?: number
  viewportW?: number
  viewportH?: number
  sessionId?: string
  metadata?: Record<string, unknown>
}

const ALLOWED_EVENTS = new Set(['page_view', 'cta_click', 'form_start', 'form_submit'])

export async function POST(request: Request) {
  if (!isAnalyticsIngestEnabled()) {
    return Response.json({ ok: true, disabled: true })
  }

  const expectedKey = process.env.ANALYTICS_INGEST_KEY
  const receivedKey = request.headers.get('x-analytics-key')

  if (!expectedKey || receivedKey !== expectedKey) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return Response.json({ ok: false, error: 'missing_supabase_env' }, { status: 500 })
  }

  let payload: TrackPayload
  try {
    payload = (await request.json()) as TrackPayload
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  if (!payload.eventType || !ALLOWED_EVENTS.has(payload.eventType)) {
    return Response.json({ ok: false, error: 'invalid_event_type' }, { status: 400 })
  }

  const pagePath = String(payload.pagePath || '/').slice(0, 240)
  const zoneId = payload.zoneId ? String(payload.zoneId).slice(0, 120) : null
  const sessionId = payload.sessionId ? String(payload.sessionId).slice(0, 120) : null
  const metadata = payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {}
  const metadataRecord = metadata as Record<string, unknown>
  const referrerRaw = typeof metadataRecord.referrer === 'string' ? metadataRecord.referrer : ''
  let referrerHost = 'directo'
  if (referrerRaw) {
    try {
      referrerHost = new URL(referrerRaw).hostname.toLowerCase()
    } catch {
      referrerHost = 'directo'
    }
  }

  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase()
  const region = request.headers.get('x-vercel-ip-country-region') || ''
  const city = request.headers.get('x-vercel-ip-city') || ''

  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host') || 'unknown'

  const response = await fetch(`${supabaseUrl}/rest/v1/site_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      site_host: host,
      page_path: pagePath,
      event_type: payload.eventType,
      zone_id: zoneId,
      x: typeof payload.x === 'number' ? payload.x : null,
      y: typeof payload.y === 'number' ? payload.y : null,
      viewport_w: typeof payload.viewportW === 'number' ? payload.viewportW : null,
      viewport_h: typeof payload.viewportH === 'number' ? payload.viewportH : null,
      session_id: sessionId,
      metadata: {
        ...metadata,
        referrerHost,
        country,
        region,
        city,
      },
    }),
  })

  if (!response.ok) {
    return Response.json({ ok: false, error: 'insert_failed' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
