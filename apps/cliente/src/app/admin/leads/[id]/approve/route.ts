import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { approveLeadAndProvisionAccess } from '@/lib/client-onboarding'
import { resolveAccessContext } from '@/lib/access-resolver'
import { getDemoSessionCookieName, hasDemoInternalSession, isInternalEmail } from '@/lib/internal-access'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params
  const leadId = Number(id)

  if (!Number.isFinite(leadId) || leadId <= 0) {
    return NextResponse.redirect(new URL('/admin/leads?leadError=invalid-id', request.url))
  }

  const [access, cookieStore] = await Promise.all([
    resolveAccessContext(),
    cookies(),
  ])
  const isDemoSession = hasDemoInternalSession(cookieStore.get(getDemoSessionCookieName())?.value)

  let approvedByUserId: string | null = null

  if (access.role === 'internal_admin' && access.user?.id) {
    approvedByUserId = access.user.id
  } else if (isDemoSession) {
    const supabaseAdmin = createSupabaseAdminClient()
    const { data: adminProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', 'dicoratojuanpablo@gmail.com')
      .maybeSingle()

    approvedByUserId = adminProfile?.id ?? null
  }

  if (!approvedByUserId) {
    return NextResponse.redirect(new URL('/acceso', request.url))
  }

  const supabaseAdmin = createSupabaseAdminClient()
  const { data: leadProbe, error: leadProbeError } = await supabaseAdmin
    .from('leads')
    .select('email')
    .eq('id', leadId)
    .maybeSingle()

  if (leadProbeError || !leadProbe) {
    return NextResponse.redirect(new URL('/admin/leads?leadError=lead-not-found', request.url))
  }

  if (isInternalEmail(leadProbe.email || '')) {
    return NextResponse.redirect(new URL('/admin/leads?leadError=internal-email-blocked', request.url))
  }

  const result = await approveLeadAndProvisionAccess({
    leadId,
    approvedByUserId,
  })

  if (!result) {
    return NextResponse.redirect(new URL('/admin/leads?leadError=approve-failed', request.url))
  }

  return NextResponse.redirect(new URL(`/admin/leads?leadApproved=${leadId}&projectId=${result.projectId}`, request.url))
}
