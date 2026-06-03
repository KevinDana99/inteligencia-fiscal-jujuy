import { getUnifiedRegisterListAction } from './data/actions';
import { UnifiedRegisterPage } from './presentation/components/UnifiedRegisterPage';

export default async function UnifiedRegisterModule() {
  const result = await getUnifiedRegisterListAction();

  return <UnifiedRegisterPage initialData={result.data ?? null} />;
}
