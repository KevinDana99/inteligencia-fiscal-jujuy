import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { BatchManagementCreateModal } from '@/modules/batch-management/presentation/components/BatchManagementCreateModal';
import { DashboardNavbarActionPortal } from '@/modules/dashboard-layout/presentation/contexts';
import { EXPLORER_REGISTER_TEXTS } from '../../../constants';
import type { ExplorerRegisterController } from '../types';
import classes from '../styles/navbarAction.module.css';

export function ExplorerRegisterNavbarAction({
  controller
}: {
  controller: ExplorerRegisterController;
}) {
  return (
    <>
      <DashboardNavbarActionPortal>
        <Button
          size="sm"
          radius="xl"
          leftSection={<IconPlus size={16} />}
          className={classes.navbarActionButton}
          disabled={
            !controller.hasCatalog ||
            controller.batchCreateRowCount === 0 ||
            controller.createBatchModal.isCreatePending
          }
          onClick={controller.openCreateBatchModal}
        >
          {EXPLORER_REGISTER_TEXTS.navbarAction}{' '}
          {controller.batchCreateRowCount}{' '}
          {EXPLORER_REGISTER_TEXTS.navbarActionSuffix}
        </Button>
      </DashboardNavbarActionPortal>
      <BatchManagementCreateModal controller={controller.createBatchModal} />
    </>
  );
}
