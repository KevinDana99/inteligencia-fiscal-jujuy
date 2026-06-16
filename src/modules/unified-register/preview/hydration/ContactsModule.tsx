import { getContactsAction } from '../../data/actions';
import { UnifiedRegisterPreviewHydrationBridge } from '../../presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge';
import type { ContributorModuleProps } from '../types';

export async function ContactsModule({
  contribuyenteId
}: Pick<ContributorModuleProps, 'contribuyenteId'>) {
  const result = await getContactsAction(contribuyenteId, {
    pagina: 1,
    itemsPagina: 1
  });

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="contacts"
      contactsData={result.data}
      contactsError={result.error}
    />
  );
}
