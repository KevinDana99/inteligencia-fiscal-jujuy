import { PAGE_METADATA } from '@/constants/metadata';
import ExplorerRegisterModule from '@/modules/explorer-register';

export const metadata = PAGE_METADATA.explorerRegister;

export default async function ExplorerRegisterRoute() {
  return <ExplorerRegisterModule />;
}
