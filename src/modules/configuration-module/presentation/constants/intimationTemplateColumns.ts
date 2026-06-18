export type IntimationColumnOption = {
  id: string
  label: string
}

export const INTIMATION_COLUMN_OPTIONS: IntimationColumnOption[] = [
  { id: 'anio', label: 'AÑO' },
  {
    id: 'baseImponibleIngresosBrutos',
    label: 'Base Imponible Ingresos Brutos'
  },
  {
    id: 'baseImponibleInformadaPorTerceros',
    label: 'Base Imponible Informada por Terceros (*)'
  },
  {
    id: 'diferenciaBaseImponible',
    label: 'Diferencia de Base Imponible'
  },
  { id: 'fact_arca_fecha', label: 'Fact. ARCA (fecha)' },
  { id: 'est_final', label: 'EST. FINAL' },
  { id: 'ag_percepcion', label: 'Ag. Percepción' },
  { id: 'fact_arca_anio', label: 'Fact. ARCA (año)' },
  { id: 'imp_presuntivo', label: 'Imp. Presuntivo' },
  { id: 'ag_retencion', label: 'Ag. Retención' },
  { id: 'pago_a_cta', label: 'Pago a Cta.' },
  { id: 'mes', label: 'Mes' },
  { id: 'cierre_ej', label: 'Cierre Ej.' },
  { id: 'tot_ing_pais', label: 'Tot. Ing. País' },
  { id: 'ci_decl', label: 'CI Decl.' },
  { id: 'tot_egr', label: 'Tot. Egr.' },
  { id: 'coef_egr', label: 'Coef. Egr.' },
  { id: 'nuevo_ci', label: 'Nuevo CI' },
  { id: 'cu_decl', label: 'CU Decl.' },
  { id: 'ncu', label: 'NCU' },
  { id: 'bi_total_pais', label: 'BI Total País' },
  { id: 'bi_estimada', label: 'BI Estimada' },
  { id: 'bi_decl_cm03', label: 'BI Decl. CM03' },
  { id: 'alicuota', label: 'Alícuota' },
  { id: 'dif_creditos', label: 'Dif. Créditos' },
  { id: 'saf', label: 'SAF' }
]
