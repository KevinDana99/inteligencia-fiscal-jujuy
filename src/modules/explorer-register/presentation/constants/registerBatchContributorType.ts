type ExplorerRegisterBatchContributorTypeOption = {
  value: string;
  label: string;
};

export const EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_OPTIONS = {
  convenio: {
    value: "ConvenioMultilateral",
    label: "Convenio multilateral",
  },
  local: {
    value: "RegimenLocal",
    label: "Local",
  },
  noInscripto: {
    value: "No inscripto",
    label: "No inscripto",
  },
  all: {
    value: "Todos los tipos",
    label: "Todos los tipos",
  },
} as const satisfies Record<string, ExplorerRegisterBatchContributorTypeOption>;

export const EXPLORER_REGISTER_BATCH_CONTRIBUTOR_TYPE_CODES = {
  convenio: 'CONVENIO',
  local: 'LOCAL',
  noInscripto: 'NO INSCRIPTO'
} as const;
