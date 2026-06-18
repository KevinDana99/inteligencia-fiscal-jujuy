import { ActionIcon, Button, Modal, Text } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconX } from '@tabler/icons-react';
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
      withCloseButton={false}
      centered
      size={720}
      zIndex={1200}
      classNames={{
        overlay: classes.columnPickerOverlay,
        content: classes.columnPickerContent,
        body: classes.columnPickerBody
      }}
    >
      <div className={classes.columnPickerHeader}>
        <div>
          <Text className={classes.columnPickerTitle}>Columnas del informe</Text>
          <Text className={classes.columnPickerSubtitle}>
            Elegí las columnas para el cruce: {picker.activeCrossName}
          </Text>
        </div>
        <button
          type="button"
          className={classes.columnPickerCloseButton}
          onClick={picker.close}
          aria-label="Cerrar selector de columnas"
        >
          <IconX size={18} stroke={2.4} />
        </button>
      </div>

      <div className={classes.columnPickerLists}>
        <ColumnList
          title="Columnas disponibles"
          columns={picker.availableColumns}
          selectedColumnKey={picker.selectedAvailableColumnKey}
          onSelect={picker.selectAvailableColumn}
        />
        <div className={classes.columnPickerActions}>
          <ActionIcon
            aria-label="Agregar columna visible"
            className={classes.columnPickerActionButton}
            disabled={!picker.selectedAvailableColumnKey}
            onClick={picker.addSelectedColumn}
            variant="default"
          >
            <IconArrowRight size={16} stroke={2} />
          </ActionIcon>
          <ActionIcon
            aria-label="Quitar columna visible"
            className={classes.columnPickerActionButton}
            disabled={!picker.selectedVisibleColumnKey}
            onClick={picker.removeSelectedColumn}
            variant="default"
          >
            <IconArrowLeft size={16} stroke={2} />
          </ActionIcon>
        </div>
        <ColumnList
          title="Columnas visibles"
          columns={picker.visibleColumns}
          selectedColumnKey={picker.selectedVisibleColumnKey}
          onSelect={picker.selectVisibleColumn}
          highlighted
        />
      </div>

      <Text className={classes.columnPickerHint}>
        Hacé click en una columna para moverla entre disponibles y visibles.
      </Text>

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
  highlighted,
  onSelect,
  selectedColumnKey,
  title
}: {
  columns: InformeCrossPreviewColumn[];
  highlighted?: boolean;
  onSelect: (columnKey: string) => void;
  selectedColumnKey: string | null;
  title: string;
}) {
  return (
    <div className={classes.columnPickerListBlock}>
      <Text className={classes.columnPickerListTitle}>{title}</Text>
      <div
        className={classes.columnPickerList}
        data-highlighted={highlighted || undefined}
      >
        {columns.map((column) => (
          <button
            key={column.key}
            type="button"
            className={classes.columnPickerRow}
            data-selected={selectedColumnKey === column.key || undefined}
            onClick={() => onSelect(column.key)}
          >
            {column.label}
          </button>
        ))}
      </div>
    </div>
  );
}
