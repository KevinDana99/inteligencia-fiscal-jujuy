import { Card, Text } from '@mantine/core';
import classes from '../styles/results.module.css';

export function ExplorerRegisterFallbackCard({ message }: { message: string }) {
  return (
    <Card className={classes.fallbackCard} padding="xl" radius="lg">
      <Text className={classes.fallbackText}>{message}</Text>
    </Card>
  );
}
