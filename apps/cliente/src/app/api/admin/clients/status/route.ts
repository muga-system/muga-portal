import { NextResponse } from 'next/server'
import { resolveAccessContext } from '@/lib/access-resolver'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

const ALLOWED_PORTAL_STATUSES = new Set(['invited', 'accepted', 'disabled'])

export async function POST(request: Request) {
  const access = await resolveAccessContext()

  if (access.role !== 'internal_admin') {
    return NextResponse.redirect(new URL('/ingreso-admin', request.url))
  }

  const formData = await request.formData()
  const clientId = String(formData.get('client_id') || '').trim()
  const portalStatus = String(formData.get('portal_status') || '').toLowerCase().trim()

  if (!clientId || !ALLOWED_PORTAL_STATUSES.has(portalStatus)) {
    return NextResponse.redirect(new URL('/admin/clientes?clientError=invalid-payload', request.url))
  }

  const supabase = createSupabaseAdminClient()
  const payload =
    portalStatus === 'accepted'
      ? { portal_status: portalStatus, accepted_at: new Date().toISOString() }
      : { portal_status: portalStatus }

  const { error } = await supabase.from('clients').update(payload).eq('id', clientId)

  if (error) {
    return NextResponse.redirect(new URL('/admin/clientes?clientError=update-failed', request.url))
  }

  return NextResponse.redirect(new URL('/admin/clientes?clientUpdated=1', request.url))
}
