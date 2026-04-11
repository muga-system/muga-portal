import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAdminProjectDetailHref } from '@/lib/admin-project-route'
import { resolveAccessContext } from '@/lib/access-resolver'
import { getDemoSessionCookieName, hasDemoInternalSession } from '@/lib/internal-access'
import { PROJECT_STAGE_KEYS } from '@/lib/portal-constants'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { ProjectStageKey } from '@/types/portal'

interface RouteParams {
  params: Promise<{ id: string }>
}

type FileKind = 'brief' | 'asset' | 'entregable'

function isValidStage(value: string): value is ProjectStageKey {
  return PROJECT_STAGE_KEYS.includes(value as ProjectStageKey)
}

function isValidKind(value: string): value is FileKind {
  return value === 'brief' || value === 'asset' || value === 'entregable'
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id: projectId } = await params
  const formData = await request.formData()
  const fileName = String(formData.get('fileName') || '').trim()
  const stageRaw = String(formData.get('stage') || '').trim()
  const kindRaw = String(formData.get('kind') || '').trim()
  const filePath = String(formData.get('filePath') || '').trim()

  const [supabase, cookieStore, access] = await Promise.all([
    createSupabaseServerClient(),
    cookies(),
    resolveAccessContext(),
  ])
  const isDemoSession = hasDemoInternalSession(cookieStore.get(getDemoSessionCookieName())?.value)

  if (access.role === 'guest') {
    if (isDemoSession) {
      return NextResponse.redirect(new URL(`${getAdminProjectDetailHref(projectId)}?fileAdded=1&demo=1`, request.url))
    }

    return NextResponse.redirect(new URL('/acceso', request.url))
  }

  if (access.role === 'client_pending') {
    return NextResponse.redirect(new URL('/acceso', request.url))
  }

  const isInternal = access.role === 'internal_admin'
  const redirectBase = isInternal ? getAdminProjectDetailHref(projectId) : '/portal'

  if (!fileName || !isValidStage(stageRaw) || !isValidKind(kindRaw)) {
    return NextResponse.redirect(new URL(`${redirectBase}?error=file-invalid`, request.url))
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

  const { error: fileError } = await supabase.from('project_files').insert({
    project_id: projectId,
    stage_key: stageRaw,
    file_kind: kindRaw,
    file_name: fileName,
    file_path: filePath || null,
    uploaded_by: access.user?.id,
  })

  if (fileError) {
    return NextResponse.redirect(new URL(`${redirectBase}?error=file-failed`, request.url))
  }

  await supabase.from('project_activity').insert({
    project_id: projectId,
    actor_user_id: access.user?.id,
    event_type: 'file_upload',
    title: isInternal ? 'Nuevo archivo registrado' : 'Archivo cargado por cliente',
    description: fileName,
    metadata: {
      stage: stageRaw,
      kind: kindRaw,
      file_path: filePath || null,
    },
  })

  return NextResponse.redirect(new URL(`${redirectBase}?fileAdded=1`, request.url))
}
