import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAdminProjectDetailHref } from '@/lib/admin-project-route'
import { resolveAccessContext } from '@/lib/access-resolver'
import { getDemoSessionCookieName, hasDemoInternalSession } from '@/lib/internal-access'
import { createSupabaseServerClient } from '@/lib/supabase-server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id: projectId } = await params
  const formData = await request.formData()
  const message = String(formData.get('message') || '').trim()
  const deliverableIdRaw = String(formData.get('deliverableId') || '').trim()
  const deliverableId = deliverableIdRaw === 'none' ? '' : deliverableIdRaw

  const [supabase, cookieStore, access] = await Promise.all([
    createSupabaseServerClient(),
    cookies(),
    resolveAccessContext(),
  ])
  const isDemoSession = hasDemoInternalSession(cookieStore.get(getDemoSessionCookieName())?.value)

  if (access.role === 'guest') {
    if (isDemoSession) {
      return NextResponse.redirect(new URL(`${getAdminProjectDetailHref(projectId)}?commented=1&demo=1`, request.url))
    }

    return NextResponse.redirect(new URL('/acceso', request.url))
  }

  if (access.role === 'client_pending') {
    return NextResponse.redirect(new URL('/acceso', request.url))
  }

  const isInternal = access.role === 'internal_admin'
  const redirectBase = isInternal ? getAdminProjectDetailHref(projectId) : '/portal'

  if (!message) {
    return NextResponse.redirect(new URL(`${redirectBase}?error=empty-comment`, request.url))
  }

  if (!isInternal) {
    const { data: clientProject } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('client_id', access.clientId)
      .maybeSingle()

    if (!clientProject) {
      return NextResponse.redirect(new URL('/portal?error=forbidden', request.url))
    }
  }

  const { error: commentError } = await supabase.from('project_comments').insert({
    project_id: projectId,
    deliverable_id: deliverableId || null,
    author_user_id: access.user?.id,
    author_role: isInternal ? 'muga' : 'cliente',
    content: message,
  })

  if (commentError) {
    return NextResponse.redirect(new URL(`${redirectBase}?error=comment-failed`, request.url))
  }

  await supabase.from('project_activity').insert({
    project_id: projectId,
    actor_user_id: access.user?.id,
    event_type: 'comment',
    title: isInternal ? 'Nuevo comentario interno' : 'Nuevo comentario de cliente',
    description: message,
    metadata: {
      deliverable_id: deliverableId || null,
    },
  })

  return NextResponse.redirect(new URL(`${redirectBase}?commented=1`, request.url))
}
