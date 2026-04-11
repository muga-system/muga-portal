'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface AdminDocScrollProps {
  children: React.ReactNode
  footerText?: string
}

export function AdminDocScroll({ children, footerText }: AdminDocScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [thumbTop, setThumbTop] = useState(0)
  const [thumbHeight, setThumbHeight] = useState(36)
  const [canScroll, setCanScroll] = useState(false)
  const [panelHeight, setPanelHeight] = useState<number | null>(null)

  const getFooterHeightPx = () => {
    if (typeof window === 'undefined') return 48
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--muga-admin-sidebar-footer-height').trim()
    if (!raw) return 48

    if (raw.endsWith('px')) {
      const parsed = Number.parseFloat(raw.replace('px', '').trim())
      return Number.isFinite(parsed) ? parsed : 48
    }

    if (raw.endsWith('rem')) {
      const rem = Number.parseFloat(raw.replace('rem', '').trim())
      const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize || '16') || 16
      return Number.isFinite(rem) ? rem * rootSize : 48
    }

    const parsed = Number.parseFloat(raw)
    return Number.isFinite(parsed) ? parsed : 48
  }

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const syncHeight = () => {
      const bounds = node.getBoundingClientRect()
      const available = window.innerHeight - bounds.top
      const next = Math.max(260, Math.floor(available))
      setPanelHeight(next)
    }

    syncHeight()
    window.addEventListener('resize', syncHeight)
    window.addEventListener('scroll', syncHeight, { passive: true })
    const resizeObserver = new ResizeObserver(syncHeight)
    resizeObserver.observe(node)

    return () => {
      window.removeEventListener('resize', syncHeight)
      window.removeEventListener('scroll', syncHeight)
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const node = viewportRef.current
    if (!node) return

    const sync = () => {
      const viewportHeight = node.clientHeight
      const footerHeight = getFooterHeightPx()
      const visibleHeight = Math.max(0, viewportHeight - footerHeight)
      const fullHeight = node.scrollHeight
      const scrollable = Math.max(fullHeight - viewportHeight, 0)

      if (scrollable <= 0 || visibleHeight <= 0) {
        setCanScroll(false)
        setThumbTop(0)
        setThumbHeight(36)
        return
      }

      setCanScroll(true)

      const ratio = visibleHeight / fullHeight
      const nextThumbHeight = Math.max(30, Math.floor(visibleHeight * ratio))
      const trackTravel = Math.max(visibleHeight - nextThumbHeight, 0)
      const progress = scrollable > 0 ? node.scrollTop / scrollable : 0
      const nextTop = Math.floor(progress * trackTravel)

      setThumbHeight(nextThumbHeight)
      setThumbTop(nextTop)
    }

    sync()
    node.addEventListener('scroll', sync, { passive: true })
    const resizeObserver = new ResizeObserver(sync)
    resizeObserver.observe(node)

    return () => {
      node.removeEventListener('scroll', sync)
      resizeObserver.disconnect()
    }
  }, [])

  const thumbStyle = useMemo(
    () => ({
      height: `${thumbHeight}px`,
      transform: `translateY(${thumbTop}px)`,
    }),
    [thumbHeight, thumbTop]
  )

  return (
    <div
      ref={containerRef}
      className="relative"
      style={panelHeight ? { height: `${panelHeight}px` } : undefined}
    >
      <div
        ref={viewportRef}
        className="muga-doc-scroll-native-hidden h-full overflow-auto bg-[var(--color-obscure)] px-3 py-0 pr-4 md:px-4 md:pr-5"
        style={{ paddingBottom: 'calc(var(--muga-admin-sidebar-footer-height) + 0.75rem)' }}
      >
        <div className="space-y-4">{children}</div>
      </div>

      <div
        className="muga-doc-scroll-track pointer-events-none absolute right-0 top-0 w-3"
        style={{ bottom: 'var(--muga-admin-sidebar-footer-height)' }}
      >
        {canScroll ? <div className="muga-doc-scroll-thumb absolute left-0 top-0 w-full" style={thumbStyle} /> : null}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center border-t border-white/10 bg-[var(--color-obscure)] px-3 text-xs text-[var(--color-graylight)] md:px-4"
        style={{ height: 'var(--muga-admin-sidebar-footer-height)' }}
      >
        <span className="block w-full truncate">{footerText || 'Lectura tecnica de documentacion'}</span>
      </div>
    </div>
  )
}
