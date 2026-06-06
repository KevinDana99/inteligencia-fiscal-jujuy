'use client'

import { Badge, Stack, Table, Text } from '@mantine/core'
import type { IBatchManagementItem } from '../../../../data/models/BatchManagement'
import {
  formatBatchCuit,
  getBatchContributorTypeLabel
} from '../../../utils'
import tableClasses from '../BatchManagementTable.module.css'
import classes from './BatchManagementBatchDetail.module.css'

type BatchManagementBatchDetailProps = {
  batch: IBatchManagementItem
}

export function BatchManagementBatchDetail({
  batch
}: BatchManagementBatchDetailProps) {
  const detailRegime = batch.cuits[0]?.regime

  return (
    <div className={classes.detailInner}>
      <Stack gap="sm">
        <Text className={classes.detailTitle}>
          CUITs en lote {batch.name}
          {detailRegime ? ` - Régimen ${detailRegime}` : ''}
        </Text>

        {batch.cuits.length ? (
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
                {batch.cuits.map((cuit, index) => (
                  <Table.Tr key={cuit.id}>
                    <Table.Td className={classes.batchDate}>{index + 1}</Table.Td>
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

            <Text size="xs" className={classes.expandHint}>
              Mostrando {batch.cuits.length} de {batch.cuitCount} CUITs
              {batch.cuits.length < batch.cuitCount ? (
                <>
                  {' · '}
                  <button type="button" className={classes.expandActionButton}>
                    Ver todos
                  </button>
                </>
              ) : null}
            </Text>
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
