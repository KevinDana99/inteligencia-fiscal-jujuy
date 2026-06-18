import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Button, Group } from '@mantine/core';
import { IconChevronDown, IconFileText, IconListDetails } from '@tabler/icons-react';
import { BatchManagementCrossMenu } from '@/modules/batch-management/presentation/components/BatchManagementTable/BatchManagementCrossMenu';
import type { IUnifiedRegisterDetail } from '../../../../data/models/UnifiedRegister';
import type { PreviewController } from '../types';
import { BatchLotDropdown } from './BatchLotDropdown';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type PreviewHeaderActionsProps = {
  item: IUnifiedRegisterDetail;
  preview: PreviewController;
};

export function PreviewHeaderActions({ item, preview }: PreviewHeaderActionsProps) {
  return (
    <div className={classes.headerActions}>
      <Group gap="sm">
        <button
          type="button"
          role="switch"
          aria-checked={preview.isReprocessingMarked}
          className={`${classes.switchAction} ${
            preview.isReprocessingMarked ? classes.switchActionActive : ''
          }`}
          onClick={preview.toggleReprocessing}
          disabled={
            preview.isReprocessingTogglePending || preview.isReprocessingHydrating
          }
        >
          <span className={classes.switchTrack} aria-hidden="true">
            <span className={classes.switchKnob} />
          </span>
          <span>Marcar reproceso</span>
        </button>
        <BatchManagementCrossMenu
          controller={{
            batchId: item.contribuyenteId,
            availableCrosses: preview.availableCrosses,
            filters: preview.crossFilters,
            validationMessage: preview.crossValidationMessage,
            executionError: preview.crossExecutionError,
            canConfirm: preview.canConfirmCrosses,
            isExecuting: preview.isCrossExecutionPending,
            onSectionToggle: (_, section) => preview.toggleCrossSection(section),
            onYearChange: (_, section, field, value) =>
              preview.setCrossYear(section, field, value),
            onMonthChange: (_, field, value) => preview.setCrossMonth(field, value),
            onCrossTypeToggle: (_, section, crossType) =>
              preview.toggleCrossType(section, crossType),
            onConfirm: () => preview.confirmCrossExecution(),
            navigateOnConfirm: false,
            onConfirmed: preview.closeHeaderModal
          }}
          target={<CrossMenuButton loading={preview.isAvailableCrossesHydrating} />}
          position="bottom-start"
        />
      </Group>
      <div className={classes.headerActionMenu}>
        <Button
          variant="default"
          radius="xl"
          className={`${classes.headerGhostButton} ${classes.staticButton}`}
          leftSection={<IconFileText size={14} />}
          onClick={() => preview.openHeaderModal('report')}
        >
          Generar Informe
        </Button>
        <Button
          radius="xl"
          className={`${classes.headerPrimaryButton} ${classes.staticButton}`}
          loading={preview.isBatchOptionsPending && preview.activeHeaderModal === 'batch'}
          onClick={() =>
            preview.activeHeaderModal === 'batch'
              ? preview.closeHeaderModal()
              : preview.openHeaderModal('batch')
          }
        >
          Agregar a lote
        </Button>
        <BatchLotDropdown preview={preview} />
      </div>
    </div>
  );
}

type CrossMenuButtonProps = ComponentPropsWithoutRef<'button'> & {
  loading: boolean;
};

const CrossMenuButton = forwardRef<HTMLButtonElement, CrossMenuButtonProps>(
  function CrossMenuButton({ loading, className, ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        type="button"
        className={[classes.secondaryAction, className].filter(Boolean).join(' ')}
      >
        <IconListDetails size={12} className={classes.secondaryActionIcon} />
        <span>{loading ? 'Cargando cruces...' : 'Cruces a realizar'}</span>
        <IconChevronDown size={12} className={classes.secondaryActionChevron} />
      </button>
    );
  }
);
