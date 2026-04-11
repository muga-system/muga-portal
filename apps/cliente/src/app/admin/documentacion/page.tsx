import Link from 'next/link'
import { Activity, ArrowRight, Blocks, BookOpenText, Database, Mail, ShieldCheck, Workflow } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ADMIN_DOC_ITEMS } from '@/lib/admin-docs'

const docIcons = {
  'workflow-end-to-end': Workflow,
  'admin-runbook': Activity,
  'client-portal-guide': ShieldCheck,
  'system-communication-map': Blocks,
} as const

const technicalNotes = [
  {
    label: 'Web publica (3000)',
    detail: 'Recibe formularios y tracking en /api/contacto y /api/track. Guarda en Supabase con service role.',
    icon: Mail,
  },
  {
    label: 'Admin + Portal (3001)',
    detail: 'Backoffice para operacion interna y acceso cliente. En aprobacion crea usuario, cliente, proyecto e invitacion.',
    icon: BookOpenText,
  },
  {
    label: 'Supabase',
    detail: 'Tablas operativas: leads, clients, projects, deliverables, site_events, client_portal_invites.',
    icon: Database,
  },
]

export default function AdminDocumentationPage() {
  return (
    <section className="space-y-12">
      <div className="space-y-2">
        <p className="muga-badge muga-badge--sm">Documentacion</p>
        <h2 className="section-title">Guia del sistema MUGA</h2>
        <p className="section-lead max-w-4xl text-base">
          Vista amigable para operar y tambien para entender la arquitectura tecnica. Esta seccion resume para que sirve cada modulo,
          como se relacionan y donde ampliar cada tema en la documentacion del repo.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {ADMIN_DOC_ITEMS.map((item) => {
          const Icon = docIcons[item.slug as keyof typeof docIcons] || BookOpenText

          return (
            <Card key={item.path} className="muga-shell-panel">
              <CardContent className="space-y-3 py-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center border border-white/15 text-primary">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-[var(--color-graylight)]">{item.summary}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-graylight)]">Fuente: {item.path}</p>
                <Link
                  href={`/admin/documentacion/md/${item.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                >
                  Leer documentacion completa
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="muga-shell-panel">
        <CardContent className="space-y-4 py-5">
          <p className="muga-badge muga-badge--sm">Resumen tecnico</p>
          <div className="grid gap-4 md:grid-cols-3">
            {technicalNotes.map((item) => {
              const Icon = item.icon

              return (
                <article key={item.label} className="muga-shell-section space-y-2 p-3">
                  <div className="flex items-center gap-2">
                    <Icon size={15} className="text-primary" aria-hidden="true" />
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                  </div>
                  <p className="text-sm text-[var(--color-graylight)]">{item.detail}</p>
                </article>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="muga-shell-panel">
        <CardContent className="space-y-2 py-5 text-sm text-[var(--color-graylight)]">
          <p className="muga-badge muga-badge--sm">Checklist admin rapido</p>
          <p>1. Revisar leads nuevos, marcar contactado y cargar proxima accion con fecha.</p>
          <p>2. Aprobar portal solo en leads listos (new/contacted/qualified).</p>
          <p>3. Verificar analytics: mapa, top paginas y conversion en el mismo periodo.</p>
          <p>4. Si algo falla, revisar logs de /api/contacto, /api/leads/status y /admin/leads/[id]/approve.</p>
          <p>5. Referencia principal: usar los documentos de la carpeta docs/ en el repo para detalle completo.</p>
        </CardContent>
      </Card>
    </section>
  )
}
