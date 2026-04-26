import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { resolveAccessContext } from '@/lib/access-resolver'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const { slug } = await params
  const access = await resolveAccessContext()

  if (access.role === 'guest' || !access.user || !access.clientId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseAdminClient()

  const { data: invite, error: inviteError } = await supabase
    .from('client_portal_invites')
    .select('id, client_id')
    .eq('slug', slug)
    .is('used_at', null)
    .gte('token_expires_at', new Date().toISOString())
    .maybeSingle()

  if (inviteError || !invite) {
    return NextResponse.json({ error: 'Invite not found or expired' }, { status: 404 })
  }

  if (invite.client_id !== access.clientId) {
    return NextResponse.json({ error: 'Invite does not match this client' }, { status: 403 })
  }

  const { error: updateError } = await supabase
    .from('clients')
    .update({
      portal_status: 'accepted',
      accepted_at: new Date().toISOString(),
    })
    .eq('id', access.clientId)

  if (updateError) {
    console.error('[AcceptInvite] Failed to update client status:', updateError)
    return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}