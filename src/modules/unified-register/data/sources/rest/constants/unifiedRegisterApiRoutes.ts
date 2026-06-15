const UNIFIED_REGISTER_PADRON_BASE_ROUTE =
  '/api/procesos-informacion/padron/unificado';

export const UNIFIED_REGISTER_API_ROUTES = {
  contributors: UNIFIED_REGISTER_PADRON_BASE_ROUTE,
  contributorHeader: (contribuyenteId: string) =>
    `${UNIFIED_REGISTER_PADRON_BASE_ROUTE}/${contribuyenteId}/encabezado`,
  mercurioFines: (contribuyenteId: string) =>
    `${UNIFIED_REGISTER_PADRON_BASE_ROUTE}/${contribuyenteId}/mercurio`,
  interventionOrders: (contribuyenteId: string) =>
    `${UNIFIED_REGISTER_PADRON_BASE_ROUTE}/${contribuyenteId}/ordenes-intervencion`,
  alternateAddresses: (contribuyenteId: string) =>
    `/api/contribuyentes/${contribuyenteId}/domicilios-alternativos`,
  alternateAddress: (
    contribuyenteId: string,
    domicilioAlternativoId: string
  ) =>
    `/api/contribuyentes/${contribuyenteId}/domicilios-alternativos/${domicilioAlternativoId}`,
  notes: (contribuyenteId: string) =>
    `/api/contribuyentes/${contribuyenteId}/notas`,
  note: (contribuyenteId: string, notaId: string) =>
    `/api/contribuyentes/${contribuyenteId}/notas/${notaId}`,
  contacts: (contribuyenteId: string) =>
    `/api/contribuyentes/${contribuyenteId}/contactos`,
  contact: (contribuyenteId: string, contactoId: string) =>
    `/api/contribuyentes/${contribuyenteId}/contactos/${contactoId}`
} as const;
