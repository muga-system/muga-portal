import { NextResponse } from 'next/server'
import { resolveAccessContext } from '@/lib/access-resolver'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

const ALLOWED_STATUSES = new Set(['new', 'contacted', 'qualified', 'won', 'lost'])

function sanitizeReturnTo(value: FormDataEntryValue | null) {
  const raw = String(value || '').trim()
  if (!raw.startsWith('/admin')) return '/admin/analytics'
  return raw
}

function withStatusParam(path: string, status: string) {
  const url = new URL(path, 'https://muga.dev')
  url.searchParams.set('status_update', status)
  return `${url.pathname}${url.search}`
}

export async function POST(request: Request) {
  const access = await resolveAccessContext()
  const wantsJson =
    (request.headers.get('accept') || '').includes('application/json') ||
    (request.headers.get('x-requested-with') || '').toLowerCase() === 'fetch'

  if (access.role !== 'internal_admin') {
    if (wantsJson) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/ingreso-admin', request.url))
  }

  const formData = await request.formData()
  const returnTo = sanitizeReturnTo(formData.get('return_to'))
  const leadId = Number(formData.get('lead_id') || 0)
  const nextStatus = String(formData.get('status') || '').toLowerCase()

  if (!Number.isFinite(leadId) || leadId <= 0 || !ALLOWED_STATUSES.has(nextStatus)) {
    if (wantsJson) {
      return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
    }
    return NextResponse.redirect(new URL(withStatusParam(returnTo, 'invalid_payload'), request.url))
  }

  const supabase = createSupabaseAdminClient()
  const nowIso = new Date().toISOString()

  const { data: currentLead } = await supabase
    .from('leads')
    .select('first_contact_at')
    .eq('id', leadId)
    .maybeSingle()

  const payload =
    nextStatus === 'new'
      ? { status: nextStatus }
      : {
          status: nextStatus,
          last_contact_at: nowIso,
          first_contact_at: currentLead?.first_contact_at || nowIso,
        }

  const { error } = await supabase.from('leads').update(payload).eq('id', leadId)

  if (error) {
    if (wantsJson) {
      return NextResponse.json({ ok: false, error: 'update_failed' }, { status: 502 })
    }
    return NextResponse.redirect(new URL(withStatusParam(returnTo, 'update_failed'), request.url))
  }

  if (wantsJson) {
    return NextResponse.json({ ok: true, leadId, status: nextStatus })
  }

  return NextResponse.redirect(new URL(withStatusParam(returnTo, 'ok'), request.url))
}
