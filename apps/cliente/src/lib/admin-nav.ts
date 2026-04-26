export interface AdminNavItem {
  key: string
  label: string
  href: string
  icon:
    | 'house'
    | 'door-open'
    | 'inbox'
    | 'chart'
    | 'users'
    | 'folder'
    | 'book'
    | 'settings'
    | 'message-square'
    | 'package'
    | 'activity'
    | 'milestone'
    | 'archive'
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: 'house' },
  { key: 'leads', label: 'Leads', href: '/admin/leads', icon: 'inbox' },
  { key: 'analytics', label: 'Analytics', href: '/admin/analytics', icon: 'chart' },
  { key: 'clients', label: 'Clientes', href: '/admin/clientes', icon: 'users' },
  { key: 'projects', label: 'Proyectos', href: '/admin/proyectos', icon: 'folder' },
  { key: 'docs', label: 'Documentacion', href: '/admin/documentacion', icon: 'book' },
  { key: 'settings', label: 'Configuracion', href: '/admin/configuracion', icon: 'settings' },
]
