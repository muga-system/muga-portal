import { redirect } from 'next/navigation'

export default async function PreviewPage() {
  redirect('/admin/leads')
}
