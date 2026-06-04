import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { getAdminPanelAction, getAllowedDomainsAction } from './data/actions';
import AdminPanelShell from './presentation/components/AdminPanelShell';
import { AdminPanelSettingsPage } from './presentation/components/AdminPanelSettingsPage';
import type { AdminPanelSection } from './data/models/AdminPanel';

export default async function AdminPanelModule({
  session,
  section = 'dashboard'
}: {
  session: IAuthSession;
  section?: AdminPanelSection;
}) {
  const allowedDomainsResult = await getAllowedDomainsAction()
  const allowedDomains = allowedDomainsResult.data ?? []
  const formattedDate = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Argentina/Catamarca'
  }).format(new Date());

  if (section === 'settings') {
    if (allowedDomainsResult.error || !allowedDomainsResult.data) {
      throw new Error(allowedDomainsResult.error ?? 'No allowed domains received')
    }

    return (
      <AdminPanelSettingsPage
        session={session}
        allowedDomains={allowedDomainsResult.data}
      />
    );
  }

  const { data, error } = await getAdminPanelAction();

  if (error || !data) {
    throw new Error(error ?? 'No admin panel data received');
  }

  return (
    <AdminPanelShell
      key={data.users
        .map((user) =>
          [
            user.id,
            user.fullName,
            user.email,
            user.roleLabel,
            user.isDeleted ? '1' : '0',
            user.isAdmin ? '1' : '0'
          ].join(':')
        )
        .join('|')}
      data={data}
      session={session}
      formattedDate={formattedDate}
      allowedDomains={allowedDomains}
    />
  );
}
