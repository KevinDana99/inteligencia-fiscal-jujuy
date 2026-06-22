'use client'

import { Badge, Group, Pagination, Select, Stack, Table, Text } from '@mantine/core'
import type { IBatchManagementItem } from '../../../../data/models/BatchManagement'
import { BATCH_MANAGEMENT_DETAIL_ITEMS_PER_PAGE_OPTIONS } from '../../../constants'
import {
  formatBatchCuit,
  getBatchContributorTypeLabel
} from '../../../utils'
import tableClasses from '../BatchManagementTable.module.css'
import classes from './BatchManagementBatchDetail.module.css'
import { useBatchManagementBatchDetail } from './useBatchManagementBatchDetail'

type BatchManagementBatchDetailProps = {
  batch: IBatchManagementItem
  onCuitPageChange: (page: number, itemsPerPage: number) => void
}

export function BatchManagementBatchDetail({
  batch,
  onCuitPageChange
}: BatchManagementBatchDetailProps) {
  const detailRegime = batch.cuits[0]?.regime
  const detail = useBatchManagementBatchDetail({
    batch,
    onCuitPageChange
  })

  return (
    <div className={classes.detailInner}>
      <Stack gap="sm">
        <Text className={classes.detailTitle}>
          CUITs en lote {batch.name}
          {detailRegime ? ` - Régimen ${detailRegime}` : ''}
        </Text>

        {detail.totalItems ? (
          <>
            <Table
              withTableBorder={false}
              withColumnBorders={false}
              className={`${tableClasses.table} ${classes.nestedTable}`}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>CUIT</Table.Th>
                  <Table.Th>Razon Social</Table.Th>
                  <Table.Th>Tipo de contribuyente</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {detail.cuits.map((cuit, index) => (
                  <Table.Tr key={cuit.id}>
                    <Table.Td className={classes.batchDate}>
                      {cuit.order || detail.firstItemNumber + index}
                    </Table.Td>
                    <Table.Td className={classes.monoText}>
                      {formatBatchCuit(cuit.cuit)}
                    </Table.Td>
                    <Table.Td>{cuit.businessName}</Table.Td>
                    <Table.Td>
                      <Badge
                        variant="filled"
                        radius="xl"
                        className={classes.regimeBadge}
                      >
                        {getBatchContributorTypeLabel(cuit.regime)}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <div className={classes.detailFooter}>
              <Text size="xs" className={classes.expandHint}>
                {detail.rangeLabel}
              </Text>
              {detail.shouldShowPaginationControls ? (
                <Group gap="sm" className={classes.detailPaginationControls}>
                  <Select
                    aria-label="CUITs por pagina"
                    value={String(detail.itemsPerPage)}
                    data={BATCH_MANAGEMENT_DETAIL_ITEMS_PER_PAGE_OPTIONS.map(
                      (option) => ({
                        value: String(option),
                        label: String(option)
                      })
                    )}
                    className={classes.detailPageSizeSelect}
                    onChange={(value) => {
                      if (value) {
                        detail.onItemsPerPageChange(Number(value))
                      }
                    }}
                  />
                  <Pagination
                    size="sm"
                    value={detail.page}
                    total={detail.totalPages}
                    disabled={detail.totalPages <= 1}
                    onChange={detail.onPageChange}
                    aria-label="Paginacion de CUITs del lote"
                  />
                </Group>
              ) : null}
            </div>
          </>
        ) : (
          <Text size="sm" className={classes.emptyState}>
            Sin CUITs para mostrar.
          </Text>
        )}
      </Stack>
    </div>
  )
}
