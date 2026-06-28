import { Checkbox, Group, Table, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { EXPLORER_REGISTER_TEXTS } from '../../../constants';
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

  const visibleCuits = controller.visibleRows.map((row) => row.cuit);
  const columnCount = result.columns.length + 1;

  return (
    <div className={classes.tableWrap}>
      <Group className={classes.searchToolbar} gap="sm">
        <TextInput
          value={controller.searchValue}
          onChange={(event) =>
            controller.setSearchValue(event.currentTarget.value)
          }
          placeholder={EXPLORER_REGISTER_TEXTS.resultsSearchPlaceholder}
          leftSection={<IconSearch size={16} />}
          className={classes.searchInput}
          classNames={{
            input: classes.searchField,
            section: classes.searchSection
          }}
        />
        <Text className={classes.resultsCount}>
          {controller.searchResultsCount} {EXPLORER_REGISTER_TEXTS.results}
        </Text>
      </Group>
      <Table withColumnBorders={false} className={classes.table}>
        <Table.Thead className={classes.thead}>
          <Table.Tr>
            <Table.Th className={`${classes.th} ${classes.selectionHeader}`}>
              <Checkbox
                checked={controller.allVisibleRowsSelected}
                indeterminate={controller.someVisibleRowsSelected}
                disabled={visibleCuits.length === 0}
                aria-label="Seleccionar resultados visibles"
                onChange={(event) =>
                  controller.setRowsSelected(
                    visibleCuits,
                    event.currentTarget.checked
                  )
                }
              />
            </Table.Th>
            {result.columns.map((column) => (
              <Table.Th key={column.code} className={classes.th}>
                {column.name}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {controller.visibleRows.length > 0 ? (
            controller.visibleRows.map((row) => (
              <Table.Tr key={row.cuit}>
                <Table.Td className={`${classes.td} ${classes.selectionCell}`}>
                  <Checkbox
                    checked={controller.isRowSelected(row.cuit)}
                    aria-label={`Seleccionar ${row.businessName}`}
                    onChange={(event) =>
                      controller.setRowSelected(
                        row.cuit,
                        event.currentTarget.checked
                      )
                    }
                  />
                </Table.Td>
                {result.columns.map((column) => (
                  <Table.Td
                    key={column.code}
                    className={`${classes.td} ${
                      column.code === 'cuit' ? classes.cuitCell : ''
                    } ${
                      column.code === 'razonSocial'
                        ? classes.businessNameCell
                        : ''
                    }`}
                  >
                    {formatExplorerRegisterCellValue(
                      resolveExplorerRegisterRowValue(row, column)
                    )}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={columnCount} className={classes.emptyCell}>
                <Text className={classes.emptyText}>
                  {EXPLORER_REGISTER_TEXTS.tableEmptyFallback}
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <ExplorerRegisterPaginationBar controller={controller} />
    </div>
  );
}
