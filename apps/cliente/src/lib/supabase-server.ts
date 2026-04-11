import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface CreateSupabaseServerClientOptions {
  writeCookies?: boolean
}

export async function createSupabaseServerClient(
  options: CreateSupabaseServerClientOptions = {}
) {
  const cookieStore = await cookies()
  const writeCookies = options.writeCookies ?? false

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          if (!writeCookies || typeof cookieStore.set !== 'function') {
            return
          }

          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}
