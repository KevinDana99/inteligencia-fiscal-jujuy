import { Suspense } from 'react';
import { getAdminPanelAction } from './data/actions';
import {
  AdminPanelHomeSection,
  AdminPanelHomeSectionLoader
} from './presentation/components/AdminPanelHomeSection';
import { buildAdminPanelUsersKey } from './presentation/utils/buildAdminPanelUsersKey';
import { formatAdminPanelDate } from './presentation/utils/formatAdminPanelDate';

export default function AdminPanelModule() {
  return (
    <Suspense fallback={<AdminPanelHomeSectionLoader />}>
      <AdminPanelHomeSectionContent />
    </Suspense>
  );
}

async function AdminPanelHomeSectionContent() {
  const { data, error } = await getAdminPanelAction();

  if (error || !data) {
    throw new Error(error ?? 'No admin panel data received');
  }

  return (
    <AdminPanelHomeSection
      key={buildAdminPanelUsersKey(data.users)}
      data={data}
      formattedDate={formatAdminPanelDate(new Date())}
    />
  );
}
