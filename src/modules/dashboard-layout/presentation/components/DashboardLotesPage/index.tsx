import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

const LOTES_STATS = [
  { label: 'Lotes activos', value: '18' },
  { label: 'En validación', value: '4' },
  { label: 'Última corrida', value: '09:24' }
];

const LOTES_PANELS = [
  {
    title: 'Resumen operativo',
    description:
      'Vista consolidada del estado actual de lotes procesados, pendientes y con incidencias.'
  },
  {
    title: 'Validaciones recientes',
    description:
      'Registro de las últimas ejecuciones sobre lotes y reglas aplicadas durante el análisis.'
  },
  {
    title: 'Lotes observados',
    description:
      'Listado preliminar de lotes que requieren revisión manual por inconsistencias detectadas.'
  },
  {
    title: 'Historial de corridas',
    description:
      'Trazabilidad de ejecuciones anteriores con referencias de fecha, hora y resultado final.'
  },
  {
    title: 'Pendientes de aprobación',
    description:
      'Elementos en espera de validación funcional antes de continuar con la siguiente etapa.'
  },
  {
    title: 'Monitoreo de integraciones',
    description:
      'Estado general de los cruces de datos y disponibilidad de fuentes vinculadas al proceso.'
  }
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

      {LOTES_PANELS.map((panel) => (
        <Card key={panel.title} className={classes.panelCard} radius="lg" padding="xl">
          <Stack gap="sm">
            <Title order={3} className={classes.pageTitle}>
              {panel.title}
            </Title>
            <Text className={classes.pageSubtitle}>{panel.description}</Text>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
