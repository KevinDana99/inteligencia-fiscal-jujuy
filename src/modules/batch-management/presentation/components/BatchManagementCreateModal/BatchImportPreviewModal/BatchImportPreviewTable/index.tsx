'use client'

import { Badge, Checkbox, Stack, Table, Text } from '@mantine/core'
import type { ReturnTypeOfUseBatchImportPreviewModal } from '../useBatchImportPreviewModal'
import classes from './BatchImportPreviewTable.module.css'

type BatchImportPreviewTableProps = {
  rows: ReturnTypeOfUseBatchImportPreviewModal['rows']
}

export function BatchImportPreviewTable({ rows }: BatchImportPreviewTableProps) {
  return (
    <div className={classes.previewTableWrap}>
      <Table withTableBorder={false} withColumnBorders={false} className={classes.previewTable}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>CUIT</Table.Th>
            <Table.Th>Razón Social</Table.Th>
            <Table.Th>Estado</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.id} className={row.isInvalid ? classes.previewInvalidRow : ''}>
              <Table.Td>{row.record}</Table.Td>
              <Table.Td className={row.isInvalid ? classes.previewInvalidText : classes.previewMonoText}>
                <Stack gap={4}>
                  <Text className={row.isInvalid ? classes.previewInvalidText : classes.previewMonoText}>
                    {row.originalCuit}
                  </Text>
                  {row.hasNormalizedSuggestion ? (
                    <Checkbox
                      size="xs"
                      radius="xl"
                      checked={row.isSuggestionAccepted}
                      onChange={row.onSuggestionToggle}
                      label={`Usar sugerido: ${row.normalizedSuggestion}`}
                      classNames={{
                        root: classes.previewSuggestionCheckbox,
                        label: classes.previewSuggestionLabel
                      }}
                    />
                  ) : null}
                </Stack>
              </Table.Td>
              <Table.Td className={row.isInvalid ? classes.previewInvalidText : undefined}>
                {row.businessName}
              </Table.Td>
              <Table.Td>
                <Badge
                  radius="xl"
                  className={row.isInvalid ? classes.invalidStateBadge : classes.validStateBadge}
                >
                  {row.stateLabel}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  )
}
