import { redirect } from 'next/navigation'

interface LoginPageProps {
  searchParams: Promise<{ invited?: string; email?: string; error?: string; next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })

  const suffix = params.toString()
  redirect(suffix ? `/acceso?${suffix}` : '/acceso')
}
