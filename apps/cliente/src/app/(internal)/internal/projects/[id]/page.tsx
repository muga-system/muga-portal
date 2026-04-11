import { redirect } from 'next/navigation'
import { getAdminProjectDetailHref } from '@/lib/admin-project-route'

interface LegacyInternalProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function LegacyInternalProjectPage({ params }: LegacyInternalProjectPageProps) {
  const { id } = await params
  redirect(getAdminProjectDetailHref(id))
}
