import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

const LOTES_STATS = [
  { label: 'Lotes activos', value: '18' },
  { label: 'En validación', value: '4' },
  { label: 'Última corrida', value: '09:24' }
];

export function DashboardLotesPage() {
  return (
    <Stack gap="xl">
      <Card className={classes.pageCard} radius="lg" padding="xl">
        <Stack gap="xs">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1} className={classes.pageTitle}>
                Gestión de Lotes
              </Title>
              <Text className={classes.pageSubtitle}>
                Vista inicial del dashboard operativo para seguimiento de lotes y
                ejecuciones.
              </Text>
            </div>

            <Badge variant="light" color="blue">
              Iteración actual
            </Badge>
          </Group>
        </Stack>
      </Card>

      <div className={classes.statsGrid}>
        {LOTES_STATS.map((item) => (
          <Card key={item.label} className={classes.statCard} radius="lg" padding="lg">
            <Stack gap={6}>
              <Text className={classes.statValue}>{item.value}</Text>
              <Text className={classes.statLabel}>{item.label}</Text>
            </Stack>
          </Card>
        ))}
      </div>

      <Card className={classes.panelCard} radius="lg" padding="xl">
        <Stack gap="sm">
          <Title order={3} className={classes.pageTitle}>
            Próxima iteración
          </Title>
          <Text className={classes.pageSubtitle}>
            Esta vista ya usa el layout definitivo del dashboard y queda lista para sumar
            buscadores, filtros y tabla de lotes en la siguiente etapa.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
