import type {
  PortalActivity,
  PortalClient,
  PortalComment,
  PortalDeliverable,
  PortalFile,
  PortalProject,
  PortalProjectStage,
} from '@/types/portal'

export const portalMockClients: PortalClient[] = [
  {
    id: 'client-zen-gym',
    name: 'Camila Vega',
    company: 'Zen Gym Studio',
    email: 'camila@zengym.example',
    createdAt: '2026-03-12T10:00:00.000Z',
  },
  {
    id: 'client-aurora-dental',
    name: 'Martin Rios',
    company: 'Aurora Dental',
    email: 'martin@auroradental.example',
    createdAt: '2026-03-14T08:30:00.000Z',
  },
]

export const portalMockProjects: PortalProject[] = [
  {
    id: 'project-zen-lp',
    clientId: 'client-zen-gym',
    name: 'Landing Open Week 2026',
    description: 'Micrositio de conversion para la campana de membresias.',
    stage: 'desarrollo',
    createdAt: '2026-03-15T09:00:00.000Z',
    updatedAt: '2026-03-27T15:20:00.000Z',
  },
  {
    id: 'project-aurora-home',
    clientId: 'client-aurora-dental',
    name: 'Sitio institucional Q2',
    description: 'Renovacion de home y captacion de turnos.',
    stage: 'qa',
    createdAt: '2026-03-16T11:20:00.000Z',
    updatedAt: '2026-03-28T12:10:00.000Z',
  },
]

export const portalMockProjectStages: PortalProjectStage[] = [
  { id: 'stg-1', projectId: 'project-zen-lp', key: 'brief', position: 1, completedAt: '2026-03-16T09:15:00.000Z' },
  { id: 'stg-2', projectId: 'project-zen-lp', key: 'diseno', position: 2, completedAt: '2026-03-21T16:05:00.000Z' },
  { id: 'stg-3', projectId: 'project-zen-lp', key: 'desarrollo', position: 3, completedAt: null },
  { id: 'stg-4', projectId: 'project-zen-lp', key: 'qa', position: 4, completedAt: null },
  { id: 'stg-5', projectId: 'project-zen-lp', key: 'publicado', position: 5, completedAt: null },
  { id: 'stg-6', projectId: 'project-aurora-home', key: 'brief', position: 1, completedAt: '2026-03-17T12:30:00.000Z' },
  { id: 'stg-7', projectId: 'project-aurora-home', key: 'diseno', position: 2, completedAt: '2026-03-22T10:30:00.000Z' },
  { id: 'stg-8', projectId: 'project-aurora-home', key: 'desarrollo', position: 3, completedAt: '2026-03-27T11:45:00.000Z' },
  { id: 'stg-9', projectId: 'project-aurora-home', key: 'qa', position: 4, completedAt: null },
  { id: 'stg-10', projectId: 'project-aurora-home', key: 'publicado', position: 5, completedAt: null },
]

export const portalMockDeliverables: PortalDeliverable[] = [
  {
    id: 'deliv-zen-1',
    projectId: 'project-zen-lp',
    stage: 'desarrollo',
    title: 'Version responsive del hero',
    description: 'Implementacion completa del hero y seccion de beneficios en mobile y desktop.',
    status: 'revision',
    dueDate: '2026-03-29T00:00:00.000Z',
    updatedAt: '2026-03-28T09:45:00.000Z',
  },
  {
    id: 'deliv-zen-2',
    projectId: 'project-zen-lp',
    stage: 'desarrollo',
    title: 'Formulario de captacion',
    description: 'Formulario con validaciones y eventos de tracking basicos.',
    status: 'pendiente',
    dueDate: '2026-03-30T00:00:00.000Z',
    updatedAt: '2026-03-27T17:10:00.000Z',
  },
  {
    id: 'deliv-aurora-1',
    projectId: 'project-aurora-home',
    stage: 'qa',
    title: 'Checklist QA navegacion',
    description: 'Verificacion funcional de menus, enlaces y CTA de contacto.',
    status: 'cambios',
    dueDate: '2026-03-29T00:00:00.000Z',
    updatedAt: '2026-03-28T11:22:00.000Z',
  },
  {
    id: 'deliv-aurora-2',
    projectId: 'project-aurora-home',
    stage: 'qa',
    title: 'Optimizar velocidad home',
    description: 'Ajuste de recursos para mejorar LCP y CLS en mobile.',
    status: 'aprobado',
    dueDate: '2026-03-27T00:00:00.000Z',
    updatedAt: '2026-03-27T14:40:00.000Z',
  },
]

