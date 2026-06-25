import { Badge, Card, Text } from '@mantine/core';
import type { IUnifiedRegisterDetail } from '../../../../data/models/UnifiedRegister';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type PreviewMetricsProps = {
  item: IUnifiedRegisterDetail;
};

export function PreviewMetrics({ item }: PreviewMetricsProps) {
  return (
    <div className={classes.metricsGrid}>
      {item.widgets.map((widget) => (
        <Card key={widget.id} className={classes.metricCard} padding={0} radius="lg">
          <Text className={classes.metricLabel}>{widget.label}</Text>
          {widget.splitValue ? (
            <>
              <div className={classes.metricSplit}>
                <div>
                  <Text className={classes.metricSplitPrimaryValue}>
                    {widget.splitValue.primaryValue}
                  </Text>
                  <Text className={classes.metricSplitPrimaryLabel}>
                    {widget.splitValue.primaryLabel}
                  </Text>
                </div>
                <Text className={classes.metricSplitDivider}>/</Text>
                <div>
                  <Text className={classes.metricSplitSecondaryValue}>
                    {widget.splitValue.secondaryValue}
                  </Text>
                  <Text className={classes.metricSplitSecondaryLabel}>
                    {widget.splitValue.secondaryLabel}
                  </Text>
                </div>
              </div>
              {widget.periodLabel ? (
                <Text className={classes.metricPeriodLabel}>{widget.periodLabel}</Text>
              ) : null}
            </>
          ) : (
            <MetricValue widget={widget} />
          )}
        </Card>
      ))}
    </div>
  );
}

function MetricValue({ widget }: { widget: IUnifiedRegisterDetail['widgets'][number] }) {
  return (
    <>
      <Text
        className={`${classes.metricValue} ${
          widget.id === 'debt' ? classes.metricValueCritical : ''
        }`}
      >
        {widget.value}
      </Text>
      {widget.badgeLabel ? (
        <Badge className={classes.metricBadge} classNames={{ label: classes.metricBadgeLabel }} radius="xl">
          {widget.badgeLabel}
        </Badge>
      ) : null}
      {widget.subtitle ? (
        <Text
          className={`${classes.metricSubtitle} ${
            widget.id === 'debt' ? classes.metricSubtitleCritical : ''
          }`}
        >
          {widget.subtitle}
        </Text>
      ) : null}
      {widget.periodLabel ? (
        <Text className={classes.metricPeriodLabel}>{widget.periodLabel}</Text>
      ) : null}
    </>
  );
}
