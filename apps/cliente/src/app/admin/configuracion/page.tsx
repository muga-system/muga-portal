import { Card, CardContent } from '@/components/ui/card'

function flag(value: string | undefined) {
  return value === 'true' || value === '1' ? 'Activo' : 'Inactivo'
}

export default function AdminSettingsPage() {
  const settings = [
    { label: 'Analytics admin', value: flag(process.env.FEATURE_ADMIN_ANALYTICS) },
    { label: 'Analytics ingest web', value: flag(process.env.FEATURE_ANALYTICS_INGEST) },
    { label: 'Tracking cliente web', value: flag(process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_CLIENT) },
    { label: 'Demo login interno', value: flag(process.env.NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN) },
  ]

  return (
    <section className="space-y-12">
      <div className="space-y-2">
        <p className="muga-badge muga-badge--sm">Configuracion</p>
        <h2 className="section-title">Estado de sistema</h2>
        <p className="section-lead max-w-3xl text-base">Referencia operativa para validar flags, ingest y entorno activo.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((item) => (
          <Card key={item.label} className="muga-shell-panel">
            <CardContent className="space-y-1 py-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">{item.label}</p>
              <p className="text-xl font-semibold text-white">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="muga-shell-divider" aria-hidden="true" />

      <Card className="muga-shell-panel">
        <CardContent className="space-y-2 py-5 text-sm text-[var(--color-graylight)]">
          <p className="muga-badge muga-badge--sm">Checklist operativo</p>
          <p>1. Verificar flags activos antes de abrir pruebas internas.</p>
          <p>2. Confirmar ingest analytics y endpoint de track.</p>
          <p>3. Validar acceso admin y bloqueo de registro publico cliente.</p>
        </CardContent>
      </Card>
    </section>
  )
}
