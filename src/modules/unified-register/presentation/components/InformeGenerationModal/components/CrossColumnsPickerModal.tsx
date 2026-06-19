import { ActionIcon, Button, Card, Modal, Stack, Text } from '@mantine/core';
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconCheck,
  IconDragDrop
} from '@tabler/icons-react';
import type { DragEventHandler } from 'react';
import type { InformeCrossPreviewColumn } from '../../../constants/informeGeneration';
import type { InformeGenerationReport } from '../types';
import classes from '../InformeGenerationModal.module.css';

export function CrossColumnsPickerModal({
  report
}: {
  report: InformeGenerationReport;
}) {
  const picker = report.crossColumnPicker;

  return (
    <Modal
      opened={picker.opened}
      onClose={picker.close}
      centered
      size={620}
      zIndex={1200}
      title={
        <div className={classes.columnPickerTitleWrap}>
          <Text className={classes.columnPickerTitle}>Columnas del informe</Text>
          <Text className={classes.columnPickerSubtitle}>
            Elegí las columnas para el cruce: {picker.activeCrossName}
          </Text>
        </div>
      }
      classNames={{
        overlay: classes.columnPickerOverlay,
        content: classes.columnPickerContent,
        header: classes.columnPickerHeader,
        close: classes.columnPickerCloseButton,
        body: classes.columnPickerBody
      }}
    >
      <div className={classes.columnPickerLists}>
        <ColumnList
          title="Columnas disponibles"
          columns={picker.availableColumns}
          emptyLabel="Sin columnas disponibles"
          selectedColumnKeys={picker.selectedAvailableColumnKeys}
          onSelect={picker.selectAvailableColumn}
        />
        <div className={classes.columnPickerActions}>
          <ActionIcon
            aria-label="Agregar columnas visibles"
            className={classes.columnPickerActionButton}
            disabled={picker.selectedAvailableColumnKeys.length === 0}
            onClick={picker.addSelectedColumn}
            variant="default"
            size="lg"
          >
            <IconArrowNarrowRight size={18} stroke={2} />
          </ActionIcon>
          <ActionIcon
            aria-label="Quitar columnas visibles"
            className={classes.columnPickerActionButton}
            disabled={picker.selectedVisibleColumnKeys.length === 0}
            onClick={picker.removeSelectedColumn}
            variant="default"
            size="lg"
          >
            <IconArrowNarrowLeft size={18} stroke={2} />
          </ActionIcon>
        </div>
        <ColumnList
          title="Columnas visibles"
          columns={picker.visibleColumns}
          emptyLabel="Sin columnas visibles"
          selectedColumnKeys={picker.selectedVisibleColumnKeys}
          onSelect={picker.selectVisibleColumn}
          draggable
          dragOverColumnKey={picker.dragOverDraftColumnKey}
          draggingColumnKey={picker.draggingDraftColumnKey}
          onDragOverColumnChange={picker.setDragOverDraftColumnKey}
          onDraggingColumnChange={picker.setDraggingDraftColumnKey}
          onReorder={picker.reorderDraftColumn}
        />
      </div>

      <div className={classes.columnPickerFooter}>
        <Button
          variant="default"
          className={classes.ghostButton}
          onClick={picker.close}
        >
          Cancelar
        </Button>
        <Button className={classes.primaryButton} onClick={picker.confirm}>
          Aceptar
        </Button>
      </div>
    </Modal>
  );
}

