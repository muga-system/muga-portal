'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { getDemoSessionCookieName } from '@/lib/internal-access'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface AuthFormProps {
  initialEmail?: string
  showTokenAccess?: boolean
  showGoogleAccess?: boolean
  showPasswordReset?: boolean
  redirectPath?: string
}

export function AuthForm({
  initialEmail,
  showTokenAccess = true,
  showGoogleAccess = false,
  showPasswordReset = false,
  redirectPath = '/admin/leads',
}: AuthFormProps) {
  const [email, setEmail] = useState(initialEmail ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createSupabaseBrowserClient()
  const isDemoEnabled = process.env.NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN === 'true'

  const handleDemoAccess = () => {
    document.cookie = `${getDemoSessionCookieName()}=1; Path=/; Max-Age=2592000; SameSite=Lax`
    window.location.href = '/admin/leads'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      window.location.assign(redirectPath)
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Error de autenticacion'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleTokenAccess = async () => {
    setError(null)
    setMessage(null)

    if (!email.trim()) {
      setError('Ingresa tu email para recibir el enlace de acceso.')
      return
    }

    setLoading(true)

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/`
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectTo,
        },
      })

      if (otpError) {
        throw otpError
      }

      setMessage('Te enviamos un enlace de acceso. Si tu cuenta esta habilitada, podras entrar desde ese correo.')
    } catch (otpSubmitError) {
      const text = otpSubmitError instanceof Error ? otpSubmitError.message : 'No se pudo enviar el enlace de acceso'
      setError(text)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAccess = async () => {
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })

      if (oauthError) {
        throw oauthError
      }
    } catch (oauthSubmitError) {
      const rawText = oauthSubmitError instanceof Error ? oauthSubmitError.message : 'No se pudo iniciar sesión con Google'
      const text = rawText.includes('Unsupported provider')
        ? 'Google no está habilitado todavía en este entorno. Usa email y contraseña por ahora.'
        : rawText
      setError(text)
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setError(null)
    setMessage(null)

    if (!email.trim()) {
      setError('Ingresa tu email para enviarte el enlace de recuperación.')
      return
    }

    setLoading(true)

    try {
      const redirectTo = `${window.location.origin}/acceso`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

      if (resetError) throw resetError

      setMessage('Te enviamos un enlace para restablecer tu contraseña.')
    } catch (resetSubmitError) {
      const text = resetSubmitError instanceof Error ? resetSubmitError.message : 'No se pudo enviar el correo de recuperación'
      setError(text)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          spellCheck={false}
          className="muga-field mt-2 h-11 border border-white/15 px-3 text-sm text-white placeholder:text-white/45 transition-colors hover:border-white/25 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div>
        <Label htmlFor="password">
          Contraseña
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="muga-field mt-2 h-11 border border-white/15 px-3 pr-10 text-sm text-white placeholder:text-white/45 transition-colors hover:border-white/25 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/65 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert variant="success">
          <AlertTitle>Enlace enviado</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full gap-2 border border-primary/70 bg-primary px-6 text-sm font-semibold text-black shadow-none transition-colors hover:border-primary/80 hover:bg-primary/90"
      >
        {loading && <Loader2 size={16} className="animate-spin mr-2" />}
        Iniciar sesión
      </Button>

      {showGoogleAccess ? (
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          className="h-11 w-full border border-white/25 bg-transparent px-6 text-sm font-semibold text-white shadow-none transition-colors hover:border-white/45 hover:bg-white/5"
          onClick={handleGoogleAccess}
        >
          Continuar con Google
        </Button>
      ) : null}

      {showPasswordReset ? (
        <Button
          type="button"
          variant="ghost"
          disabled={loading}
          className="h-10 w-full text-xs font-semibold text-[var(--color-graylight)] hover:text-white"
          onClick={handlePasswordReset}
        >
          Olvidé mi contraseña
        </Button>
      ) : null}

      {showTokenAccess ? (
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          className="h-11 w-full border border-primary/55 bg-primary/10 px-6 text-sm font-semibold text-primary shadow-none transition-colors hover:border-primary/70 hover:bg-primary/16 hover:text-primary"
          onClick={handleTokenAccess}
        >
          {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
          Enviarme token de acceso
        </Button>
      ) : null}

      {isDemoEnabled ? (
        <>
          <div className="relative py-4">
            <Separator className="absolute inset-x-0 top-1/2" />
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">Modo demo interno</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full border border-primary/55 bg-primary/10 px-6 text-sm font-semibold text-primary shadow-none transition-colors hover:border-primary/70 hover:bg-primary/16 hover:text-primary"
            onClick={handleDemoAccess}
          >
            Entrar como admin demo
          </Button>
        </>
      ) : null}
    </form>
  )
}
