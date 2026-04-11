export interface AdminDocItem {
  slug: string
  title: string
  summary: string
  path: string
}

export const ADMIN_DOC_ITEMS: AdminDocItem[] = [
  {
    slug: 'workflow-end-to-end',
    title: 'Flujo end to end',
    summary: 'Desde formulario publico hasta onboarding y portal cliente.',
    path: 'docs/operations/workflow-end-to-end.md',
  },
  {
    slug: 'admin-runbook',
    title: 'Runbook admin',
    summary: 'Operacion diaria de leads, aprobaciones y seguimiento comercial.',
    path: 'docs/operations/admin-runbook.md',
  },
  {
    slug: 'client-portal-guide',
    title: 'Portal de cliente',
    summary: 'Acceso con cuenta (Google o contraseña), validación de estado y flujo de onboarding.',
    path: 'docs/operations/client-portal-guide.md',
  },
  {
    slug: 'system-communication-map',
    title: 'Mapa de comunicacion',
    summary: 'Como se conectan web, admin, supabase y eventos de analytics.',
    path: 'docs/architecture/system-communication-map.md',
  },
]

export function getAdminDocBySlug(slug: string) {
  return ADMIN_DOC_ITEMS.find((item) => item.slug === slug) || null
}
