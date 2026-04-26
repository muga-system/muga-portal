import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id: projectId } = await params
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const stage = String(formData.get('stage') || '').trim()
  const kind = String(formData.get('kind') || 'entregable').trim()

  const cookieStore = await cookies()
  const supabaseAdmin = createSupabaseAdminClient()

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'text/plain', 'text/csv',
    'application/zip', 'application/x-zip-compressed',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  const maxSize = 50 * 1024 * 1024

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
  }

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath = `projects/${projectId}/${kind}/${fileName}`

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('project-files')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[FileUpload] Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('project-files')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    const { error: dbError } = await supabaseAdmin.from('project_files').insert({
      project_id: projectId,
      stage_key: stage || 'brief',
      file_kind: kind,
      file_name: file.name,
      file_path: publicUrl,
      uploaded_by: cookieStore.get('appAuthUserId')?.value || null,
    })

    if (dbError) {
      console.error('[FileUpload] DB insert error:', dbError)
      await supabaseAdmin.storage.from('project-files').remove([filePath])
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      filePath: publicUrl,
      fileName: file.name,
    })
  } catch (err) {
    console.error('[FileUpload] Unexpected error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}