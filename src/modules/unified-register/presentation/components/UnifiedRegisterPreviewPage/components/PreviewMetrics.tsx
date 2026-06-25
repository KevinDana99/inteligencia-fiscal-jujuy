import { Badge, Card, Text } from '@mantine/core';
import type { IUnifiedRegisterDetail } from '../../../../data/models/UnifiedRegister';
import classes from '../UnifiedRegisterPreviewPage.module.css';

const EMPTY_METRIC_VALUE = '-';

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
            <div className={classes.metricSplit}>
              <div>
                <Text className={classes.metricSplitPrimaryValue}>
                  {formatMetricValue(widget.splitValue.primaryValue)}
                </Text>
                <Text className={classes.metricSplitPrimaryLabel}>
                  {widget.splitValue.primaryLabel}
                </Text>
              </div>
              <Text className={classes.metricSplitDivider}>/</Text>
              <div>
                <Text className={classes.metricSplitSecondaryValue}>
                  {formatMetricValue(widget.splitValue.secondaryValue)}
                </Text>
                <Text className={classes.metricSplitSecondaryLabel}>
                  {widget.splitValue.secondaryLabel}
                </Text>
              </div>
            </div>
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
        {formatMetricValue(widget.value)}
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
    </>
  );
}

function formatMetricValue(value: string) {
  return value.trim() || EMPTY_METRIC_VALUE;
}
