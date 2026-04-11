import { redirect } from 'next/navigation'

export default function LegacyInternalLayout() {
  redirect('/admin/leads')
}
