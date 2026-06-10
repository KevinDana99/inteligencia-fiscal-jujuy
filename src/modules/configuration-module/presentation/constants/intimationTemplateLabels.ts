export const INTIMATION_TEMPLATE_LABELS = {
  sections: {
    subject: 'Asunto',
    body: 'Cuerpo del documento',
    columns: 'Planilla adjunta — Columnas'
  },
  fields: {
    subject: 'Texto del asunto',
    greeting: 'Saludo',
    body: 'Texto del cuerpo',
    informationSource: 'Fuente de información',
    informationSourceOptional: '(opcional)',
    cutoffDate: 'Fecha de corte'
  },
  hints: {
    columns: 'Columnas que aparecen en la tabla de comparación de bases'
  },
  buttons: {
    addColumns: 'Elegir columnas de planilla',
    cancel: 'Cancelar',
    accept: 'Aceptar',
    addSelectedColumn: 'Agregar columna visible',
    removeSelectedColumn: 'Quitar columna visible'
  },
  placeholders: {
    informationSource: 'Ej: Facturación de compras, ARCA, etc.'
  },
  modal: {
    title: 'Elegir columnas de la planilla',
    subtitle:
      'Seleccioná las columnas que aparecerán en la planilla adjunta de la intimación.',
    availableColumns: 'Columnas disponibles',
    visibleColumns: 'Columnas visibles'
  }
} as const
