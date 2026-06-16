export const BATCH_REGIME_OPTIONS = [
  { value: 'ConvenioMultilateral', label: 'Convenio Multilateral' },
  { value: 'RegimenLocal', label: 'Local' }
] as const

export const BATCH_MANAGEMENT_CREATE_ERRORS = {
  duplicatedSingle: (cuit: string) =>
    `El CUIT ${cuit} ya fue agregado al lote.`,
  duplicatedMultiple: 'Algunos CUITs ingresados ya fueron agregados al lote.'
} as const
