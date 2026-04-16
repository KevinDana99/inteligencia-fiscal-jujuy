import { getAuthSessionAction } from './data/actions';
import UserSessionMenu from './presentation/components/UserSessionMenu';

export default async function AuthModule() {
  const { data } = await getAuthSessionAction();

  if (!data) {
    return null;
  }

  return <UserSessionMenu session={data} />;
}
