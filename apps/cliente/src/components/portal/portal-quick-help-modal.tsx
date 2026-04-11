'use client'

import { useEffect, useState } from 'react'
import { CircleCheck, MessageSquareText, Upload, Workflow, X } from 'lucide-react'

export function PortalQuickHelpModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center border border-white/20 px-3 text-xs font-semibold text-white hover:border-white/40"
      >
        Como usar el portal
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cerrar guía"
            onClick={() => setOpen(false)}
            className="muga-modal-overlay absolute inset-0 bg-black/70 backdrop-blur-[5px]"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Guia de uso del portal cliente"
            className="muga-modal-panel relative w-full max-w-2xl border border-white/15 bg-[var(--color-obscure)] text-white shadow-[0_24px_72px_rgba(0,0,0,0.58)]"
          >
            <div className="space-y-5 p-6 md:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-semibold">Guia rapida · Portal cliente</h3>
                  <p className="mt-1 text-xs text-[var(--color-graylight)]">Entra, revisa pendiente y ejecuta en pocos pasos.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center border border-white/20 text-sm text-white hover:border-white/40"
                  aria-label="Cerrar"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <Workflow size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">1) Estado actual</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">Mira la etapa activa y los entregables en revisión/cambios.</p>
                </article>

                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <MessageSquareText size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">2) Feedback puntual</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">Comenta sobre el entregable correcto para evitar retrabajo.</p>
                </article>

                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <Upload size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">3) Subir archivos</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">Adjunta material por etapa para acelerar aprobaciones.</p>
                </article>

                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <CircleCheck size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">4) Regla simple</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">Si hay pendiente de tu parte, resuélvelo primero y luego revisa actividad.</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