export const portalMockComments: PortalComment[] = [
  {
    id: 'com-1',
    projectId: 'project-zen-lp',
    deliverableId: 'deliv-zen-1',
    author: 'muga',
    message: 'Subimos la version responsive del hero para revision.',
    createdAt: '2026-03-28T09:50:00.000Z',
  },
  {
    id: 'com-2',
    projectId: 'project-aurora-home',
    deliverableId: 'deliv-aurora-1',
    author: 'cliente',
    message: 'Necesitamos ampliar el contraste del boton principal.',
    createdAt: '2026-03-28T11:30:00.000Z',
  },
]

export const portalMockFiles: PortalFile[] = [
  {
    id: 'file-1',
    projectId: 'project-zen-lp',
    stage: 'brief',
    name: 'brief-open-week.pdf',
    kind: 'brief',
    url: '#',
    uploadedAt: '2026-03-15T09:20:00.000Z',
  },
  {
    id: 'file-2',
    projectId: 'project-aurora-home',
    stage: 'diseno',
    name: 'brand-kit-aurora.zip',
    kind: 'asset',
    url: '#',
    uploadedAt: '2026-03-20T08:10:00.000Z',
  },
]

export const portalMockActivity: PortalActivity[] = [
  {
    id: 'act-1',
    projectId: 'project-zen-lp',
    eventType: 'deliverable_status_change',
    title: 'Entregable enviado a revision',
    description: 'Version responsive del hero en estado revision.',
    createdAt: '2026-03-28T09:45:00.000Z',
  },
  {
    id: 'act-2',
    projectId: 'project-zen-lp',
    eventType: 'comment',
    title: 'Comentario de Muga',
    description: 'Subimos la version responsive del hero para revision.',
    createdAt: '2026-03-28T09:50:00.000Z',
  },
  {
    id: 'act-3',
    projectId: 'project-aurora-home',
    eventType: 'deliverable_status_change',
    title: 'Cambios solicitados por cliente',
    description: 'Ajustar contraste del boton principal.',
    createdAt: '2026-03-28T11:30:00.000Z',
  },
  {
    id: 'act-4',
    projectId: 'project-aurora-home',
    eventType: 'file_upload',
    title: 'Archivo actualizado',
    description: 'Se subio nueva version del checklist de QA.',
    createdAt: '2026-03-28T11:45:00.000Z',
  },
]

export function getPortalProjectById(projectId: string) {
  return portalMockProjects.find((project) => project.id === projectId) ?? null
}

export function getPortalClientById(clientId: string) {
  return portalMockClients.find((client) => client.id === clientId) ?? null
}

export function getPortalStagesByProject(projectId: string) {
  return portalMockProjectStages
    .filter((stage) => stage.projectId === projectId)
    .sort((a, b) => a.position - b.position)
}

export function getPortalDeliverablesByProject(projectId: string) {
  return portalMockDeliverables
    .filter((deliverable) => deliverable.projectId === projectId)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}

export function getPortalActivityByProject(projectId: string) {
  return portalMockActivity
    .filter((activity) => activity.projectId === projectId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getPortalCommentsByProject(projectId: string) {
  return portalMockComments
    .filter((comment) => comment.projectId === projectId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getPortalFilesByProject(projectId: string) {
  return portalMockFiles
    .filter((file) => file.projectId === projectId)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
}
