export const UNIFIED_REGISTER_API_ROUTES = {
  contributors: '/api/procesos-informacion/padron/unificado',
  contributorHeader: (contribuyenteId: string) =>
    `/api/contribuyentes/${contribuyenteId}/cabecera`,
  mercurioFines: (contribuyenteId: string) =>
    `/api/contribuyentes/${contribuyenteId}/multas-mercurio`,
  interventionOrders: (contribuyenteId: string) =>
    `/api/contribuyentes/${contribuyenteId}/ordenes-intervencion`,
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
