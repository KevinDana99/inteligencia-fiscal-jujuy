import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { getAdminPanelAction } from './data/actions';
import AdminPanelShell from './presentation/components/AdminPanelShell';

export default async function AdminPanelModule({
  session
}: {
  session: IAuthSession;
}) {
  const { data, error } = await getAdminPanelAction();

  if (error || !data) {
    throw new Error(error ?? 'No admin panel data received');
  }

  return <AdminPanelShell data={data} session={session} />;
}
