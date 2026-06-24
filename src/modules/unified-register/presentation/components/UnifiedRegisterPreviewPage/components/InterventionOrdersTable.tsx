import { Badge, Card, Group, Table, Text } from '@mantine/core';
import type { IUnifiedRegisterInterventionOrder } from '../../../../data/models/UnifiedRegister';
import {
  ORDER_AMOUNT_CLASS_KEYS,
  ORDER_AMOUNT_COLOR,
  ORDER_STATUS_CLASS_KEYS
} from '../../../constants/unifiedRegisterPreviewStyles';
import {
  UNIFIED_REGISTER_INTERVENTION_ORDERS_COLUMNS,
  UNIFIED_REGISTER_INTERVENTION_ORDERS_EMPTY_MESSAGE,
  UNIFIED_REGISTER_INTERVENTION_ORDERS_LOADING_BADGE,
  UNIFIED_REGISTER_INTERVENTION_ORDERS_LOADING_MESSAGE,
  UNIFIED_REGISTER_INTERVENTION_ORDERS_TITLE
} from '../../../constants/unifiedRegisterInterventionOrders';
import { formatNullableDetailCell, getNullableRecordKey } from '../../../utils/unifiedRegisterDetailRecords';
import { getStatusClass } from '../../../utils/unifiedRegisterPreviewStyles';
import type { PreviewController } from '../types';
import { Pager } from './shared/Pager';
import { RecordsStateRow } from './shared/RecordsStateRow';
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
            <Badge className={classes.tableCountBadge} radius="xl">
              {preview.isInterventionOrdersPagePending &&
              !preview.interventionOrders.length
                ? UNIFIED_REGISTER_INTERVENTION_ORDERS_LOADING_BADGE
                : `${preview.interventionOrdersTotalItems} registros`}
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
              <InterventionRows preview={preview} />
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

function InterventionRows({ preview }: InterventionOrdersTableProps) {
  if (preview.interventionOrdersError && !preview.interventionOrders.length) {
    return <RecordsStateRow colSpan={7} message={preview.interventionOrdersError} tone="error" />;
  }

  if (preview.isInterventionOrdersPagePending && !preview.interventionOrders.length) {
    return (
      <RecordsStateRow
        colSpan={7}
        message={UNIFIED_REGISTER_INTERVENTION_ORDERS_LOADING_MESSAGE}
      />
    );
  }

  if (!preview.interventionOrders.length) {
    return (
      <RecordsStateRow
        colSpan={7}
        message={UNIFIED_REGISTER_INTERVENTION_ORDERS_EMPTY_MESSAGE}
      />
    );
  }

  return preview.interventionOrders.map((order, index) => (
    <InterventionRow key={getNullableRecordKey(order.id, 'order', index)} order={order} />
  ));
}

function InterventionRow({ order }: { order: IUnifiedRegisterInterventionOrder }) {
  const amountClass = getStatusClass(classes, ORDER_AMOUNT_CLASS_KEYS, order.status);
  const statusClass = getStatusClass(
    classes,
    ORDER_STATUS_CLASS_KEYS,
    order.status,
    classes.badgeNeutral
  );
  const instruction = order.instruction ?? order.reason;
  const debt = order.debt ?? order.amount;

  return (
    <Table.Tr className={classes.interventionRow}>
      <Table.Td className={classes.orderCodeCellCell}>
        <span className={classes.orderCodeCell}>{formatNullableDetailCell(order.id)}</span>
      </Table.Td>
      <Table.Td className={classes.mutedCell}>
        {formatNullableDetailCell(order.origin)}
      </Table.Td>
      <Table.Td className={classes.descriptionCell}>
        {formatNullableDetailCell(instruction)}
      </Table.Td>
      <Table.Td className={classes.mutedCell}>{formatNullableDetailCell(order.period)}</Table.Td>
      <Table.Td
        className={`${classes.interventionDebtCell} ${amountClass ?? ''}`}
        style={{ color: order.status ? ORDER_AMOUNT_COLOR[order.status] : undefined }}
      >
        {formatNullableDetailCell(debt)}
      </Table.Td>
      <Table.Td className={classes.interventionBiCell}>
        {formatNullableDetailCell(order.declaredBi)}
      </Table.Td>
      <Table.Td className={classes.interventionStatusCell}>
        {order.status ? (
          <Badge radius="xl" className={`${statusClass} ${classes.statusBadge}`} classNames={{ label: classes.statusBadgeLabel }}>
            {order.status}
          </Badge>
        ) : null}
      </Table.Td>
    </Table.Tr>
  );
}
