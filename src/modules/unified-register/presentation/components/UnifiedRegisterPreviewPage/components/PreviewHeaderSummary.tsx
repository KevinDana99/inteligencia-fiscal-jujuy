import { Text } from "@mantine/core";
import type { IUnifiedRegisterDetail } from "../../../../data/models/UnifiedRegister";
import { getRiskClass } from "../../../utils/unifiedRegisterPreviewStyles";
import { formatUnifiedRegisterHeaderText } from "../../../utils/formatUnifiedRegisterHeaderText";
import type { PreviewController } from "../types";
import classes from "../UnifiedRegisterPreviewPage.module.css";

type PreviewHeaderSummaryProps = {
  item: IUnifiedRegisterDetail;
  preview: PreviewController;
};

function getHeaderAlternateAddress(
  item: IUnifiedRegisterDetail,
  preview: PreviewController
) {
  const hydratedAddress = preview.addresses.find((address) =>
    address.address.trim()
  )?.address;

  if (hydratedAddress) {
    return hydratedAddress;
  }

  if (preview.isAddressesHydrating || preview.addressActionError) {
    return item.alternateAddress;
  }

  return "";
}

export function PreviewHeaderSummary({
  item,
  preview,
}: PreviewHeaderSummaryProps) {
  const alternateAddress = formatUnifiedRegisterHeaderText(
    getHeaderAlternateAddress(item, preview)
  );
  const riskLevelLabel = formatUnifiedRegisterHeaderText(item.riskLevel);

  return (
    <div className={classes.headerTop}>
      <div className={classes.headerMain}>
        <Text className={classes.cuit}>
          CUIT {formatUnifiedRegisterHeaderText(item.cuit)}
        </Text>
        <Text className={classes.title}>
          {formatUnifiedRegisterHeaderText(item.businessName)}
        </Text>
        <div className={classes.pillRow}>
          <span className={`${classes.pill} ${classes.statusPill}`}>
            <span className={classes.statusDot} />
            {formatUnifiedRegisterHeaderText(item.status)}
          </span>
          <span className={`${classes.pill} ${classes.regimeText}`}>
            {formatUnifiedRegisterHeaderText(item.regime)}
          </span>
          <span className={`${classes.pill} ${classes.controlPill}`}>
            Control IF: {formatUnifiedRegisterHeaderText(item.controlLotsLabel)}
          </span>
          {item.activities.length > 0 ? (
            item.activities.map((activity) => (
              <span
                key={activity.id}
                className={`${classes.pill} ${
                  activity.type === "Primaria"
                    ? classes.activityPrimaryPill
                    : classes.activitySecondaryPill
                }`}
              >
                {formatUnifiedRegisterHeaderText(activity.label)}
              </span>
            ))
          ) : (
            <span className={`${classes.pill} ${classes.activityPrimaryPill}`}>
              {formatUnifiedRegisterHeaderText(null)}
            </span>
          )}
        </div>
        <div className={classes.metaRow}>
          <Text className={classes.metaText}>
            <strong>Inicio actividad:</strong>{" "}
            {formatUnifiedRegisterHeaderText(item.startedAt)}
          </Text>
          <Text className={classes.metaText}>
            <strong>Jurisdicción:</strong>{" "}
            {formatUnifiedRegisterHeaderText(item.jurisdiction)}
          </Text>
          <Text className={classes.metaText}>
            <strong>Domicilio fiscal:</strong>{" "}
            {formatUnifiedRegisterHeaderText(item.fiscalAddress)}
            <strong>Jurisdicción sede:</strong> {item.headquartersJurisdiction}
          </Text>
          <Text className={classes.metaText}>
            <strong>Jurisdicciones extrañas:</strong>{" "}
            {item.strangeJurisdictions}
          </Text>
          <Text className={classes.metaText}>
            <strong>Domicilio fiscal:</strong> {item.fiscalAddress}
          </Text>
          <Text className={classes.metaText}>
            <strong>Domicilio alternativo:</strong> {alternateAddress}
          </Text>
        </div>
      </div>
      <div
        className={`${classes.riskBox} ${getRiskClass(
          classes,
          item.riskLevel
        )}`}
      >
        <Text className={classes.riskLevel}>{riskLevelLabel}</Text>
        <Text className={classes.riskLabel}>Riesgo</Text>
      </div>
    </div>
  );
}
