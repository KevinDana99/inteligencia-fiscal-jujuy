export const DASHBOARD_CONFIGURATION_LABELS = {
  railItem: 'Documentos de salida',
  pageTitle: 'Personalizar documentos de salida',
  pageSubtitle:
    'Editá la estructura de los documentos generados. Los cambios se aplican globalmente.',
  tabs: {
    intimacion: 'Intimación',
    informe: 'Informe de análisis'
  },
  infoAlert:
    'Solo el título y el texto se editan acá y aplican a todos los usuarios. Los datos del contribuyente, la acción fiscalizadora y los cruces se completan al generar el informe desde el Padrón Unificado.',
  report: {
    titleSection: 'Título del informe',
    titleField: 'Texto del título',
    bodySection: 'Texto introductorio',
    bodyField: 'Cuerpo del informe',
    confirmButton: 'Confirmar'
  },
  successModal: {
    title: 'Configuración actualizada',
    message: 'Se guardaron los cambios correctamente.'
  }
} as const
