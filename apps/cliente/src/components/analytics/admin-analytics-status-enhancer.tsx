'use client'

import { useEffect } from 'react'

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  won: 'Cerrado',
  lost: 'Perdido',
}

function setFeedback(message: string, ok: boolean) {
  const element = document.querySelector<HTMLElement>('[data-analytics-feedback]')
  if (!element) return

  element.textContent = message
  element.className = ok
    ? 'border border-emerald-500/35 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-300'
    : 'border border-red-500/35 bg-red-500/12 px-4 py-3 text-sm text-red-300'
}

export function AdminAnalyticsStatusEnhancer() {
  useEffect(() => {
    const onSubmit = async (event: SubmitEvent) => {
      const target = event.target
      if (!(target instanceof HTMLFormElement)) return
      if (target.dataset.statusForm !== '1') return

      event.preventDefault()
      const formData = new FormData(target)
      const leadId = String(formData.get('lead_id') || '')
      const submitButton = target.querySelector<HTMLButtonElement>('button[type="submit"]')

      if (submitButton) {
        submitButton.disabled = true
      }

      try {
        const response = await fetch(target.action, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'fetch',
          },
        })

        const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; status?: string }

        if (!response.ok || !payload.ok || !payload.status) {
          setFeedback('No se pudo actualizar el estado.', false)
          return
        }

        const label = STATUS_LABELS[payload.status] || payload.status
        document.querySelectorAll(`[data-lead-status-id="${leadId}"]`).forEach((node) => {
          if (node instanceof HTMLElement) {
            node.textContent = label
          }
        })

        document.querySelectorAll(`[data-lead-select-id="${leadId}"]`).forEach((node) => {
          if (node instanceof HTMLSelectElement) {
            node.value = payload.status || 'new'
          }
        })

        if (target.dataset.removeWhenResolved === '1' && payload.status !== 'new') {
          document.querySelectorAll(`[data-lead-row-id="${leadId}"]`).forEach((node) => {
            if (node instanceof HTMLElement) {
              node.remove()
            }
          })
        }

        setFeedback('Estado actualizado correctamente.', true)
      } catch {
        setFeedback('No se pudo actualizar el estado.', false)
      } finally {
        if (submitButton) {
          submitButton.disabled = false
        }
      }
    }

    document.addEventListener('submit', onSubmit)
    return () => document.removeEventListener('submit', onSubmit)
  }, [])

  return null
}
