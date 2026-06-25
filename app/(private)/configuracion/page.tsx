import { PAGE_METADATA } from '@/constants/metadata';
import { ConfigurationPage } from '@/modules/configuration-module';

export const metadata = PAGE_METADATA.dashboardSettings;

export default function ConfiguracionPage() {
  return <ConfigurationPage />;
}
