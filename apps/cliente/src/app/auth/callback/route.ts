import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const inviteAccepted = searchParams.get('invite') === 'accepted'

  if (code) {
    const supabase = await createSupabaseServerClient({ writeCookies: true })
    const { error, data: { user } } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      if (inviteAccepted) {
        const supabaseAdmin = createSupabaseAdminClient()
        
        const { data: client } = await supabase
          .from('clients')
          .select('id, portal_status')
          .eq('auth_user_id', user.id)
          .maybeSingle()

        if (client && client.portal_status === 'invited') {
          await supabaseAdmin
            .from('clients')
            .update({
              portal_status: 'accepted',
              accepted_at: new Date().toISOString(),
            })
            .eq('id', client.id)
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/acceso?error=auth_error`)
}
