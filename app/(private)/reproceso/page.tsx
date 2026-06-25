import { PAGE_METADATA } from '@/constants/metadata';
import ReprocessingModule from '@/modules/reprocessing';

export const metadata = PAGE_METADATA.reprocessing;

export default function ReprocesoPage() {
  return <ReprocessingModule />;
}
