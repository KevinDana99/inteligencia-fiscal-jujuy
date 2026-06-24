import { Badge, Table, Text } from "@mantine/core";
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
import { RecordsTable } from "./shared/RecordsTable";
import classes from "../UnifiedRegisterPreviewPage.module.css";

type MercurioTableProps = {
  preview: PreviewController;
};

export function MercurioTable({ preview }: MercurioTableProps) {
  return (
    <>
      <RecordsTable
        title="Pases Mercurio"
        badgeLabel={
          preview.isFinesPagePending && !preview.fines.length
            ? "Cargando..."
            : `${preview.finesTotalItems} registros`
        }
        columns={["N°", "Fecha", "Descripción", "Monto", "Estado", "Tipo"]}
        rows={<MercurioRows preview={preview} />}
        footer={
          <Pager
            current={preview.finesCurrentPage}
            total={preview.finesTotalPages || 1}
            onPrevious={preview.goToPreviousFinePage}
            onNext={preview.goToNextFinePage}
            disabled={
              preview.isFinesPagePending || preview.finesTotalPages <= 1
            }
          />
        }
      />
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
      <Table.Td className={classes.mutedCell}>
        {typeBadgeStyle && fine.type ? (
          <Badge
            radius="xl"
            styles={{
              root: {
                background: typeBadgeStyle.background,
                color: typeBadgeStyle.color,
                padding: "2px 8px",
                textAlign: "center",
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
