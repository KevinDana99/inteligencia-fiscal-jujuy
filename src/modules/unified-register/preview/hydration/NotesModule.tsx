import { getNotesAction } from '../../data/actions';
import { UnifiedRegisterPreviewHydrationBridge } from '../../presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge';
import type { ContributorModuleProps } from '../types';

export async function NotesModule({
  contribuyenteId
}: Pick<ContributorModuleProps, 'contribuyenteId'>) {
  const result = await getNotesAction(contribuyenteId, {
    pagina: 1,
    itemsPagina: 1
  });

  return (
    <UnifiedRegisterPreviewHydrationBridge
      moduleKey="notes"
      notesData={result.data}
      notesError={result.error}
    />
  );
}
