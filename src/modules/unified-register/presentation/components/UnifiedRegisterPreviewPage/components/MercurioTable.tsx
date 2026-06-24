import { Badge, Card, Table, Text } from "@mantine/core";
import type { IUnifiedRegisterFine } from "../../../../data/models/UnifiedRegister";
import {
  FINE_AMOUNT_CLASS_KEYS,
  FINE_AMOUNT_COLOR,
  FINE_STATUS_CLASS_KEYS,
} from "../../../constants/unifiedRegisterPreviewStyles";
import { getUnifiedRegisterMercurioTypeBadgeStyle } from "../../../utils/getUnifiedRegisterMercurioTypeBadgeStyle";
import {
  formatNullableDetailCell,
  getNullableRecordKey,
} from "../../../utils/unifiedRegisterDetailRecords";
import { getStatusClass } from "../../../utils/unifiedRegisterPreviewStyles";
import type { PreviewController } from "../types";
import { Pager } from "./shared/Pager";
import { RecordsStateRow } from "./shared/RecordsStateRow";
import classes from "../UnifiedRegisterPreviewPage.module.css";

type MercurioTableProps = {
  preview: PreviewController;
};

export function MercurioTable({ preview }: MercurioTableProps) {
  return (
    <>
      <Card className={classes.tableCard} padding="md" radius="lg">
        <div className={classes.tableHeader}>
          <div className={classes.sectionHeader}>
            <Text className={classes.sectionTitle}>Pases Mercurio</Text>
            <Badge className={classes.tableCountBadge} radius="xl">
              {preview.isFinesPagePending && !preview.fines.length
                ? "Cargando..."
                : `${preview.finesTotalItems} registros`}
            </Badge>
          </div>
        </div>

        <div className={classes.tableWrapper}>
          <Table
            withTableBorder={false}
            withColumnBorders={false}
            withRowBorders={false}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>N°</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Descripción</Table.Th>
                <Table.Th>Monto</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th className={classes.interventionCenterHeader}>
                  Tipo
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <MercurioRows preview={preview} />
            </Table.Tbody>
          </Table>
        </div>

        <div className={classes.tableFooter}>
          <Pager
            current={preview.finesCurrentPage}
            total={preview.finesTotalPages || 1}
            onPrevious={preview.goToPreviousFinePage}
            onNext={preview.goToNextFinePage}
            disabled={
              preview.isFinesPagePending || preview.finesTotalPages <= 1
            }
          />
        </div>
      </Card>
      {preview.fineActionError && preview.fines.length ? (
        <Text className={classes.modalText} c="red">
          {preview.fineActionError}
        </Text>
      ) : null}
    </>
  );
}

function MercurioRows({ preview }: MercurioTableProps) {
  if (preview.fineActionError && !preview.fines.length) {
    return (
      <RecordsStateRow
        colSpan={6}
        message={preview.fineActionError}
        tone="error"
      />
    );
  }

  if (preview.isFinesPagePending && !preview.fines.length) {
    return <RecordsStateRow colSpan={6} message="Cargando Pases Mercurio..." />;
  }

  if (!preview.fines.length) {
    return (
      <RecordsStateRow
        colSpan={6}
        message="No hay Pases Mercurio registradas."
      />
    );
  }

  return preview.fines.map((fine, index) => (
    <MercurioRow
      key={getNullableRecordKey(fine.id, "fine", index)}
      fine={fine}
    />
  ));
}

function MercurioRow({ fine }: { fine: IUnifiedRegisterFine }) {
  const amountClass = getStatusClass(
    classes,
    FINE_AMOUNT_CLASS_KEYS,
    fine.status
  );
  const statusClass = getStatusClass(
    classes,
    FINE_STATUS_CLASS_KEYS,
    fine.status,
    classes.badgeNeutral
  );
  const typeBadgeStyle = getUnifiedRegisterMercurioTypeBadgeStyle(fine.type);

  return (
    <Table.Tr>
      <Table.Td className={classes.mutedCodeCell}>
        {formatNullableDetailCell(fine.id)}
      </Table.Td>
      <Table.Td className={classes.mutedCell}>
        {formatNullableDetailCell(fine.issuedAt)}
      </Table.Td>
      <Table.Td className={classes.descriptionCell}>
        {formatNullableDetailCell(fine.description)}
      </Table.Td>
      <Table.Td
        className={`${classes.amountCell} ${amountClass ?? ""}`}
        style={{
          color: fine.status ? FINE_AMOUNT_COLOR[fine.status] : undefined,
        }}
      >
        {formatNullableDetailCell(fine.amount)}
      </Table.Td>
      <Table.Td className={classes.statusCell}>
        {fine.status ? (
          <Badge
            radius="xl"
            className={`${statusClass} ${classes.statusBadge}`}
            classNames={{ label: classes.statusBadgeLabel }}
          >
            {fine.status}
          </Badge>
        ) : null}
      </Table.Td>
      <Table.Td className={classes.interventionStatusCell}>
        {typeBadgeStyle && fine.type ? (
          <Badge
            radius="xl"
            styles={{
              root: {
                background: typeBadgeStyle.background,
                color: typeBadgeStyle.color,
                padding: "2px 8px",
                textAlign: "center",
                margin: "0 auto",
              },
              label: {
                fontSize: "10px",
                fontWeight: 600,
                lineHeight: 1.2,
                textTransform: "none",
              },
            }}
          >
            {fine.type}
          </Badge>
        ) : (
          formatNullableDetailCell(fine.type)
        )}
      </Table.Td>
    </Table.Tr>
  );
}
