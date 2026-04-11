import { redirect } from 'next/navigation'

interface InviteAccessPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ inv?: string }>
}

export default async function InviteAccessPage({ params, searchParams }: InviteAccessPageProps) {
  await params
  await searchParams
  redirect('/acceso?error=token-disabled')
}
