'use client'

import { useEffect, useState } from 'react'
import { Clock3, Filter, ShieldCheck, Sparkles, Target, X } from 'lucide-react'

export function AdminLeadsHelpModal() {
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
        Como operar esta vista
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
            aria-label="Guia operativa de leads"
            className="muga-modal-panel relative w-full max-w-3xl border border-white/15 bg-[var(--color-obscure)] text-white shadow-[0_24px_72px_rgba(0,0,0,0.58)]"
          >
            <div className="space-y-6 p-6 md:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">Guia rapida · Operacion de leads</h3>
                  <p className="text-xs text-[var(--color-graylight)]">Menos texto, mas accion. Esta vista esta pensada para decidir rapido.</p>
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
                    <Clock3 size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">1) Atiende urgencias primero</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">Mira Vencidos (+48h) y En riesgo (+24h) antes que cualquier otra lista.</p>
                </article>

                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <Target size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">2) Usa ultimos ingresos</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">Desde las 3 cards puedes marcar Contactado o Aprobar portal sin navegar.</p>
                </article>

                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <Filter size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">3) Filtra cuando sea necesario</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">Primero chips rapidos. Si necesitas precision, abre Mas filtros y aplica UTM/fuente.</p>
                </article>

                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">4) Aprueba con criterio</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">Aprobar portal crea acceso y proyecto. Hazlo en leads listos (new/contacted/qualified).</p>
                </article>
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-[var(--color-graylight)]">
                <Sparkles size={14} className="text-primary" aria-hidden="true" />
                Regla de oro: entrar, decidir prioridad y ejecutar 1 accion por lead en menos de 30 segundos.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
