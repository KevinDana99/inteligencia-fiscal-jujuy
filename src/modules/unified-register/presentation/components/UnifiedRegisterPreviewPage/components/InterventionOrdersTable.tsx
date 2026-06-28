import { Badge, Card, Group, Table, Text } from '@mantine/core';
import {
  UNIFIED_REGISTER_INTERVENTION_ORDERS_COLUMNS,
  UNIFIED_REGISTER_INTERVENTION_ORDERS_COUNT_SUFFIX,
  UNIFIED_REGISTER_INTERVENTION_ORDERS_LOADING_BADGE,
  UNIFIED_REGISTER_INTERVENTION_ORDERS_TITLE
} from '../../../constants/unifiedRegisterInterventionOrders';
import type { PreviewController } from '../types';
import { InterventionOrdersTableRows } from './InterventionOrdersTableRows';
import { Pager } from './shared/Pager';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type InterventionOrdersTableProps = {
  preview: PreviewController;
};

export function InterventionOrdersTable({ preview }: InterventionOrdersTableProps) {
  return (
    <>
      <Card className={classes.tableCard} padding="md" radius="lg">
        <div className={classes.tableHeader}>
          <Group gap="xs">
            <Text className={classes.sectionTitle}>
              {UNIFIED_REGISTER_INTERVENTION_ORDERS_TITLE}
            </Text>
            <Badge
              className={classes.tableCountBadge}
              radius="xl"
              styles={{
                root: {
                  background: 'var(--mantine-color-blue-1)',
                  color: 'var(--mantine-color-blue-5)',
                  padding: '2px 8px',
                  borderRadius: '999px'
                },
                label: {
                  fontSize: '11px',
                  fontWeight: 700,
                  lineHeight: 1,
                  textTransform: 'none'
                }
              }}
            >
              {preview.isInterventionOrdersPagePending &&
              !preview.interventionOrders.length
                ? UNIFIED_REGISTER_INTERVENTION_ORDERS_LOADING_BADGE
                : `${preview.interventionOrdersTotalItems} ${UNIFIED_REGISTER_INTERVENTION_ORDERS_COUNT_SUFFIX}`}
            </Badge>
          </Group>
        </div>

        <div className={classes.tableWrapper}>
          <Table
            withTableBorder={false}
            withColumnBorders={false}
            withRowBorders={false}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{UNIFIED_REGISTER_INTERVENTION_ORDERS_COLUMNS[0]}</Table.Th>
                <Table.Th>{UNIFIED_REGISTER_INTERVENTION_ORDERS_COLUMNS[1]}</Table.Th>
                <Table.Th>{UNIFIED_REGISTER_INTERVENTION_ORDERS_COLUMNS[2]}</Table.Th>
                <Table.Th>{UNIFIED_REGISTER_INTERVENTION_ORDERS_COLUMNS[3]}</Table.Th>
                <Table.Th className={classes.interventionNumericHeader}>
                  {UNIFIED_REGISTER_INTERVENTION_ORDERS_COLUMNS[4]}
                </Table.Th>
                <Table.Th className={classes.interventionNumericHeader}>
                  {UNIFIED_REGISTER_INTERVENTION_ORDERS_COLUMNS[5]}
                </Table.Th>
                <Table.Th className={classes.interventionCenterHeader}>
                  {UNIFIED_REGISTER_INTERVENTION_ORDERS_COLUMNS[6]}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <InterventionOrdersTableRows preview={preview} />
            </Table.Tbody>
          </Table>
        </div>

        <div className={classes.tableFooter}>
          <Pager
            current={preview.interventionOrdersCurrentPage}
            total={preview.interventionOrdersTotalPages || 1}
            onPrevious={preview.goToPreviousInterventionOrderPage}
            onNext={preview.goToNextInterventionOrderPage}
            disabled={
              preview.isInterventionOrdersPagePending ||
              preview.interventionOrdersTotalPages <= 1
            }
          />
        </div>
      </Card>
      {preview.interventionOrdersError && preview.interventionOrders.length ? (
        <Text className={classes.modalText} c="red">{preview.interventionOrdersError}</Text>
      ) : null}
    </>
  );
}
