"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const labels: Record<string, string> = {
  "/contacto": "Contacto",
  "/contacto/enviado": "Consulta enviada",
  "/modelo": "Modelo",
  "/formatos": "Formatos",
  "/casos": "Referencias",
  "/criterios": "Criterios",
  "/nosotros": "Nosotros",
  "/privacidad": "Privacidad",
  "/cookies": "Cookies y analítica",
  "/terminos": "Términos",
}

function getBreadcrumbLabel(pathname: string): string | null {
  return labels[pathname] ?? null
}

export function SiteBreadcrumb() {
  const pathname = usePathname()
  const label = getBreadcrumbLabel(pathname)

  if (!label) return null

  return (
    <nav
      id="breadcrumb"
      aria-label="Breadcrumb"
      className="fixed left-0 right-0 top-[var(--layout-nav-height)] z-40 m-0 hidden md:block"
    >
      <div
        className="navbar-scrolled mx-auto w-full border-b border-white/10 sm:border-x sm:border-white/10"
        style={{ width: "var(--layout-frame-width)" }}
      >
        <ol className="page-container flex h-[var(--layout-breadcrumb-height)] items-center gap-2 text-sm">
          <li className="flex items-center gap-2">
            <Link href="/" className="text-[var(--color-graylight)] hover:text-white">
              Inicio
            </Link>
            <span className="text-gray-500">/</span>
          </li>
          <li>
            <Link href={pathname} className="font-medium text-white" aria-current="page">
              {label}
            </Link>
          </li>
        </ol>
      </div>
    </nav>
  )
}
