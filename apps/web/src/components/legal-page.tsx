import { SurfaceBox } from "@/components/surface-box"

type LegalSection = {
  title: string
  body?: string
  bullets?: string[]
}

interface LegalPageProps {
  title: string
  lead: string
  updatedAt: string
  sections: LegalSection[]
}

export function LegalPage({ title, lead, updatedAt, sections }: LegalPageProps) {
  return (
    <section className="relative layout-divider-bottom pt-12 pb-12">
      <div className="page-container space-y-6">
        <div className="space-y-2">
          <span className="muga-badge muga-badge--sm">Legal</span>
          <h1 className="section-title">{title}</h1>
          <p className="section-lead">{lead}</p>
        </div>

        <SurfaceBox className="p-5 text-sm text-muted-foreground">
          Última actualización: <span className="font-semibold text-white">{updatedAt}</span>
        </SurfaceBox>

        {sections.map((section) => (
          <article key={section.title} className="muga-surface space-y-4 p-6">
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            {section.body ? <p className="break-words text-sm text-muted-foreground">{section.body}</p> : null}
            {section.bullets ? (
              <ul className="list-disc space-y-2 break-words pl-6 text-sm text-muted-foreground">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
