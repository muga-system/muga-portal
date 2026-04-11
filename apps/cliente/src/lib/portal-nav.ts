import type { AdminNavItem } from '@/lib/admin-nav'

export const PORTAL_NAV_ITEMS: AdminNavItem[] = [
  { key: 'portal-summary', label: 'Portal', href: '/portal', icon: 'door-open' },
  { key: 'portal-pipeline', label: 'Etapas', href: '/portal/etapas', icon: 'milestone' },
  { key: 'portal-deliverables', label: 'Entregas', href: '/portal/entregables', icon: 'package' },
  { key: 'portal-comments', label: 'Mensajes', href: '/portal/comentarios', icon: 'message-square' },
  { key: 'portal-files', label: 'Archivos', href: '/portal/archivos', icon: 'archive' },
  { key: 'portal-activity', label: 'Actividad', href: '/portal/actividad', icon: 'activity' },
]
