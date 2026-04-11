import { NextResponse } from 'next/server'
import { resolveAccessContext } from '@/lib/access-resolver'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export async function POST() {
  const access = await resolveAccessContext()

  if (access.role !== 'client_accepted' || !access.user) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseAdminClient()
  const nowIso = new Date().toISOString()

  const { error } = await supabase
    .from('clients')
    .update({
      portal_onboarding_seen_at: nowIso,
      portal_onboarding_version: 'v1',
      updated_at: nowIso,
    })
    .eq('auth_user_id', access.user.id)

  if (error) {
    return NextResponse.json({ ok: false, error: 'update_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, seenAt: nowIso })
}