function ColumnList({
  columns,
  dragOverColumnKey,
  draggable = false,
  draggingColumnKey,
  emptyLabel,
  onDragOverColumnChange,
  onDraggingColumnChange,
  onReorder,
  onSelect,
  selectedColumnKeys,
  title
}: {
  columns: InformeCrossPreviewColumn[];
  dragOverColumnKey?: string | null;
  draggable?: boolean;
  draggingColumnKey?: string | null;
  emptyLabel: string;
  onDragOverColumnChange?: (columnKey: string | null) => void;
  onDraggingColumnChange?: (columnKey: string | null) => void;
  onReorder?: (sourceColumnKey: string, targetColumnKey: string) => void;
  onSelect: (columnKey: string) => void;
  selectedColumnKeys: string[];
  title: string;
}) {
  return (
    <Card className={classes.columnPickerCard} radius="lg" padding={0}>
      <div className={classes.columnPickerListTitle}>{title}</div>
      <Stack gap="xs" className={classes.columnPickerList}>
        {columns.length > 0 ? (
          columns.map((column) => {
            const isSelected = selectedColumnKeys.includes(column.key);

            return (
              <ColumnListRow
                key={column.key}
                column={column}
                dragOverColumnKey={dragOverColumnKey}
                draggable={draggable}
                draggingColumnKey={draggingColumnKey}
                isSelected={isSelected}
                onDragOverColumnChange={onDragOverColumnChange}
                onDraggingColumnChange={onDraggingColumnChange}
                onReorder={onReorder}
                onSelect={onSelect}
              />
            );
          })
        ) : (
          <Text className={classes.columnPickerEmptyState}>{emptyLabel}</Text>
        )}
      </Stack>
    </Card>
  );
}

function ColumnListRow({
  column,
  dragOverColumnKey,
  draggable,
  draggingColumnKey,
  isSelected,
  onDragOverColumnChange,
  onDraggingColumnChange,
  onReorder,
  onSelect
}: {
  column: InformeCrossPreviewColumn;
  dragOverColumnKey?: string | null;
  draggable: boolean;
  draggingColumnKey?: string | null;
  isSelected: boolean;
  onDragOverColumnChange?: (columnKey: string | null) => void;
  onDraggingColumnChange?: (columnKey: string | null) => void;
  onReorder?: (sourceColumnKey: string, targetColumnKey: string) => void;
  onSelect: (columnKey: string) => void;
}) {
  const handleDragStart: DragEventHandler<HTMLButtonElement> = (event) => {
    if (!draggable) {
      return;
    }

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', column.key);
    onDraggingColumnChange?.(column.key);
  };

  const handleDragEnd = () => {
    onDraggingColumnChange?.(null);
    onDragOverColumnChange?.(null);
  };

  const handleDragOver: DragEventHandler<HTMLButtonElement> = (event) => {
    if (!draggable || !draggingColumnKey || draggingColumnKey === column.key) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    onDragOverColumnChange?.(column.key);
  };

  const handleDragLeave: DragEventHandler<HTMLButtonElement> = (event) => {
    const relatedTarget = event.relatedTarget;

    if (
      relatedTarget instanceof Node &&
      event.currentTarget.contains(relatedTarget)
    ) {
      return;
    }

    onDragOverColumnChange?.(null);
  };

  const handleDrop: DragEventHandler<HTMLButtonElement> = (event) => {
    if (!draggable) {
      return;
    }

    event.preventDefault();
    const sourceColumnKey =
      event.dataTransfer.getData('text/plain') || draggingColumnKey;

    if (sourceColumnKey) {
      onReorder?.(sourceColumnKey, column.key);
    }

    onDraggingColumnChange?.(null);
    onDragOverColumnChange?.(null);
  };

  const rowClassName = [
    classes.columnPickerRow,
    isSelected ? classes.columnPickerRowSelected : null,
    draggingColumnKey === column.key ? classes.columnPickerRowDragging : null,
    dragOverColumnKey === column.key ? classes.columnPickerRowDragOver : null
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={rowClassName}
      draggable={draggable}
      aria-pressed={isSelected}
      onClick={() => onSelect(column.key)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {draggable ? (
        <span
          aria-hidden="true"
          className={classes.columnPickerDragHandle}
          title={`Reordenar columna ${column.label}`}
        >
          <IconDragDrop size={14} />
        </span>
      ) : null}
      <span
        aria-hidden="true"
        className={[
          classes.columnPickerCheckbox,
          isSelected ? classes.columnPickerCheckboxChecked : null
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isSelected ? <IconCheck size={12} /> : null}
      </span>
      <Text className={classes.columnPickerLabel}>{column.label}</Text>
    </button>
  );
}
