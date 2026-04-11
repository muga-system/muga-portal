import { NextResponse } from 'next/server'
import { resolveAccessContext } from '@/lib/access-resolver'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

function sanitizeReturnTo(value: FormDataEntryValue | null) {
  const raw = String(value || '').trim()
  if (!raw.startsWith('/admin')) return '/admin/leads'
  return raw
}

function withStatusParam(path: string, status: string) {
  const url = new URL(path, 'https://muga.dev')
  url.searchParams.set('followup_update', status)
  return `${url.pathname}${url.search}`
}

export async function POST(request: Request) {
  const access = await resolveAccessContext()
  const wantsJson =
    (request.headers.get('accept') || '').includes('application/json') ||
    (request.headers.get('x-requested-with') || '').toLowerCase() === 'fetch'

  if (access.role !== 'internal_admin') {
    if (wantsJson) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    return NextResponse.redirect(new URL('/ingreso-admin', request.url))
  }

  const formData = await request.formData()
  const returnTo = sanitizeReturnTo(formData.get('return_to'))
  const leadId = Number(formData.get('lead_id') || 0)
  const nextAction = String(formData.get('next_action') || '').trim()
  const nextActionAtRaw = String(formData.get('next_action_at') || '').trim()

  if (!Number.isFinite(leadId) || leadId <= 0) {
    if (wantsJson) return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
    return NextResponse.redirect(new URL(withStatusParam(returnTo, 'invalid_payload'), request.url))
  }

  if (nextAction.length > 280) {
    if (wantsJson) return NextResponse.json({ ok: false, error: 'next_action_too_long' }, { status: 400 })
    return NextResponse.redirect(new URL(withStatusParam(returnTo, 'next_action_too_long'), request.url))
  }

  let nextActionAt: string | null = null

  if (nextActionAtRaw) {
    const parsed = new Date(nextActionAtRaw)
    if (Number.isNaN(parsed.getTime())) {
      if (wantsJson) return NextResponse.json({ ok: false, error: 'invalid_next_action_at' }, { status: 400 })
      return NextResponse.redirect(new URL(withStatusParam(returnTo, 'invalid_next_action_at'), request.url))
    }
    nextActionAt = parsed.toISOString()
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('leads')
    .update({
      next_action: nextAction || null,
      next_action_at: nextActionAt,
      last_contact_at: new Date().toISOString(),
    })
    .eq('id', leadId)

  if (error) {
    if (wantsJson) return NextResponse.json({ ok: false, error: 'update_failed' }, { status: 502 })
    return NextResponse.redirect(new URL(withStatusParam(returnTo, 'update_failed'), request.url))
  }

  if (wantsJson) return NextResponse.json({ ok: true, leadId })
  return NextResponse.redirect(new URL(withStatusParam(returnTo, 'ok'), request.url))
}
