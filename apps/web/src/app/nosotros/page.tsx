import { PageHero } from "@/components/page-hero"
import { SurfaceBox } from "@/components/surface-box"

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        badge="MUGA"
        title="Nosotros"
        description="Arquitectura web como sistema, con criterio técnico y foco en conversión."
        variant="feature"
        aside={
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Posicionamiento</p>
            <p className="mt-3 text-sm text-white/75">
              Construcción orientada a decisión comercial, no solo a estética.
            </p>
          </>
        }
      />

      <section className="section-space-lg section-space-after-hero divider-header-gap layout-divider-bottom">
        <div className="page-container space-y-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-4">
                <span className="muga-badge muga-badge--sm">Nosotros</span>
              </div>
              <h2 className="section-title mb-5 max-w-2xl">
                Estructura web con criterio técnico y foco en conversión.
              </h2>
              <p className="section-lead">
                No vendemos páginas sueltas. Construimos sistemas web mantenibles, rápidos y
                medibles para crecer sin rehacer la base.
              </p>
            </div>

            <aside className="muga-surface lg:col-span-5 p-6">
              <div className="mb-3">
                <span className="muga-badge muga-badge--sm">Como lo hacemos</span>
              </div>
              <p className="mb-4 text-2xl font-light text-white">Base técnica estable</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Arquitectura modular desde el inicio.</li>
                <li>Métricas definidas antes de desarrollar.</li>
                <li>Entrega con documentación y continuidad técnica.</li>
              </ul>
            </aside>
          </div>

          <div>
            <div className="mb-6">
              <div className="mb-3">
                <span className="muga-badge muga-badge--sm">Que garantizamos</span>
              </div>
              <p className="section-lead max-w-3xl">
                Definimos criterios técnicos desde el inicio y dejamos claro qué se mide, qué se
                entrega y qué sostiene la estructura.
              </p>
            </div>

            <div className="border-y border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3">
              <article className="p-6 md:border-r md:border-white/10">
                <h3 className="mb-4 text-xl font-medium text-white">Velocidad</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>LCP &lt;= 2.5s</li>
                  <li>CLS &lt;= 0.1</li>
                  <li>INP &lt;= 200ms</li>
                </ul>
              </article>

              <article className="border-y border-white/10 p-6 md:border-y-0 md:border-r md:border-white/10">
                <h3 className="mb-4 text-xl font-medium text-white">Accesibilidad</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>WCAG AA (&gt;= 90)</li>
                  <li>SEO (&gt;= 95%)</li>
                  <li>Indexación técnica correcta</li>
                </ul>
              </article>

              <article className="p-6">
                <h3 className="mb-4 text-xl font-medium text-white">Confiabilidad</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>HTTPS seguro</li>
                  <li>Headers de seguridad</li>
                  <li>Disponibilidad &gt;= 99.9%</li>
                </ul>
              </article>
              </div>
            </div>
          </div>

          <SurfaceBox className="p-8">
            <div className="mb-4">
              <span className="muga-badge muga-badge--sm">Criterio de trabajo</span>
            </div>
            <p className="mb-6 text-2xl leading-tight font-light text-white">Ordenamos antes de construir.</p>
            <p className="section-lead max-w-3xl">
              Trabajamos con decisiones explícitas, medición real y una base técnica lista para
              crecer sin desorden.
            </p>
          </SurfaceBox>
        </div>
      </section>
    </>
  )
}
