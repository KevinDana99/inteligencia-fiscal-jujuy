import { Badge, Table, Text } from '@mantine/core';
import type { IUnifiedRegisterInterventionOrder } from '../../../../data/models/UnifiedRegister';
import {
  ORDER_AMOUNT_CLASS_KEYS,
  ORDER_AMOUNT_COLOR,
  ORDER_STATUS_CLASS_KEYS
} from '../../../constants/unifiedRegisterPreviewStyles';
import { formatNullableDetailCell, getNullableRecordKey } from '../../../utils/unifiedRegisterDetailRecords';
import { getStatusClass } from '../../../utils/unifiedRegisterPreviewStyles';
import type { PreviewController } from '../types';
import { Pager } from './shared/Pager';
import { RecordsStateRow } from './shared/RecordsStateRow';
import { RecordsTable } from './shared/RecordsTable';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type InterventionOrdersTableProps = {
  preview: PreviewController;
};

export function InterventionOrdersTable({ preview }: InterventionOrdersTableProps) {
  return (
    <>
      <RecordsTable
        title="Órdenes de Intervención"
        badgeLabel={
          preview.isInterventionOrdersPagePending && !preview.interventionOrders.length
            ? 'Cargando...'
            : `${preview.interventionOrdersTotalItems} registros`
        }
        columns={['N° OI', 'Período', 'Motivo', 'Monto', 'Estado']}
        rows={<InterventionRows preview={preview} />}
        footer={
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
        }
      />
      {preview.interventionOrdersError && preview.interventionOrders.length ? (
        <Text className={classes.modalText} c="red">{preview.interventionOrdersError}</Text>
      ) : null}
    </>
  );
}

function InterventionRows({ preview }: InterventionOrdersTableProps) {
  if (preview.interventionOrdersError && !preview.interventionOrders.length) {
    return <RecordsStateRow colSpan={5} message={preview.interventionOrdersError} tone="error" />;
  }

  if (preview.isInterventionOrdersPagePending && !preview.interventionOrders.length) {
    return <RecordsStateRow colSpan={5} message="Cargando órdenes de intervención..." />;
  }

  if (!preview.interventionOrders.length) {
    return <RecordsStateRow colSpan={5} message="No hay órdenes de intervención registradas." />;
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

  return (
    <Table.Tr>
      <Table.Td className={classes.orderCodeCellCell}>
        <span className={classes.orderCodeCell}>{formatNullableDetailCell(order.id)}</span>
      </Table.Td>
      <Table.Td className={classes.mutedCell}>{formatNullableDetailCell(order.period)}</Table.Td>
      <Table.Td>{formatNullableDetailCell(order.reason)}</Table.Td>
      <Table.Td className={`${classes.amountCell} ${amountClass ?? ''}`} style={{ color: order.status ? ORDER_AMOUNT_COLOR[order.status] : undefined }}>
        {formatNullableDetailCell(order.amount)}
      </Table.Td>
      <Table.Td className={classes.statusCell}>
        {order.status ? (
          <Badge radius="xl" className={`${statusClass} ${classes.statusBadge}`} classNames={{ label: classes.statusBadgeLabel }}>
            {order.status}
          </Badge>
        ) : null}
      </Table.Td>
    </Table.Tr>
  );
}
