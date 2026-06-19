import { getAlternateAddressesAction } from '../../data/actions';
import { mapAlternateAddressRecordToViewModel } from '../../data/mappers/mapAlternateAddress';
import { UnifiedRegisterPreviewHydrationBridge } from '../../presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge';
import type { ContributorModuleProps } from '../types';

export async function AddressesModule({
  contribuyenteId
}: Pick<ContributorModuleProps, 'contribuyenteId'>) {
  const result = await getAlternateAddressesAction(contribuyenteId);
  const addresses =
    result.data?.domiciliosAlternativos.map(mapAlternateAddressRecordToViewModel) ?? [];

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="addresses"
      addresses={addresses}
      addressesError={result.error}
    />
  );
}
