import { PageHero } from "@/components/page-hero"
import { BentoGridEffect } from "@/components/bento-grid-effect"
import { BentoIcon } from "@/components/bento-icon"
import { SecondaryArrowLink } from "@/components/secondary-arrow-link"

const criteriaBlocks = [
  {
    title: "Base modular",
    items: ["Componentes reutilizables", "Consistencia de sistema", "Mantenimiento simplificado"],
  },
  {
    title: "Rendimiento",
    items: ["Carga rápida", "Core Web Vitals optimizados", "Lectura sin cortes"],
  },
  {
    title: "Accesibilidad",
    items: [
      "Estándares WCAG AA",
      "Navegación por teclado",
      "Contraste adecuado",
      "Textos alternativos",
    ],
  },
  {
    title: "SEO",
    items: ["Metadatos optimizados", "Estructura semántica", "Indexación mejorada"],
  },
  {
    title: "Mantenimiento",
    items: ["Código limpio", "Actualizaciones controladas", "Soporte continuo"],
  },
]

const techStack = ["Next.js", "TailwindCSS", "TypeScript", "React", "Supabase", "Hostinger/Vercel"]

export default function CriteriosPage() {
  return (
    <>
      <PageHero
        badge="Criterios"
        title="Criterios técnicos"
        description="Rendimiento, accesibilidad, SEO y estructura como soporte del objetivo."
        variant="feature"
        aside={
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Base técnica</p>
            <p className="mt-3 text-sm text-white/75">
              Definimos estándares antes de construir para sostener claridad, velocidad y mantenimiento.
            </p>
            <p className="mt-4 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.18em] text-white/55">
              Objetivo: sistema estable
            </p>
          </>
        }
      />
      <BentoGridEffect />

      <section className="relative layout-divider-bottom pt-12 pb-12">
        <div className="page-container">
          <div className="grid grid-cols-1 auto-rows-[minmax(200px,auto)] gap-0 md:grid-cols-4">
            <article className="bento-cell bento-card p-6 md:col-span-2">
              <div className="light-effect" />
              <BentoIcon src="/icons/goal.svg" alt="Icono de objetivo" />
              <h2 className="mb-4 text-xl font-semibold text-white">Criterio</h2>
              <p className="text-muted-foreground">
                Definimos una base técnica clara antes de construir. Eso ordena decisiones, reduce
                desvío y sostiene el objetivo principal.
              </p>
              <p className="mt-4 text-muted-foreground">
                Cada proyecto parte de componentes reutilizables para mantener consistencia, control
                y rendimiento estable en cada ajuste.
              </p>
            </article>

            <article className="bento-cell bento-card p-6 md:col-span-2">
              <div className="light-effect" />
              <BentoIcon src="/icons/cpu.svg" alt="Icono de CPU" sizeClass="h-40 w-40 opacity-30" />
              <h2 className="mb-4 text-xl font-semibold text-white">Base técnica</h2>
              <div className="mb-4 flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span key={tech} className="border border-primary/30 bg-primary/10 px-2 py-1 text-sm text-primary">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground">
                La tecnología se define por función: carga rápida, base mantenible y control técnico
                para escalar sin reordenar todo el sitio.
              </p>
            </article>

            {criteriaBlocks.map((block) => (
              <article key={block.title} className="bento-cell bento-card p-6 md:col-span-1">
                <div className="light-effect" />
                <BentoIcon
                  src={
                    block.title === "Base modular"
                      ? "/icons/component.svg"
                      : block.title === "Rendimiento"
                        ? "/icons/chart-no-axes-combined.svg"
                        : block.title === "Accesibilidad"
                          ? "/icons/keyboard.svg"
                          : block.title === "SEO"
                            ? "/icons/scan-search.svg"
                            : "/icons/hard-hat.svg"
                  }
                  alt={`Icono de ${block.title}`}
                />
                <h3 className="mb-4 text-lg font-semibold text-white">{block.title}</h3>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}

            <article className="bento-cell bento-card p-6 md:col-span-2">
              <div className="light-effect" />
              <BentoIcon src="/icons/monitor-smartphone.svg" alt="Icono de responsive" />
              <h3 className="mb-4 text-lg font-semibold text-white">En pantalla</h3>
              <p className="text-muted-foreground">
                La estructura se define para sostener lectura y acción en cada ancho de pantalla,
                desde mobile hasta desktop.
              </p>
              <p className="mt-4 text-muted-foreground">
                No se trata solo de adaptar bloques. Se trata de mantener jerarquía, recorrido y
                claridad en cada contexto de uso.
              </p>
            </article>

            <article className="bento-cell bento-card p-6 md:col-span-1">
              <div className="light-effect" />
              <BentoIcon src="/icons/message-square-text.svg" alt="Icono de contacto" />
              <h3 className="mb-4 text-lg font-semibold text-white">Siguiente paso</h3>
              <div className="flex flex-col gap-3">
                <SecondaryArrowLink href="/contacto">Contanos tu caso</SecondaryArrowLink>
                <SecondaryArrowLink href="/formatos">Ver formatos</SecondaryArrowLink>
                <SecondaryArrowLink href="/casos">Ver referencias</SecondaryArrowLink>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
