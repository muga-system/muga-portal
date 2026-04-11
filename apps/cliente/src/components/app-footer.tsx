"use client"

import { usePathname } from "next/navigation"

export function AppFooter() {
  const pathname = usePathname()

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/acceso" ||
    pathname === "/ingreso-admin" ||
    pathname.startsWith('/admin')
  ) {
    return null
  }

  return (
    <footer className="muga-app-footer muga-shell-divider mt-auto">
      <div className="page-container flex w-full max-w-7xl items-center justify-between gap-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-graylight)]">Muga</p>
          <p className="text-xs text-[var(--color-graylight)]">Portal interno de proyectos</p>
        </div>
        <p className="text-xs text-[var(--color-graylight)]">Extensión visual de muga.dev</p>
      </div>
    </footer>
  )
}
