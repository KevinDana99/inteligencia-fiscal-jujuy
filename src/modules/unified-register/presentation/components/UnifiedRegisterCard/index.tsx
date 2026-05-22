'use client';

import { ActionIcon, Badge, Card, Menu, Text } from '@mantine/core';
import { IconDots, IconEye, IconFolderPlus, IconReload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import type { IUnifiedRegisterItem } from '../../../data/models/UnifiedRegister';
import classes from './UnifiedRegisterCard.module.css';

const RISK_CLASS_BY_LEVEL = {
  A: classes.riskA,
  B: classes.riskB,
  C: classes.riskC
} as const;

export function UnifiedRegisterCard({
  item,
  isMarkPending,
  onMarkReprocessing
}: {
  item: IUnifiedRegisterItem
  isMarkPending: boolean
  onMarkReprocessing: (contribuyenteId: string) => void
}) {
  const router = useRouter();
  const isMarked = item.isInReprocessing ?? false;

  return (
    <Card
      className={classes.card}
      padding={0}
      radius={0}
      withBorder={false}
      onClick={() => router.push(`/vista-previa-padron/${encodeURIComponent(item.cuit)}`)}
    >
      <div className={classes.cardSection}>
        <div className={classes.content}>
          <Text className={classes.cuit}>{item.cuit}</Text>
          <Text className={classes.title}>{item.businessName}</Text>
          <div className={classes.meta}>
            <Text className={classes.metaText}>
              <strong>Actividad:</strong> {item.activity}
            </Text>
            <Text className={classes.metaText}>
              <strong>Régimen:</strong> {item.regime}
            </Text>
            <Text className={classes.metaText}>
              <strong>Estado:</strong> {item.status}
            </Text>
          </div>
        </div>

        <div className={classes.aside}>
          <Badge
            radius="xl"
            className={`${classes.riskBadge} ${RISK_CLASS_BY_LEVEL[item.riskLevel]}`}
            classNames={{ label: classes.riskBadgeLabel }}
          >
            Riesgo {item.riskLevel}
          </Badge>

          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <ActionIcon
                variant="default"
                className={classes.menuButton}
                onClick={(event) => event.stopPropagation()}
              >
                <IconDots size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown
              className={classes.menuDropdown}
              onClick={(event) => event.stopPropagation()}
            >
              <Menu.Item
                className={classes.menuItem}
                leftSection={<IconEye size={14} />}
              >
                Ver análisis completo
              </Menu.Item>
              <Menu.Item
                className={classes.menuItem}
                leftSection={<IconFolderPlus size={14} />}
              >
                Agregar a lote
              </Menu.Item>
              <Menu.Item
                className={`${classes.menuItem} ${classes.menuDanger}`}
                leftSection={<IconReload size={14} />}
                disabled={isMarked || isMarkPending}
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkReprocessing(item.contribuyenteId);
                }}
              >
                {isMarked ? 'Ya en reproceso' : isMarkPending ? 'Marcando...' : 'Marcar reproceso'}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </Card>
  );
}
