import { Badge, Card, Table } from '@mantine/core';
import { SOURCE_STATUS_CLASS_KEYS } from '../../../constants/unifiedRegisterPreviewStyles';
import { getStatusClass } from '../../../utils/unifiedRegisterPreviewStyles';
import type { PreviewController } from '../types';
import { Pager } from './shared/Pager';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type SourceTablesCardProps = {
  preview: PreviewController;
};

export function SourceTablesCard({ preview }: SourceTablesCardProps) {
  return (
    <Card className={classes.tableCard} padding={0} radius="lg">
      <SourceTabs preview={preview} />
      <SourceRows preview={preview} />
      <div className={classes.tableFooter}>
        <Pager current={1} total={1} disabled />
      </div>
    </Card>
  );
}

function SourceTabs({ preview }: SourceTablesCardProps) {
  return (
    <div className={classes.tabsRow}>
      {preview.sourceTables.map((table) => (
        <button
          key={table.id}
          className={`${classes.tabButton} ${
            preview.activeSourceTableId === table.id ? classes.tabButtonActive : ''
          }`}
          onClick={() => preview.setActiveSourceTableId(table.id)}
        >
          {table.label}
        </button>
      ))}
    </div>
  );
}

function SourceRows({ preview }: SourceTablesCardProps) {
  const table = preview.activeSourceTable;

  return (
    <div className={classes.tableWrapper}>
      <Table className={classes.sourceTable} withTableBorder={false} withColumnBorders={false} withRowBorders={false}>
        <Table.Thead>
          <Table.Tr>
            {table.columns.map((column) => <Table.Th key={column}>{column}</Table.Th>)}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {table.rows.map((row, rowIndex) => (
            <Table.Tr key={`${table.id}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <SourceCell
                  key={`${table.id}-${rowIndex}-${cellIndex}`}
                  cell={cell}
                  column={table.columns[cellIndex] ?? ''}
                  isLastCell={cellIndex === row.length - 1}
                />
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}

function SourceCell({
  cell,
  column,
  isLastCell
}: {
  cell: string;
  column: string;
  isLastCell: boolean;
}) {
  const isDifferenceColumn = column.toLowerCase() === 'diferencia';
  const isCriticalValue = isDifferenceColumn && cell.trim().startsWith('+');
  const isPositiveDifference = isDifferenceColumn && !cell.trim().startsWith('+');

  if (isLastCell) {
    return (
      <Table.Td className={classes.sourceStatusCell}>
        <Badge radius="xl" className={`${getStatusClass(classes, SOURCE_STATUS_CLASS_KEYS, cell, classes.badgeNeutral)} ${classes.sourceStatusBadge}`} classNames={{ root: classes.sourceStatusBadgeRoot, label: classes.sourceStatusBadgeLabel }}>
          {cell}
        </Badge>
      </Table.Td>
    );
  }

  return (
    <Table.Td
      className={isCriticalValue ? classes.amountCritical : ''}
      style={isCriticalValue ? { color: '#dc2626', fontWeight: 600 } : isPositiveDifference ? { color: '#059669', fontWeight: 600 } : undefined}
    >
      {cell}
    </Table.Td>
  );
}
