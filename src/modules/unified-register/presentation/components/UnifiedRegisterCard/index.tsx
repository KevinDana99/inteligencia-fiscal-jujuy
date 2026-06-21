'use client';

import { useCallback, useRef } from 'react';
import type { Route } from 'next';
import { ActionIcon, Badge, Card, Menu, Text } from '@mantine/core';
import { BatchManagementAvailableLotsDropdown } from '@/modules/batch-management/presentation/components/BatchManagementAvailableLotsDropdown';
import { IconDots, IconFolderPlus, IconReload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import type {
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterItem,
  UnifiedRegisterRiskLevel
} from '../../../data/models/UnifiedRegister';
import classes from './UnifiedRegisterCard.module.css';

const RISK_CLASS_BY_LEVEL = {
  A: classes.riskA,
  B: classes.riskB,
  C: classes.riskC,
  D: classes.riskD
} as const satisfies Record<UnifiedRegisterRiskLevel, string>;

interface UnifiedRegisterCardProps {
  item: IUnifiedRegisterItem;
  isBatchDropdownOpen: boolean;
  batchSearch: string;
  filteredLotOptions: IUnifiedRegisterBatchOption[];
  batchOptionsError: string | null;
  isBatchOptionsPending: boolean;
  onCloseBatchDropdown: () => void;
  onBatchSearchChange: (value: string) => void;
  onSelectLotOption: (lot: IUnifiedRegisterBatchOption) => void;
  onAddToBatch: (item: IUnifiedRegisterItem) => void;
  onMarkReprocessing: (item: IUnifiedRegisterItem) => void;
}

export function UnifiedRegisterCard({
  item,
  isBatchDropdownOpen,
  batchSearch,
  filteredLotOptions,
  batchOptionsError,
  isBatchOptionsPending,
  onCloseBatchDropdown,
  onBatchSearchChange,
  onSelectLotOption,
  onAddToBatch,
  onMarkReprocessing
}: UnifiedRegisterCardProps) {
  const router = useRouter();
  const hasPrefetchedDetailRouteRef = useRef(false);
  const detailRoute =
    `/vista-previa-padron/${encodeURIComponent(item.cuit)}?id=${encodeURIComponent(
      item.contribuyenteId
    )}` as Route;

  const prefetchDetailRoute = useCallback(() => {
    if (hasPrefetchedDetailRouteRef.current) {
      return;
    }

    hasPrefetchedDetailRouteRef.current = true;
    router.prefetch(detailRoute);
  }, [detailRoute, router]);

  const navigateToDetail = useCallback(() => {
    router.push(detailRoute);
  }, [detailRoute, router]);

  return (
    <Card
      className={classes.card}
      padding={0}
      radius={0}
      withBorder={false}
      onClick={navigateToDetail}
      onFocus={prefetchDetailRoute}
      onMouseEnter={prefetchDetailRoute}
      onTouchStart={prefetchDetailRoute}
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
          {item.riskLevel ? (
            <Badge
              radius="xl"
              className={`${classes.riskBadge} ${RISK_CLASS_BY_LEVEL[item.riskLevel]}`}
              classNames={{ label: classes.riskBadgeLabel }}
            >
              Riesgo {item.riskLevel}
            </Badge>
          ) : null}

          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <ActionIcon
                variant="default"
                className={classes.menuButton}
                onClick={(event) => {
                  event.stopPropagation();
                }}
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
                leftSection={<IconFolderPlus size={14} />}
                onClick={(event) => {
                  event.stopPropagation();
                  onAddToBatch(item);
                }}
              >
                Agregar a lote
              </Menu.Item>
              <Menu.Item
                className={`${classes.menuItem} ${classes.menuDanger}`}
                leftSection={<IconReload size={14} />}
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkReprocessing(item);
                }}
              >
                Marcar reproceso
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <BatchManagementAvailableLotsDropdown
            opened={isBatchDropdownOpen}
            search={batchSearch}
            options={filteredLotOptions}
            isPending={isBatchOptionsPending}
            error={batchOptionsError}
            onClose={onCloseBatchDropdown}
            onSearchChange={onBatchSearchChange}
            onSelect={onSelectLotOption}
          />
        </div>
      </div>
    </Card>
  );
}
