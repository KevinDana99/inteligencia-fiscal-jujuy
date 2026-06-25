import { PAGE_METADATA } from '@/constants/metadata';
import UnifiedRegisterModule from '@/modules/unified-register';

export const metadata = PAGE_METADATA.unifiedRegister;

export default async function HomePage() {
  return <UnifiedRegisterModule />;
}
