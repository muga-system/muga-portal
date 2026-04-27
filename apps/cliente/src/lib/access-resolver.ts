import type { User } from '@supabase/supabase-js'
import { isInternalEmail } from '@/lib/internal-access'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export type AccessRole = 'guest' | 'internal_admin' | 'client_pending' | 'client_accepted'

export interface AccessContext {
  role: AccessRole
  user: User | null
  clientId: string | null
}

function getPortalStatus(value: string | null | undefined): 'invited' | 'accepted' | 'disabled' {
  if (value === 'accepted' || value === 'disabled') {
    return value
  }

  return 'invited'
}

const getServerUser = async (): Promise<User | null> => {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export const resolveAccessContext = async (): Promise<AccessContext> => {
  const user = await getServerUser()

  if (!user) {
    return {
      role: 'guest',
      user: null,
      clientId: null,
    }
  }

  if (isInternalEmail(user.email)) {
    return {
      role: 'internal_admin',
      user,
      clientId: null,
    }
  }

  const supabase = await createSupabaseServerClient()

  try {
    const userEmail = (user.email || '').trim().toLowerCase()

    const byAuthUserResponse = await supabase
      .from('clients')
      .select('id, portal_status, auth_user_id, email')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    let client = byAuthUserResponse.data

    if (!client && userEmail) {
      const byEmailResponse = await supabase
        .from('clients')
        .select('id, portal_status, auth_user_id, email')
        .ilike('email', userEmail)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      client = byEmailResponse.data

      if (client && (!client.auth_user_id || client.auth_user_id !== user.id)) {
        await supabase
          .from('clients')
          .update({ auth_user_id: user.id, updated_at: new Date().toISOString() })
          .eq('id', client.id)
      }
    }

    if (!client) {
      return {
        role: 'client_pending',
        user,
        clientId: null,
      }
    }

    const portalStatus = getPortalStatus(client.portal_status)

    return {
      role: portalStatus === 'accepted' ? 'client_accepted' : 'client_pending',
      user,
      clientId: client.id,
    }
  } catch (error) {
    console.error('[access-resolver] Unexpected error:', error)
    return {
      role: 'guest',
      user,
      clientId: null,
    }
  }
}

export function getHomePathByRole(role: AccessRole) {
  if (role === 'internal_admin') {
    return '/admin'
  }

  if (role === 'client_accepted') {
    return '/portal'
  }

  return '/acceso'
}
