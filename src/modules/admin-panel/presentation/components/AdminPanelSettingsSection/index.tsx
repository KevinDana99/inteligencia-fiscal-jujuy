import { Stack, Text, Title } from '@mantine/core';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelSettingsSection() {
  return (
    <Stack gap="sm">
      <Title order={1} className={classes.heroTitle}>
        Configuración
      </Title>
      <Text className={classes.heroDate}>
        Esta página usa el mismo template del panel administrativo.
      </Text>
    </Stack>
  );
}
