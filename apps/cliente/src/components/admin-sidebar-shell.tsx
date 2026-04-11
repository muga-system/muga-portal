'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronRight, DoorOpen, LogOut, Menu, X } from 'lucide-react'
import { AdminSidebarNav } from '@/components/admin-sidebar-nav'
import type { AdminNavItem } from '@/lib/admin-nav'
import { cn } from '@/lib/utils'

interface AdminSidebarShellProps {
  items: AdminNavItem[]
  sectionLabel?: string
  baseSegment?: string
  homeHref?: string
  sectionIcon?: 'door-open'
  contentClassName?: string
  children: React.ReactNode
}

export function AdminSidebarShell({
  items,
  sectionLabel = 'Admin',
  baseSegment = 'admin',
  homeHref = '/admin/leads',
  sectionIcon,
  contentClassName,
  children,
}: AdminSidebarShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const breadcrumb = (() => {
    const segments = pathname.split('/').filter(Boolean)
    const baseIndex = segments.indexOf(baseSegment)
    const tail = baseIndex >= 0 ? segments.slice(baseIndex + 1) : segments

    const labels = [sectionLabel]
    tail.forEach((segment, index) => {
      if (!segment) return

      if (tail[0] === 'proyectos' && index === 1) {
        labels.push('Detalle')
        return
      }

      const isIdLike = /^\d+$/.test(segment) || /^[a-f0-9-]{8,}$/i.test(segment)
      if (isIdLike) {
        labels.push('Detalle')
        return
      }
      const label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
      labels.push(label)
    })
    return labels
  })()

  useEffect(() => {
    if (!mobileOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [mobileOpen])

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="muga-auth-trama muga-auth-trama--left hidden sm:block" aria-hidden="true" />
      <div className="muga-auth-trama muga-auth-trama--right hidden sm:block" aria-hidden="true" />

      <header className="muga-admin-topbar fixed inset-x-0 top-0 z-50">
        <div className="muga-admin-topbar-frame page-container mx-auto max-w-[var(--layout-frame-width)] border-x border-white/10">
          <div className="flex h-12 items-center justify-between">
            <div className="flex h-12 min-w-0 items-center">
              <Link href={homeHref} className="inline-flex h-12 w-12 items-center justify-center border-r border-white/10" aria-label={`Ir a ${sectionLabel.toLowerCase()}`}>
                <Image src="/favicon.svg" alt="MUGA" width={20} height={20} className="h-5 w-5" />
              </Link>
              <div className="flex h-12 min-w-0 items-center border-r border-white/10 px-4">
                <div className="flex min-w-0 items-center gap-2 text-xs tracking-[0.06em] text-[var(--color-graylight)]">
                  {breadcrumb.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex min-w-0 items-center gap-2">
                      {index > 0 ? <ChevronRight size={12} aria-hidden="true" className="opacity-60" /> : null}
                      {index === 0 && sectionIcon === 'door-open' ? <DoorOpen size={12} aria-hidden="true" className="opacity-80" /> : null}
                      <span className={index === breadcrumb.length - 1 ? 'truncate text-white' : 'truncate'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="mr-3 inline-flex h-9 w-9 items-center justify-center border border-white/20 text-white lg:hidden"
              aria-label="Abrir navegación"
            >
              <Menu size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Cerrar navegación"
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="page-container mx-auto min-h-screen max-w-[var(--layout-frame-width)] border-x border-white/10 pt-12">
        <div className="flex min-h-screen flex-col">
          <div className="grid flex-1 items-start lg:grid-cols-[252px_minmax(0,1fr)]">
          <aside
            className={`muga-admin-sidebar fixed top-12 bottom-0 left-0 z-40 w-[272px] border-r border-white/10 px-5 pt-0 pb-0 transform-gpu transition-transform duration-300 ease-out lg:sticky lg:top-12 lg:z-20 lg:h-[calc(100vh-3rem)] lg:w-auto lg:translate-x-0 lg:border-b-0 lg:border-r lg:px-5 lg:pt-0 lg:pb-0 lg:flex lg:flex-col ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            aria-hidden={!mobileOpen && undefined}
          >
            <div className="mb-3 flex items-center justify-end lg:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center border border-white/20 text-white"
                aria-label="Cerrar navegación"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>
            <div className="muga-admin-nav-zone mt-0 -mx-5 lg:flex-1">
              <AdminSidebarNav items={items} onNavigate={() => setMobileOpen(false)} />
            </div>

            <div className="muga-admin-nav-zone muga-admin-sidebar-footer -mx-5 mt-0 border-t border-white/10 lg:mt-auto">
              <Link
                href="/logout"
                className="muga-admin-nav-link muga-admin-nav-link--logout muga-admin-nav-link--danger h-full"
                data-active="false"
                onClick={() => setMobileOpen(false)}
                style={{ textTransform: 'none' }}
              >
                <LogOut size={15} aria-hidden="true" />
                <span style={{ textTransform: 'capitalize' }}>Cerrar sesion</span>
              </Link>
            </div>
          </aside>

            <div className={cn('muga-admin-content min-w-0 p-4 sm:p-5 md:p-6 lg:pb-0', contentClassName)}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
