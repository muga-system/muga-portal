export const PROJECT_STAGE_KEYS = [
  'brief',
  'diseno',
  'desarrollo',
  'qa',
  'publicado',
] as const

export const DELIVERABLE_STATUS_KEYS = [
  'pendiente',
  'revision',
  'aprobado',
  'cambios',
] as const

export const PROJECT_STAGE_LABELS: Record<(typeof PROJECT_STAGE_KEYS)[number], string> = {
  brief: 'Brief',
  diseno: 'Diseno',
  desarrollo: 'Desarrollo',
  qa: 'QA',
  publicado: 'Publicado',
}

export const PROJECT_STAGE_INFO: Record<
  (typeof PROJECT_STAGE_KEYS)[number],
  { whatWeDo: string; whatYouGet: string; whatINeed: string }
> = {
  brief: {
    whatWeDo: 'Conversamos para entender tu negocio, tus objetivos y cómo querés que sea tu sitio.',
    whatYouGet: 'Un documento con todo lo que necesitamos para empezar el diseño.',
    whatINeed: 'Que nos cuentes sobre tu negocio, tus competidores y qué esperás del sitio.',
  },
  diseno: {
    whatWeDo: 'Creamos el diseño visual de tu sitio, incluyendo colores, tipografía y layout.',
    whatYouGet: 'Mockups interactivos para que puedas ver cómo quedará tu sitio.',
    whatINeed: 'Que nos envies tu logo, fotos y textos que quieras usar.',
  },
  desarrollo: {
    whatWeDo: 'Programamos tu sitio web con las funcionalidades que definimos en el brief.',
    whatYouGet: 'Una versión inicial de tu sitio para probar y dar feedback.',
    whatINeed: 'Tus comentarios sobre el funcionamiento y cualquier ajuste que necesites.',
  },
  qa: {
    whatWeDo: 'Revisamos que todo funcione bien, corregimos errores y optimizamos el sitio.',
    whatYouGet: 'Tu sitio listo y funcionando sin errores.',
    whatINeed: 'Que pruebes el sitio y nos digas si algo no funciona como esperás.',
  },
  publicado: {
    whatWeDo: 'Publicamos tu sitio en internet y te enseñamos cómo administrarlo.',
    whatYouGet: 'Tu sitio live en internet + acceso para quevoslo administrés.',
    whatINeed: 'Que nos confirmes que estás conforme con el resultado final.',
  },
}

export const DELIVERABLE_STATUS_LABELS: Record<(typeof DELIVERABLE_STATUS_KEYS)[number], string> = {
  pendiente: 'Pendiente',
  revision: 'En revision',
  aprobado: 'Aprobado',
  cambios: 'Cambios solicitados',
}
