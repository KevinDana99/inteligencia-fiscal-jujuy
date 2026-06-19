import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';
import classes from '../UnifiedRegisterPreviewPage.module.css';

const BACK_ROUTE = '/' as Route;

export function PreviewBackButton() {
  const router = useRouter();

  return (
    <button className={classes.backButton} onClick={() => router.push(BACK_ROUTE)}>
      <IconChevronLeft size={14} />
      <span>Padrón Unificado</span>
    </button>
  );
}
