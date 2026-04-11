import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PROJECT_STAGE_LABELS } from '@/lib/portal-constants'
import type { PortalFile, ProjectStageKey } from '@/types/portal'

interface ProjectFilesProps {
  projectId: string
  files: PortalFile[]
}

const fileKindLabels: Record<PortalFile['kind'], string> = {
  brief: 'Brief',
  asset: 'Material',
  entregable: 'Entregable',
}

const stageOptions: ProjectStageKey[] = ['brief', 'diseno', 'desarrollo', 'qa', 'publicado']

export function ProjectFiles({ projectId, files }: ProjectFilesProps) {
  return (
    <section className="space-y-4">
      <header className="space-y-1 px-4 sm:px-5 md:px-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-graylight)]">
          Archivos compartidos
        </h3>
        <p className="text-sm leading-relaxed text-white/82 md:text-[0.95rem]">
          Sube logos, textos, imagenes o links para que el equipo pueda avanzar.
        </p>
      </header>

      <div className="border-y border-white/10">
        <form action={`/internal/projects/${projectId}/files`} method="post" className="space-y-3 border-b border-white/10 px-4 py-4 sm:px-5 md:px-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="fileName" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Nombre
              </Label>
              <Input
                id="fileName"
                name="fileName"
                required
                autoComplete="off"
                className="mt-1"
                placeholder="Ej. mockup-home-v2.fig…"
              />
            </div>

            <div>
              <Label htmlFor="filePath" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Link (opcional)
              </Label>
              <Input
                id="filePath"
                name="filePath"
                autoComplete="off"
                className="mt-1"
                placeholder="Ej. storage://projects/…"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="stage" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Etapa
              </Label>
              <Select name="stage" defaultValue="brief">
                <SelectTrigger id="stage" className="mt-1 w-full">
                  <SelectValue placeholder="Seleccionar etapa…" />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {PROJECT_STAGE_LABELS[stage]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="kind" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tipo de archivo
              </Label>
              <Select name="kind" defaultValue="asset">
                <SelectTrigger id="kind" className="mt-1 w-full">
                  <SelectValue placeholder="Seleccionar tipo…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief</SelectItem>
                    <SelectItem value="asset">Material</SelectItem>
                    <SelectItem value="entregable">Entregable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          <Button type="submit" className="w-full sm:w-auto">
            Registrar archivo
          </Button>
        </form>

        <div>
          {files.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground sm:px-5 md:px-6">No hay archivos cargados.</p>
          ) : (
            files.map((file) => (
              <article key={file.id} className="border-b border-white/10 px-4 py-3 last:border-b-0 sm:px-5 md:px-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{file.name}</p>
                  <span className="text-xs text-muted-foreground">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline">{fileKindLabels[file.kind]}</Badge>
                  <Badge variant="secondary">{PROJECT_STAGE_LABELS[file.stage]}</Badge>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
