import { SimpleGrid, Stack, Title } from '@mantine/core';
import { IconKey, IconUserCog, IconUserOff, IconUsers } from '@tabler/icons-react';
import type { IAdminPanelMetrics } from '../../../data/models/AdminPanel';
import { AdminPanelMetricCard } from '../AdminPanelMetricCard';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelWidgetsSection({ metrics }: { metrics: IAdminPanelMetrics }) {
  return (
    <Stack gap="md">
      <Title order={2} className={classes.sectionTitle}>
        Métricas
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <AdminPanelMetricCard
          icon={<IconUsers size={20} />}
          value={metrics.activeUsers}
          label="Usuarios activos"
          caption="Cuentas registradas"
        />
        <AdminPanelMetricCard
          icon={<IconUserOff size={20} />}
          value={metrics.deletedUsers}
          label="Usuarios eliminados"
          caption="Histórico acumulado"
        />
        <AdminPanelMetricCard
          icon={<IconKey size={20} />}
          value={metrics.passwordChanges}
          label="Contraseñas cambiadas"
          caption="Histórico acumulado"
        />
        <AdminPanelMetricCard
          icon={<IconUserCog size={20} />}
          value={metrics.distinctRoles}
          label="Cargos distintos"
          caption="Perfiles únicos"
        />
      </SimpleGrid>
    </Stack>
  );
}
