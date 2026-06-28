import { Badge, Card, Table, Text } from "@mantine/core";
import type { PreviewController } from "../types";
import {
  UNIFIED_REGISTER_MERCURIO_COLUMNS,
  UNIFIED_REGISTER_MERCURIO_COUNT_SUFFIX,
  UNIFIED_REGISTER_MERCURIO_LOADING_BADGE,
  UNIFIED_REGISTER_MERCURIO_TITLE,
} from "../../../constants/unifiedRegisterMercurio";
import { MercurioTableRows } from "./MercurioTableRows";
import { Pager } from "./shared/Pager";
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
            <Text className={classes.sectionTitle}>
              {UNIFIED_REGISTER_MERCURIO_TITLE}
            </Text>
            <Badge className={classes.tableCountBadge} radius="xl">
              {preview.isFinesPagePending && !preview.fines.length
                ? UNIFIED_REGISTER_MERCURIO_LOADING_BADGE
                : `${preview.finesTotalItems} ${UNIFIED_REGISTER_MERCURIO_COUNT_SUFFIX}`}
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
                <Table.Th>{UNIFIED_REGISTER_MERCURIO_COLUMNS[0]}</Table.Th>
                <Table.Th>{UNIFIED_REGISTER_MERCURIO_COLUMNS[1]}</Table.Th>
                <Table.Th>{UNIFIED_REGISTER_MERCURIO_COLUMNS[2]}</Table.Th>
                <Table.Th>{UNIFIED_REGISTER_MERCURIO_COLUMNS[3]}</Table.Th>
                <Table.Th>{UNIFIED_REGISTER_MERCURIO_COLUMNS[4]}</Table.Th>
                <Table.Th className={classes.interventionCenterHeader}>
                  {UNIFIED_REGISTER_MERCURIO_COLUMNS[5]}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <MercurioTableRows preview={preview} />
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
