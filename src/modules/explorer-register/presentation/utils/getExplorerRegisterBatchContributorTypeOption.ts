import type { IExplorerRegisterRow } from '../../data/models/ExplorerRegister'
import {
  EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_CODES,
  EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_OPTIONS
} from '../constants/registerBatchContributorType'

export function getExplorerRegisterBatchContributorTypeOption(
  selectedRows: IExplorerRegisterRow[]
) {
  const contributorTypes = new Set(
    selectedRows
      .map((row) => row.values.tipoContribuyente?.toString().trim().toUpperCase())
      .filter(Boolean) as string[]
  )

  if (contributorTypes.size > 1) {
    return EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_OPTIONS.all
  }

  const [contributorType] = Array.from(contributorTypes)

  if (contributorType === EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_CODES.convenio) {
    return EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_OPTIONS.convenio
  }

  if (contributorType === EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_CODES.local) {
    return EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_OPTIONS.local
  }

  if (
    contributorType === EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_CODES.noInscripto
  ) {
    return EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_OPTIONS.noInscripto
  }

  return EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_OPTIONS.all
}
