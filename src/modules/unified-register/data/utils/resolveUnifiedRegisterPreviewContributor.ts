export interface IUnifiedRegisterPreviewContributorReference {
  contribuyenteId: string;
  cuit: string;
}

export function normalizeCuit(value: string) {
  return value.replace(/\D/g, '');
}

export function isSameCuit(candidate: string, target: string) {
  const normalizedCandidate = normalizeCuit(candidate);
  const normalizedTarget = normalizeCuit(target);

  return (
    candidate === target ||
    (normalizedCandidate.length > 0 && normalizedCandidate === normalizedTarget)
  );
}

export function findContributorByCuit<
  TContributor extends IUnifiedRegisterPreviewContributorReference
>(contributors: readonly TContributor[], cuit: string) {
  return contributors.find((entry) => isSameCuit(entry.cuit, cuit)) ?? null;
}

export function resolvePreviewContribuyenteId({
  cuitMatchedContribuyenteId,
  routeContribuyenteId
}: {
  cuitMatchedContribuyenteId?: string | null;
  routeContribuyenteId?: string | null;
}) {
  return cuitMatchedContribuyenteId ?? routeContribuyenteId ?? null;
}
