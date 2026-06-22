import { Text } from '@mantine/core';
import type { IUnifiedRegisterDetail } from '../../../../data/models/UnifiedRegister';
import { getRiskClass } from '../../../utils/unifiedRegisterPreviewStyles';
import type { PreviewController } from '../types';
import classes from '../UnifiedRegisterPreviewPage.module.css';

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

  return '';
}

export function PreviewHeaderSummary({ item, preview }: PreviewHeaderSummaryProps) {
  const alternateAddress = getHeaderAlternateAddress(item, preview);
  const riskLevelLabel = item.riskLevel || '-';

  return (
    <div className={classes.headerTop}>
      <div className={classes.headerMain}>
        <Text className={classes.cuit}>CUIT {item.cuit}</Text>
        <Text className={classes.title}>{item.businessName}</Text>
        <div className={classes.pillRow}>
          <span className={`${classes.pill} ${classes.statusPill}`}>
            <span className={classes.statusDot} />
            {item.status}
          </span>
          {item.regime ? (
            <span className={`${classes.pill} ${classes.regimeText}`}>
              {item.regime}
            </span>
          ) : null}
          <span className={`${classes.pill} ${classes.controlPill}`}>
            Control IF: {item.controlLotsLabel}
          </span>
          {item.activities.map((activity) => (
            <span
              key={activity.id}
              className={`${classes.pill} ${
                activity.type === 'Primaria'
                  ? classes.activityPrimaryPill
                  : classes.activitySecondaryPill
              }`}
            >
              {activity.label}
            </span>
          ))}
        </div>
        <div className={classes.metaRow}>
          <Text className={classes.metaText}>
            <strong>Inicio actividad:</strong> {item.startedAt}
          </Text>
          <Text className={classes.metaText}>
            <strong>Jurisdicción:</strong> {item.jurisdiction}
          </Text>
          <Text className={classes.metaText}>
            <strong>Domicilio fiscal:</strong> {item.fiscalAddress}
          </Text>
          <Text className={classes.metaText}>
            <strong>Domicilio alternativo:</strong> {alternateAddress}
          </Text>
        </div>
      </div>
      <div className={`${classes.riskBox} ${getRiskClass(classes, item.riskLevel)}`}>
        <Text className={classes.riskLevel}>{riskLevelLabel}</Text>
        <Text className={classes.riskLabel}>Riesgo</Text>
      </div>
    </div>
  );
}
