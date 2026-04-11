import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { resolveAccessContext } from '@/lib/access-resolver'
import { getAdminProjectDetailHref } from '@/lib/admin-project-route'
import { getDemoSessionCookieName, hasDemoInternalSession } from '@/lib/internal-access'
import { DELIVERABLE_STATUS_LABELS, DELIVERABLE_STATUS_KEYS } from '@/lib/portal-constants'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { DeliverableStatus } from '@/types/portal'

interface RouteParams {
  params: Promise<{ id: string; deliverableId: string }>
}

function isValidStatus(status: string): status is DeliverableStatus {
  return DELIVERABLE_STATUS_KEYS.includes(status as DeliverableStatus)
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id: projectId, deliverableId } = await params
  const formData = await request.formData()
  const nextStatusRaw = String(formData.get('status') || '')

  const [supabase, cookieStore, access] = await Promise.all([
    createSupabaseServerClient(),
    cookies(),
    resolveAccessContext(),
  ])
  const isDemoSession = hasDemoInternalSession(cookieStore.get(getDemoSessionCookieName())?.value)

  if (access.role === 'guest') {
    if (isDemoSession) {
      return NextResponse.redirect(new URL(`${getAdminProjectDetailHref(projectId)}?updated=1&demo=1`, request.url))
    }

    return NextResponse.redirect(new URL('/acceso', request.url))
  }

  if (access.role !== 'internal_admin') {
    return NextResponse.redirect(new URL('/portal', request.url))
  }

  if (!isValidStatus(nextStatusRaw)) {
    return NextResponse.redirect(new URL(`${getAdminProjectDetailHref(projectId)}?error=invalid-status`, request.url))
  }

  const nextStatus = nextStatusRaw

  const { error: updateError } = await supabase
    .from('deliverables')
    .update({
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', deliverableId)
    .eq('project_id', projectId)

  if (updateError) {
    return NextResponse.redirect(new URL(`${getAdminProjectDetailHref(projectId)}?error=update-failed`, request.url))
  }

  await supabase.from('project_activity').insert({
    project_id: projectId,
    actor_user_id: access.user?.id,
    event_type: 'deliverable_status_change',
    title: 'Estado de entregable actualizado',
    description: `Nuevo estado: ${DELIVERABLE_STATUS_LABELS[nextStatus]}`,
    metadata: {
      deliverable_id: deliverableId,
      status: nextStatus,
    },
  })

  return NextResponse.redirect(new URL(`${getAdminProjectDetailHref(projectId)}?updated=1`, request.url))
}
