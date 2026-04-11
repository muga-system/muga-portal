import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { getAdminProjectDetailHref } from '@/lib/admin-project-route'
import { PROJECT_STAGE_LABELS } from '@/lib/portal-constants'
import { getAdminProjectList } from '@/lib/portal-data'

export default async function AdminProjectsPage() {
  const projects = await getAdminProjectList()
  const summary = {
    total: projects.length,
    brief: projects.filter(({ project }) => project.stage === 'brief').length,
    diseno: projects.filter(({ project }) => project.stage === 'diseno').length,
    desarrollo: projects.filter(({ project }) => project.stage === 'desarrollo').length,
    qa: projects.filter(({ project }) => project.stage === 'qa').length,
    publicado: projects.filter(({ project }) => project.stage === 'publicado').length,
  }

  return (
    <section className="space-y-12">
      <div className="space-y-2">
        <p className="muga-badge muga-badge--sm">Proyectos</p>
        <h2 className="section-title">Ejecucion por cliente</h2>
        <p className="section-lead max-w-3xl text-base">Seguimiento de avance por etapa con acceso directo a detalle operativo.</p>
      </div>

      <Card className="muga-shell-panel">
        <CardContent className="space-y-2 py-5 text-sm text-[var(--color-graylight)]">
          <p className="muga-badge muga-badge--sm">Lectura rapida</p>
          <p>Usa esta vista para detectar cuellos de botella por etapa.</p>
          <p>Entra al detalle para gestionar entregables, comentarios y archivos.</p>
        </CardContent>
      </Card>

      <Card className="muga-shell-panel">
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto hidden lg:block">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">
                  <th className="px-3 py-2">Proyecto</th>
                  <th className="px-3 py-2">Cliente</th>
                  <th className="px-3 py-2">Etapa</th>
                  <th className="px-3 py-2">Actualizado</th>
                  <th className="px-3 py-2 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(({ project, client }) => (
                  <tr key={project.id} className="border-b border-white/10 last:border-0">
                    <td className="px-3 py-2">
                      <p className="font-semibold text-white">{project.name}</p>
                      <p className="text-xs text-[var(--color-graylight)]">{project.description}</p>
                    </td>
                    <td className="px-3 py-2 text-[var(--color-graylight)]">{client?.company || 'Sin cliente'}</td>
                    <td className="px-3 py-2 text-[var(--color-graylight)]">{PROJECT_STAGE_LABELS[project.stage]}</td>
                    <td className="px-3 py-2 text-[var(--color-graylight)]">{new Date(project.updatedAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2 text-right">
                      <Link href={getAdminProjectDetailHref(project.id, project.name)} className="muga-shell-link">
                        Abrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {projects.map(({ project, client }) => (
              <article key={project.id} className="muga-shell-section space-y-3 p-3">
                <div>
                  <p className="font-semibold text-white">{project.name}</p>
                  <p className="text-xs text-[var(--color-graylight)]">{project.description}</p>
                </div>
                <p className="text-xs text-[var(--color-graylight)]">Cliente: {client?.company || 'Sin cliente'}</p>
                <p className="text-xs text-[var(--color-graylight)]">Etapa: {PROJECT_STAGE_LABELS[project.stage]}</p>
                <div>
                  <Link href={getAdminProjectDetailHref(project.id, project.name)} className="muga-shell-link">
                    Abrir detalle
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Total', value: summary.total },
          { label: 'Brief', value: summary.brief },
          { label: 'Diseno', value: summary.diseno },
          { label: 'Desarrollo', value: summary.desarrollo },
          { label: 'QA', value: summary.qa },
          { label: 'Publicado', value: summary.publicado },
        ].map((metric) => (
          <Card key={metric.label} className="muga-shell-panel">
            <CardContent className="space-y-1 py-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">{metric.label}</p>
              <p className="text-2xl font-semibold text-white">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="muga-shell-divider" aria-hidden="true" />
    </section>
  )
}
