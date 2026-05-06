import { Card, Stack, Text, Title } from '@mantine/core';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

export function DashboardPagePlaceholder({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className={classes.pageCard} radius="lg" padding="xl">
      <Stack gap="xs">
        <Title order={1} className={classes.pageTitle}>
          {title}
        </Title>
        <Text className={classes.pageSubtitle}>{description}</Text>
      </Stack>
    </Card>
  );
}
