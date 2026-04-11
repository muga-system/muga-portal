'use client'

import { useState } from 'react'
import { Loader2, LogOut } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export function AccountBlockActions() {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
      window.location.assign('/acceso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex h-10 items-center gap-2 border border-white/20 px-3 text-xs font-semibold text-white hover:border-white/40 disabled:opacity-60"
    >
      {loading ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <LogOut size={14} aria-hidden="true" />}
      Cerrar sesion y reintentar
    </button>
  )
}
