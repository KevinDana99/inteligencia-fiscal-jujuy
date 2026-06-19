import { Suspense } from 'react';
import { AddressesModule } from './hydration/AddressesModule';
import { AvailableCrossesModule } from './hydration/AvailableCrossesModule';
import { ContactsModule } from './hydration/ContactsModule';
import { InterventionOrdersModule } from './hydration/InterventionOrdersModule';
import { MercurioModule } from './hydration/MercurioModule';
import { NotesModule } from './hydration/NotesModule';
import { ReprocessingModule } from './hydration/ReprocessingModule';
import type { ContributorModuleProps } from './types';

type PreviewHydrationModulesProps = ContributorModuleProps & {
  shouldLoadBackendLists: boolean;
};

export function PreviewHydrationModules({
  contribuyenteId,
  cuit,
  shouldLoadBackendLists
}: PreviewHydrationModulesProps) {
  return (
    <>
      <Suspense fallback={null}>
        <AvailableCrossesModule />
      </Suspense>
      <Suspense fallback={null}>
        <ReprocessingModule contribuyenteId={contribuyenteId} cuit={cuit} />
      </Suspense>
      {shouldLoadBackendLists ? (
        <>
          <Suspense fallback={null}>
            <AddressesModule contribuyenteId={contribuyenteId} />
          </Suspense>
          <Suspense fallback={null}>
            <ContactsModule contribuyenteId={contribuyenteId} />
          </Suspense>
          <Suspense fallback={null}>
            <NotesModule contribuyenteId={contribuyenteId} />
          </Suspense>
          <Suspense fallback={null}>
            <MercurioModule contribuyenteId={contribuyenteId} />
          </Suspense>
          <Suspense fallback={null}>
            <InterventionOrdersModule contribuyenteId={contribuyenteId} />
          </Suspense>
        </>
      ) : null}
    </>
  );
}
