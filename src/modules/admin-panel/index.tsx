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
  const formattedDate = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Argentina/Catamarca'
  }).format(new Date());

  if (section === 'settings') {
    const { data, error } = await getAllowedDomainsAction()

    if (error || !data) {
      throw new Error(error ?? 'No allowed domains data received')
    }

    return <AdminPanelSettingsPage session={session} allowedDomains={data} />;
  }

  const { data, error } = await getAdminPanelAction();

  if (error || !data) {
    throw new Error(error ?? 'No admin panel data received');
  }

  return <AdminPanelShell data={data} session={session} formattedDate={formattedDate} />;
}
