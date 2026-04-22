import { Paper, Stack, Text, Title } from '@mantine/core';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelSettingsSection() {
  return (
    <Paper radius="lg" p="xl" className={classes.settingsCard}>
      <Stack gap="sm">
        <Title order={2} className={classes.sectionTitle}>
          Configuración del panel
        </Title>
        <Text className={classes.panelSubtitle}>
          Esta sección se mantiene dentro de `/admin` y no crea nuevas rutas en esta
          iteración. Queda reservada para extender el panel más adelante.
        </Text>
      </Stack>
    </Paper>
  );
}
