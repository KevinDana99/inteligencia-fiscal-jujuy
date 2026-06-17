'use client';

import { useExplorerRegister } from '../../hooks/useExplorerRegister';
import { getExplorerRegisterDisplayedError } from '../../utils';
import { ExplorerRegisterColumnPills } from './components/ExplorerRegisterColumnPills';
import { ExplorerRegisterErrorCard } from './components/ExplorerRegisterErrorCard';
import { ExplorerRegisterFiltersCard } from './components/ExplorerRegisterFiltersCard';
import { ExplorerRegisterNavbarAction } from './components/ExplorerRegisterNavbarAction';
import { ExplorerRegisterResultsSection } from './components/ExplorerRegisterResultsSection';
import type { ExplorerRegisterPageProps } from './types';
import classes from './ExplorerRegisterPage.module.css';

export function ExplorerRegisterPage({
  catalog,
  catalogError
}: ExplorerRegisterPageProps) {
  const controller = useExplorerRegister(catalog);
  const displayedError = getExplorerRegisterDisplayedError({
    catalogError,
    searchError: controller.searchError,
    searchStatus: controller.searchStatus
  });

  return (
    <>
      <ExplorerRegisterNavbarAction controller={controller} />
      <div className={classes.page}>
        <ExplorerRegisterColumnPills controller={controller} />
        <ExplorerRegisterFiltersCard controller={controller} />
        <ExplorerRegisterErrorCard message={displayedError} />
        <ExplorerRegisterResultsSection controller={controller} />
      </div>
    </>
  );
}
