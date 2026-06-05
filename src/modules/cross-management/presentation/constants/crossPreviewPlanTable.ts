export const CROSS_PREVIEW_PLAN_COLUMN_GROUPS = [
  { label: 'Identificación', span: 4, className: 'neutral' },
  { label: 'Fuentes de base imponible', span: 6, className: 'bi' },
  { label: 'Mayor base', span: 1, className: 'bi' },
  { label: 'CM05 Jujuy', span: 1, className: 'cm' },
  { label: 'Diferencia / período', span: 3, className: 'diff' },
  { label: 'CM05 - Coeficientes declarados', span: 5, className: 'cm' },
  { label: 'Nuevos coeficientes', span: 3, className: 'coef' },
  { label: 'BI estimada vs declarada', span: 3, className: 'estimated' },
  { label: 'Impuesto', span: 2, className: 'tax' },
  { label: 'Créditos', span: 2, className: 'coef' },
  { label: 'Final', span: 1, className: 'final' }
] as const

export const CROSS_PREVIEW_PLAN_BI_COLUMNS = [
  'Fact. ARCA (año)',
  'Fact. ARCA (fecha)',
  'Ag. Percepción',
  'Ag. Retención',
  'Pago a Cta.',
  'Retenciones',
  'MAYOR'
]

export const CROSS_PREVIEW_PLAN_CM_COLUMNS = [
  'CM05 Jujuy',
  'Cierre Ej.',
  'Tot. Ing. País',
  'CI Decl.',
  'Tot. Egr.',
  'Coef. Egr.'
]

export const CROSS_PREVIEW_PLAN_DIFF_COLUMNS = ['Dif. Base', 'Mes', 'Año']

export const CROSS_PREVIEW_PLAN_COEF_COLUMNS = [
  'Nuevo CI',
  'CU Decl.',
  'NCU',
  'Dif. Créditos',
  'SAF'
]

export const CROSS_PREVIEW_PLAN_ESTIMATED_COLUMNS = [
  'BI Total País',
  'BI Estimada',
  'BI Decl. CM03'
]

export const CROSS_PREVIEW_PLAN_TAX_COLUMNS = ['Alícuota', 'Imp. Presuntivo']

export const CROSS_PREVIEW_PLAN_FINAL_COLUMN = 'EST. FINAL'
