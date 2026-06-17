import { ActionIcon, Table } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import {
  formatExplorerRegisterCellValue,
  resolveExplorerRegisterRowValue
} from '../../../utils';
import type { ExplorerRegisterController } from '../types';
import classes from '../styles/results.module.css';
import { ExplorerRegisterPaginationBar } from './ExplorerRegisterPaginationBar';

export function ExplorerRegisterResultsTable({
  controller
}: {
  controller: ExplorerRegisterController;
}) {
  const result = controller.result;

  if (!result) {
    return null;
  }

  return (
    <div className={classes.tableWrap}>
      <Table withColumnBorders={false} className={classes.table}>
        <Table.Thead className={classes.thead}>
          <Table.Tr>
            <Table.Th className={`${classes.th} ${classes.xHeader}`} />
            {result.columns.map((column) => (
              <Table.Th key={column.code} className={classes.th}>
                {column.name}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {controller.visibleRows.map((row) => (
            <Table.Tr key={row.cuit}>
              <Table.Td className={classes.td}>
                <ActionIcon
                  variant="subtle"
                  radius="xl"
                  className={classes.removeButton}
                  onClick={() => controller.deselectRow(row.cuit)}
                  aria-label={`Deseleccionar ${row.businessName}`}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Table.Td>
              {result.columns.map((column) => (
                <Table.Td key={column.code} className={classes.td}>
                  {formatExplorerRegisterCellValue(
                    resolveExplorerRegisterRowValue(row, column)
                  )}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <ExplorerRegisterPaginationBar controller={controller} />
    </div>
  );
}
