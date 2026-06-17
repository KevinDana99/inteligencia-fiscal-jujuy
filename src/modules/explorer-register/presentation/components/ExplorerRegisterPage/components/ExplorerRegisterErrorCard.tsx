import { Card, Text } from '@mantine/core';
import classes from '../styles/results.module.css';

export function ExplorerRegisterErrorCard({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <Card className={classes.errorCard} padding="md" radius="lg">
      <Text className={classes.errorText}>{message}</Text>
    </Card>
  );
}
