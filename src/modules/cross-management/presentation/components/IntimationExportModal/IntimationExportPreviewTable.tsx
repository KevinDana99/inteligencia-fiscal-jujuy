import { Table, Text } from '@mantine/core'
import type { IntimationTemplateColumn } from '@/modules/configuration-module/presentation/hooks/intimation-template'
import { INTIMATION_EXPORT_TABLE_TITLE } from '../../constants/intimationExportLabels'
import classes from './IntimationExportPreview.module.css'

interface IntimationExportPreviewTableProps {
  columns: IntimationTemplateColumn[]
  rows: Array<{
    id: string
    cells: Array<{ id: string; value: string }>
  }>
}

export function IntimationExportPreviewTable({
  rows,
  columns
}: IntimationExportPreviewTableProps) {
  return (
    <div className={classes.previewTableWrap}>
      <Text className={classes.previewTableTitle}>
        {INTIMATION_EXPORT_TABLE_TITLE}
      </Text>

      <Table
        className={classes.previewTable}
        withTableBorder={false}
        withColumnBorders={false}
      >
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th key={column.id} className={classes.previewTableHeader}>
                {column.value}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.cells.map((cell) => (
                <Table.Td key={cell.id} className={classes.previewTableCell}>
                  {cell.value}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  )
}
