'use client'

import { useEffect, useMemo, useState } from 'react'
import { CircleCheck, FileText, GraduationCap, MessageSquareText, Upload, Workflow, X } from 'lucide-react'

interface PortalOnboardingModalProps {
  shouldAutoOpen?: boolean
}

const STEPS = [
  {
    title: 'Mira tu estado actual',
    text: 'En Inicio puedes ver en que etapa esta tu proyecto y que esta pendiente.',
    icon: Workflow,
  },
  {
    title: 'Revisa entregas primero',
    text: 'En Entregas responde antes los items con Cambios o Revision.',
    icon: FileText,
  },
  {
    title: 'Escribe mensajes claros',
    text: 'En Mensajes deja un pedido por vez, corto y concreto.',
    icon: MessageSquareText,
  },
  {
    title: 'Comparte archivos utiles',
    text: 'En Archivos sube logos, imagenes o textos para acelerar el trabajo.',
    icon: Upload,
  },
]

export function PortalOnboardingModal({ shouldAutoOpen = false }: PortalOnboardingModalProps) {
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (shouldAutoOpen) {
      setOpen(true)
      setStepIndex(0)
    }
  }, [shouldAutoOpen])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        void handleCloseAndPersist()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const isLast = stepIndex === STEPS.length - 1
  const progress = useMemo(() => `${stepIndex + 1}/${STEPS.length}`, [stepIndex])

  const markSeen = async () => {
    try {
      setSaving(true)
      await fetch('/api/portal/onboarding/seen', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'fetch',
        },
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCloseAndPersist = async () => {
    await markSeen()
    setOpen(false)
  }

  const step = STEPS[stepIndex]
  const StepIcon = step.icon

  return (
    <>
      <div className="group relative">
        <button
          type="button"
          onClick={() => {
            setStepIndex(0)
            setOpen(true)
          }}
          className="inline-flex h-9 w-9 items-center justify-center border-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-0 text-[var(--color-graylight)] hover:text-white"
          aria-label="Ver tutorial otra vez"
        >
          <GraduationCap size={15} aria-hidden="true" />
        </button>
        <span className="pointer-events-none absolute right-0 top-full z-10 mt-2 whitespace-nowrap border border-white/15 bg-[var(--color-obscure)] px-2 py-1 text-[11px] text-[var(--color-graylight)] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-opacity group-hover:opacity-100">
          Ver tutorial otra vez
        </span>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cerrar tutorial"
            onClick={() => void handleCloseAndPersist()}
            className="muga-modal-overlay absolute inset-0 bg-black/70 backdrop-blur-[5px]"
          />

          <div className="muga-modal-panel relative w-full max-w-2xl border border-white/15 bg-[var(--color-obscure)] text-white shadow-[0_24px_72px_rgba(0,0,0,0.58)]">
            <div className="space-y-6 p-6 md:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-semibold">Tutorial rapido del portal</h3>
                  <p className="mt-1 text-xs text-[var(--color-graylight)]">Paso {progress} · 60 segundos</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCloseAndPersist()}
                  className="inline-flex h-8 w-8 items-center justify-center border border-white/20 text-sm text-white hover:border-white/40"
                  aria-label="Cerrar"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </div>

              <article className="space-y-3 border border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
                <div className="flex items-center gap-2 text-white">
                  <StepIcon size={16} className="text-primary" aria-hidden="true" />
                  <p className="text-sm font-semibold">{step.title}</p>
                </div>
                <p className="text-sm text-[var(--color-graylight)]">{step.text}</p>
              </article>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
                  disabled={stepIndex === 0 || saving}
                  className="inline-flex h-9 items-center border border-white/20 px-3 text-xs font-semibold text-white hover:border-white/40 disabled:opacity-50"
                >
                  Anterior
                </button>

                {isLast ? (
                  <button
                    type="button"
                    onClick={() => void handleCloseAndPersist()}
                    disabled={saving}
                    className="inline-flex h-9 items-center border border-primary/70 bg-primary px-3 text-xs font-semibold text-black hover:bg-primary/90 disabled:opacity-60"
                  >
                    {saving ? 'Guardando...' : 'Entendido'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStepIndex((current) => Math.min(current + 1, STEPS.length - 1))}
                    disabled={saving}
                    className="inline-flex h-9 items-center border border-primary/70 bg-primary px-3 text-xs font-semibold text-black hover:bg-primary/90 disabled:opacity-60"
                  >
                    Siguiente
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-[var(--color-graylight)]">
                <CircleCheck size={14} className="text-primary" aria-hidden="true" />
                Puedes volver a abrir este tutorial cuando quieras desde el botón superior.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
