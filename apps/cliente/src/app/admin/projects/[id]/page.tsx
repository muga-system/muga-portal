import { redirect } from 'next/navigation'
import { getAdminProjectDetailHref } from '@/lib/admin-project-route'

interface LegacyAdminProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function LegacyAdminProjectPage({ params }: LegacyAdminProjectPageProps) {
  const { id } = await params
  redirect(getAdminProjectDetailHref(id))
}
