import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { getAdminClients } from '@/lib/portal-data'

interface AdminClientsPageProps {
  searchParams: Promise<{ clientUpdated?: string; clientError?: string }>
}

export default async function AdminClientsPage({ searchParams }: AdminClientsPageProps) {
  const query = await searchParams
  const clients = await getAdminClients()
  const summary = {
    total: clients.length,
    invited: clients.filter((client) => client.portalStatus === 'invited').length,
    accepted: clients.filter((client) => client.portalStatus === 'accepted').length,
    disabled: clients.filter((client) => client.portalStatus === 'disabled').length,
  }

  return (
    <section className="space-y-12">
      <div className="space-y-2">
        <p className="muga-badge muga-badge--sm">Clientes</p>
        <h2 className="section-title">Gestion de acceso portal</h2>
        <p className="section-lead max-w-3xl text-base">Controla estado de portal, alta y disponibilidad por cliente.</p>
      </div>

      <Card className="muga-shell-panel">
        <CardContent className="space-y-2 py-5 text-sm text-[var(--color-graylight)]">
          <p className="muga-badge muga-badge--sm">Politica operativa</p>
          <p>- invited: acceso pendiente o en onboarding.</p>
          <p>- accepted: cliente habilitado para portal.</p>
          <p>- disabled: acceso temporalmente bloqueado.</p>
        </CardContent>
      </Card>

      {query.clientUpdated ? (
        <Alert variant="success">
          <AlertTitle>Cliente actualizado</AlertTitle>
          <AlertDescription>El estado de acceso portal se guardó correctamente.</AlertDescription>
        </Alert>
      ) : null}

      {query.clientError ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo actualizar cliente</AlertTitle>
          <AlertDescription>Código: {query.clientError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Clientes', value: summary.total },
          { label: 'Invitados', value: summary.invited },
          { label: 'Aceptados', value: summary.accepted },
          { label: 'Deshabilitados', value: summary.disabled },
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

      <Card className="muga-shell-panel">
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto hidden lg:block">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">
                  <th className="px-3 py-2">Cliente</th>
                  <th className="px-3 py-2">Empresa</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Estado portal</th>
                  <th className="px-3 py-2">Accion</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-white/10 last:border-0">
                    <td className="px-3 py-2 font-semibold text-white">{client.name}</td>
                    <td className="px-3 py-2 text-[var(--color-graylight)]">{client.company}</td>
                    <td className="px-3 py-2 text-[var(--color-graylight)]">{client.email}</td>
                    <td className="px-3 py-2 text-[var(--color-graylight)]">{client.portalStatus}</td>
                    <td className="px-3 py-2">
                      <form action="/api/admin/clients/status" method="post" className="flex items-center gap-2">
                        <input type="hidden" name="client_id" value={client.id} />
                        <select name="portal_status" defaultValue={client.portalStatus} className="muga-field h-9 border border-white/15 px-2 text-xs text-white">
                          <option value="invited">invited</option>
                          <option value="accepted">accepted</option>
                          <option value="disabled">disabled</option>
                        </select>
                        <button type="submit" className="inline-flex h-9 items-center justify-center border border-white/20 px-3 text-xs font-semibold text-white hover:border-white/40">
                          Guardar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {clients.map((client) => (
              <article key={client.id} className="muga-shell-section space-y-3 p-3">
                <div>
                  <p className="font-semibold text-white">{client.name}</p>
                  <p className="text-xs text-[var(--color-graylight)]">{client.company}</p>
                  <p className="text-xs text-[var(--color-graylight)]">{client.email}</p>
                </div>
                <p className="text-xs text-[var(--color-graylight)]">Estado portal: {client.portalStatus}</p>
                <form action="/api/admin/clients/status" method="post" className="flex items-center gap-2">
                  <input type="hidden" name="client_id" value={client.id} />
                  <select name="portal_status" defaultValue={client.portalStatus} className="muga-field h-9 border border-white/15 px-2 text-xs text-white">
                    <option value="invited">invited</option>
                    <option value="accepted">accepted</option>
                    <option value="disabled">disabled</option>
                  </select>
                  <button type="submit" className="inline-flex h-9 items-center justify-center border border-white/20 px-3 text-xs font-semibold text-white hover:border-white/40">
                    Guardar
                  </button>
                </form>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
