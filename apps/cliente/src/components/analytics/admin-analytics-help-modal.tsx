'use client'

import { useEffect, useState } from 'react'
import { Activity, CircleCheck, MapPinned, ShieldAlert, Target, TrendingUp, X } from 'lucide-react'

export function AdminAnalyticsHelpModal() {
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
        className="inline-flex items-center border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:border-white/40"
      >
        Guia rapida
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
            aria-label="Guia rapida analytics"
            className="muga-modal-panel relative w-full max-w-3xl border border-white/15 bg-[var(--color-obscure)] p-0 text-white shadow-[0_24px_72px_rgba(0,0,0,0.58)]"
          >
            <div className="space-y-6 p-6 md:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">Guia rapida del dashboard</h3>
                  <p className="text-xs text-[var(--color-graylight)]">Lectura operativa para decidir rapido sin perder contexto.</p>
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
                    <TrendingUp size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">Conversion</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">
                    <span className="text-white">visita→lead</span> mide eficacia del sitio. Si cae, revisar formulario y fuentes.
                  </p>
                </article>

                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <Target size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">Calidad comercial</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">
                    Seguir <span className="text-white">contact rate</span>, <span className="text-white">qualification rate</span> y{' '}
                    <span className="text-white">win rate</span> para medir salud del embudo.
                  </p>
                </article>

                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldAlert size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">SLA de respuesta</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">
                    Priorizar leads nuevos con <span className="text-white">+24h</span> (warning) y <span className="text-white">+48h</span> (critico).
                  </p>
                </article>

                <article className="space-y-2 border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-center gap-2 text-white">
                    <MapPinned size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold">Mapa geográfico</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">
                    Alternar <span className="text-white">Mundo/Argentina</span> para detectar concentracion por pais y provincia.
                  </p>
                </article>
              </div>

              <div className="border border-white/10 bg-[rgba(255,255,255,0.02)] p-3">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <Activity size={15} className="text-primary" aria-hidden="true" />
                  <p className="text-sm font-semibold">Flujo recomendado</p>
                </div>
                <p className="text-sm text-[var(--color-graylight)]">
                  1) aplicar filtros por periodo/fuente, 2) revisar KPI + mapa, 3) bajar a tabla SLA y actualizar estado sin salir de esta pantalla.
                </p>
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-[var(--color-graylight)]">
                <CircleCheck size={14} className="text-primary" aria-hidden="true" />
                Si queres, esta guia se puede ampliar con ejemplos de decision por cada KPI.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
