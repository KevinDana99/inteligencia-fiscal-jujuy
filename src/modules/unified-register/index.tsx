import { getUnifiedRegisterAction } from './data/actions';
import { UnifiedRegisterPage } from './presentation/components/UnifiedRegisterPage';

export default async function UnifiedRegisterModule() {
  const items = await getUnifiedRegisterAction();

  return <UnifiedRegisterPage initialItems={items} />;
}
