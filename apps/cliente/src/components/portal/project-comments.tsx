import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { PortalComment, PortalDeliverable } from '@/types/portal'

interface ProjectCommentsProps {
  projectId: string
  comments: PortalComment[]
  deliverables: PortalDeliverable[]
}

export function ProjectComments({ projectId, comments, deliverables }: ProjectCommentsProps) {
  return (
    <section className="space-y-4">
      <header className="space-y-1 px-4 sm:px-5 md:px-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-graylight)]">
          Mensajes
        </h3>
        <p className="text-sm leading-relaxed text-white/82 md:text-[0.95rem]">
          Escribe dudas o cambios con palabras simples. El equipo las recibe al instante.
        </p>
      </header>

      <div className="border-y border-white/10">
        <form action={`/internal/projects/${projectId}/comments`} method="post" className="space-y-3 border-b border-white/10 px-4 py-4 sm:px-5 md:px-6">
          <div>
            <Label htmlFor="deliverableId" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Entregable (opcional)
            </Label>
            <Select name="deliverableId" defaultValue="none">
              <SelectTrigger id="deliverableId" className="mt-1 w-full">
                <SelectValue placeholder="Sin entregable específico…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin entregable específico</SelectItem>
                {deliverables.map((deliverable) => (
                  <SelectItem key={deliverable.id} value={deliverable.id}>
                    {deliverable.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Mensaje
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={3}
              autoComplete="off"
              className="mt-1"
              placeholder="Ej: cambiar color del boton principal a verde, como en la marca..."
            />
            <p className="mt-2 text-xs text-muted-foreground">Consejo: un mensaje por tema ayuda a resolver mas rapido.</p>
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            Publicar comentario
          </Button>
        </form>

        <div>
          {comments.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground sm:px-5 md:px-6">No hay comentarios todavia.</p>
          ) : (
            comments.map((comment) => (
              <article key={comment.id} className="border-b border-white/10 px-4 py-3 last:border-b-0 sm:px-5 md:px-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{comment.author === 'muga' ? 'Equipo MUGA' : 'Tu equipo'}</p>
                  <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                <p className="mt-2 text-sm">{comment.message}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
