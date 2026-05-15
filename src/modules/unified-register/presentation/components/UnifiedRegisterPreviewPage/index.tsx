'use client';

import { useRouter } from 'next/navigation';
import { Badge, Button, Card, Group, Stack, Switch, Text } from '@mantine/core';
import { IconChevronLeft, IconPlus } from '@tabler/icons-react';
import { unifiedRegisterItemsFixture } from '../../../data/sources/mock/fixtures/unifiedRegisterItems';
import classes from './UnifiedRegisterPreviewPage.module.css';

export function UnifiedRegisterPreviewPage({ cuit }: { cuit: string }) {
  const router = useRouter();
  const item = unifiedRegisterItemsFixture.find((entry) => entry.cuit === cuit);

  if (!item) {
    return (
      <Card className={classes.placeholderCard} padding="xl" radius="lg">
        <Stack gap="xs">
          <Text className={classes.placeholderTitle}>CUIT no encontrado</Text>
          <Text className={classes.placeholderText}>
            No existe un registro mock para el CUIT {cuit}.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <div className={classes.page}>
      <Button
        variant="default"
        leftSection={<IconChevronLeft size={16} />}
        radius="xl"
        className={classes.backButton}
        onClick={() => router.push('/')}
      >
        Padrón Unificado
      </Button>

      <Card className={classes.summaryCard} padding="xl" radius="xl">
        <div className={classes.summaryTop}>
          <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
            <Text className={classes.cuit}>CUIT {item.cuit}</Text>
            <Text className={classes.title}>{item.businessName}</Text>

            <div className={classes.pillRow}>
              <Badge className={`${classes.pill} ${classes.statusPill}`} radius="xl">
                {item.status}
              </Badge>
              <Badge className={`${classes.pill} ${classes.regimePill}`} radius="xl">
                {item.regime}
              </Badge>
              <Badge className={`${classes.pill} ${classes.activityPill}`} radius="xl">
                {item.activity}
              </Badge>
            </div>

            <div className={classes.metaRow}>
              <Text className={classes.metaText}>
                <strong>Inicio actividad:</strong> 01/06/2005
              </Text>
              <Text className={classes.metaText}>
                <strong>Jurisdicción:</strong> Jujuy (J.910)
              </Text>
              <Text className={classes.metaText}>
                <strong>Actualización:</strong> 24/04/2026
              </Text>
            </div>
          </Stack>

          <div className={classes.riskBox}>
            <Text className={classes.riskLevel}>{item.riskLevel}</Text>
            <Text className={classes.riskLabel}>Riesgo</Text>
          </div>
        </div>

        <div className={classes.summaryFooter}>
          <Group gap="sm">
            <Switch label="Marcar reproceso" />
            <Button variant="default" radius="xl">
              Cruces a realizar
            </Button>
          </Group>

          <div className={classes.footerActions}>
            <Button leftSection={<IconPlus size={16} />} radius="xl">
              Agregar a lote
            </Button>
          </div>
        </div>
      </Card>

      <Card className={classes.placeholderCard} padding="xl" radius="lg">
        <Stack gap="xs">
          <Text className={classes.placeholderTitle}>Vista previa de Padrón</Text>
          <Text className={classes.placeholderText}>
            La pantalla final de detalle todavía no está cerrada de diseño. Esta ruta ya
            existe y queda lista para conectar la request del CUIT en la próxima iteración.
          </Text>
        </Stack>
      </Card>
    </div>
  );
}
