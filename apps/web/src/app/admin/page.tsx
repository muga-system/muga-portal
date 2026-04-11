import { redirect } from "next/navigation"
import { getClientAppUrl } from "@/lib/client-app-url"

export default function AdminRedirectPage() {
  redirect(`${getClientAppUrl()}/ingreso-admin`)
}
