import type { ReactNode } from 'react';
import { Card, Stack, Text } from '@mantine/core';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelMetricCard({
  icon,
  value,
  label,
  caption
}: {
  icon: ReactNode;
  value: number;
  label: string;
  caption: string;
}) {
  return (
    <Card className={classes.metricCard} padding="xl" radius="md">
      <Stack gap="xs">
        <div className={classes.metricIconBox}>{icon}</div>
        <Text className={classes.metricValue}>{value}</Text>
        <Text className={classes.metricLabel}>{label}</Text>
        <Text className={classes.metricCaption}>{caption}</Text>
      </Stack>
    </Card>
  );
}
