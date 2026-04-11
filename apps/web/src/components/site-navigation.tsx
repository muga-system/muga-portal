"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type NavItem = {
  label: string
  href: string
  external?: boolean
}

const navItems: NavItem[] = [
  { label: "Formatos", href: "/formatos" },
  { label: "Modelo", href: "/modelo" },
  { label: "Blog", href: "https://muga-blog.vercel.app/", external: true },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
]

const casesItem: NavItem = {
  label: "Referencias",
  href: "/casos",
}

export function SiteNavigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null)
  const mobileCloseButtonRef = useRef<HTMLButtonElement | null>(null)
  const mobileMenuPanelRef = useRef<HTMLDivElement | null>(null)

  const isActive = (href: string) => (href === "/contacto" ? pathname.startsWith("/contacto") : pathname === href)

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = ""
      return
    }

    const triggerElement = mobileMenuButtonRef.current

    document.body.style.overflow = "hidden"

    const focusTimer = window.setTimeout(() => {
      mobileCloseButtonRef.current?.focus()
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = ""
      triggerElement?.focus()
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false)
        return
      }

      if (event.key !== "Tab") return

      const panel = mobileMenuPanelRef.current
      if (!panel) return

      const focusableElements = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
        return
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [mobileOpen])

  return (
    <header
      id="navbar"
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
    >
      <div
        className="navbar-scrolled mx-auto w-full border-b border-white/10 sm:border-x sm:border-white/10"
        style={{ width: "var(--layout-frame-width)" }}
      >
        <nav aria-label="Global" className="page-container flex h-[var(--layout-nav-height)] items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center justify-start">
              <Link href="/">
                <span className="sr-only">MUGA</span>
                <Image src="/logo/logo.png" alt="" width={32} height={32} priority className="h-8 w-8" />
              </Link>
            </div>

            <div className="ml-2 hidden items-center lg:flex lg:gap-x-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obscure)] ${
                    isActive(item.href) ? "text-white" : "text-[var(--color-graylight)] hover:text-white"
                  } ${index > 0 ? "ml-4" : ""}`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex lg:hidden">
            <button
              ref={mobileMenuButtonRef}
              id="mobile-menu-button"
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obscure)]"
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden="true">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href={casesItem.href}
              className={`flex items-center text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obscure)] ${
                isActive(casesItem.href) ? "text-white" : "text-[var(--color-graylight)] hover:text-white"
              }`}
              aria-current={isActive(casesItem.href) ? "page" : undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              {casesItem.label} <span aria-hidden="true" className="ml-1">&rarr;</span>
            </Link>
          </div>
        </nav>
      </div>

      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu principal"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-[var(--color-obscure)] lg:hidden ${mobileOpen ? "block" : "hidden"}`}
      >
        <div
          ref={mobileMenuPanelRef}
          onClick={(event) => event.stopPropagation()}
          className="fixed inset-y-0 right-0 w-full overflow-y-auto overscroll-contain bg-[var(--color-obscure)] sm:max-w-sm sm:ring-1 sm:ring-white/10"
        >
          <div className="flex h-[var(--layout-nav-height)] items-center justify-between px-6">
            <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
              <span className="sr-only">MUGA</span>
              <Image src="/logo/logo.png" alt="" width={32} height={32} priority className="h-8 w-8" />
            </Link>
            <button
              ref={mobileCloseButtonRef}
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obscure)]"
              onClick={() => setMobileOpen(false)}
            >
              <span className="sr-only">Cerrar menú</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden="true">
                <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-6 flow-root px-6 pb-6">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obscure)]"
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href={casesItem.href}
                  className="flex items-center rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obscure)]"
                  aria-current={isActive(casesItem.href) ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  {casesItem.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
