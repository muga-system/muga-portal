'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const SESSION_KEY = 'muga_analytics_session'

function getSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const generated = crypto.randomUUID()
  window.sessionStorage.setItem(SESSION_KEY, generated)
  return generated
}

function sendEvent(payload: {
  eventType: 'page_view' | 'cta_click' | 'form_start' | 'form_submit'
  pagePath: string
  zoneId?: string
  x?: number
  y?: number
  metadata?: Record<string, unknown>
}) {
  const ingestKey = process.env.NEXT_PUBLIC_ANALYTICS_INGEST_KEY
  if (!ingestKey) return

  const body = {
    ...payload,
    viewportW: window.innerWidth,
    viewportH: window.innerHeight,
    sessionId: getSessionId(),
    metadata: payload.metadata || {},
  }

  fetch('/api/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-analytics-key': ingestKey,
    },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // noop on purpose: analytics should never block UX
  })
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isEnabled = process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_CLIENT === 'true'

  useEffect(() => {
    if (!isEnabled) return
    const query = searchParams.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname
    sendEvent({
      eventType: 'page_view',
      pagePath,
      metadata: {
        referrer: document.referrer || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
        locale: navigator.language || '',
      },
    })
  }, [isEnabled, pathname, searchParams])

  useEffect(() => {
    if (!isEnabled) return

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const zoneElement = target.closest<HTMLElement>('[data-track-zone]')
      if (!zoneElement) return

      const zoneId = zoneElement.dataset.trackZone || 'unknown'
      const linkTarget = target.closest<HTMLAnchorElement>('a[href]')
      const x = window.innerWidth > 0 ? Number((event.clientX / window.innerWidth).toFixed(4)) : undefined
      const y = window.innerHeight > 0 ? Number((event.clientY / window.innerHeight).toFixed(4)) : undefined

      sendEvent({
        eventType: 'cta_click',
        pagePath: window.location.pathname,
        zoneId,
        x,
        y,
        metadata: {
          destination: linkTarget?.href || '',
          label: zoneElement.textContent?.trim().slice(0, 120) || '',
        },
      })
    }

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      const form = target.closest('form')
      if (!form) return
      if ((form as HTMLFormElement).dataset.formTracked === '1') return
      ;(form as HTMLFormElement).dataset.formTracked = '1'
      sendEvent({ eventType: 'form_start', pagePath: window.location.pathname, zoneId: 'contact-form' })
    }

    const onSubmit = (event: SubmitEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      if (!(target instanceof HTMLFormElement)) return
      sendEvent({ eventType: 'form_submit', pagePath: window.location.pathname, zoneId: 'contact-form' })
    }

    document.addEventListener('click', onClick, { passive: true })
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('submit', onSubmit)

    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('submit', onSubmit)
    }
  }, [isEnabled])

  return null
}
