'use client';

import { useMemo, useState } from 'react';
import {
  explorerRegisterItemsFixture,
  explorerRegisterPills
} from '../../data/sources/mock/fixtures/explorerRegisterItems';
import type {
  ExplorerRegisterPillKey,
  IExplorerRegisterItem
} from '../../data/models/ExplorerRegister';
import { useDashboardNavbarActionContext } from '@/modules/dashboard-layout/presentation/contexts/DashboardNavbarActionContext';

const DEFAULT_ACTIVE_PILLS: ExplorerRegisterPillKey[] = ['rubro', 'actividad'];

const EMPTY_FILTERS: Record<ExplorerRegisterPillKey, string> = {
  rubro: '',
  actividad: '',
  tipo: '',
  domicilio: '',
  localidad: '',
  provincia: '',
  riesgo: '',
  control: '',
  mercurio: '',
  trufa: '',
  agente: '',
  retenido: '',
  convenio: ''
};

const FILTER_OPTIONS: Record<ExplorerRegisterPillKey, string[]> = {
  rubro: ['Gastronomía', 'Textil', 'Automotor', 'Construcción', 'Tecnología'],
  actividad: [
    'Fabricación de vehículos',
    'Fabricación de materiales cerámicos',
    'Venta de equipamiento informático',
    'Servicios de restaurante',
    'Fabricación de prendas'
  ],
  tipo: ['Local', 'Convenio'],
  domicilio: ['Av. Industrial 1240', 'Ruta 66 Km 4', 'Belgrano 550', 'Lavalle 88', 'Parque Industrial Lote 8'],
  localidad: ['San Salvador de Jujuy', 'Palpalá', 'Tilcara', 'Perico'],
  provincia: ['Jujuy', 'Salta', 'Buenos Aires'],
  riesgo: ['Alto', 'Medio', 'Bajo'],
  control: ['Activo', 'Inactivo'],
  mercurio: ['Ruta 9', 'Ruta 34', 'Ruta 52'],
  trufa: ['Operativo 2024', 'Operativo 2025'],
  agente: ['Percepción', 'Retención'],
  retenido: ['Sí', 'No'],
  convenio: ['Jujuy (J.910)', 'Buenos Aires']
};

function getFilteredItems(
  items: IExplorerRegisterItem[],
  filters: Record<ExplorerRegisterPillKey, string>,
  activePills: ExplorerRegisterPillKey[]
) {
  return items.filter((item) =>
    activePills.every((pill) => {
      const filterValue = filters[pill];
      if (!filterValue) return true;
      return item[pill] === filterValue;
    })
  );
}

export function useExplorerRegister() {
  const [activePills, setActivePills] =
    useState<ExplorerRegisterPillKey[]>(DEFAULT_ACTIVE_PILLS);
  const [filters, setFilters] =
    useState<Record<ExplorerRegisterPillKey, string>>(EMPTY_FILTERS);
  const [hasSearched, setHasSearched] = useState(false);
  const [deselectedIds, setDeselectedIds] = useState<string[]>([]);
  const { explorerSelectedCount, setExplorerSelectedCount, resetExplorerSelectedCount } =
    useDashboardNavbarActionContext();

  const filteredBaseResults = useMemo(
    () => getFilteredItems(explorerRegisterItemsFixture, filters, activePills),
    [filters, activePills]
  );

  const visibleResults = useMemo(() => {
    if (!hasSearched) {
      return [];
    }

    return filteredBaseResults.filter((item) => !deselectedIds.includes(item.id));
  }, [deselectedIds, filteredBaseResults, hasSearched]);

  const visibleFilterOptions = useMemo(() => {
    const options = new Map<ExplorerRegisterPillKey, string[]>();

    activePills.forEach((pill) => {
      options.set(pill, FILTER_OPTIONS[pill]);
    });

    return options;
  }, [activePills]);

  function syncResults(
    nextActivePills: ExplorerRegisterPillKey[],
    nextFilters: Record<ExplorerRegisterPillKey, string>,
    nextDeselectedIds: string[]
  ) {
    if (!hasSearched) {
      return;
    }

    const nextBaseResults = getFilteredItems(
      explorerRegisterItemsFixture,
      nextFilters,
      nextActivePills
    );
    const visibleDeselections = nextDeselectedIds.filter((id) =>
      nextBaseResults.some((item) => item.id === id)
    );

    setDeselectedIds(visibleDeselections);
    setExplorerSelectedCount(nextBaseResults.length - visibleDeselections.length);
  }

  function togglePill(pill: ExplorerRegisterPillKey) {
    const isActive = activePills.includes(pill);
    const nextActivePills = isActive
      ? activePills.filter((item) => item !== pill)
      : [...activePills, pill];
    const nextFilters = {
      ...filters,
      [pill]: isActive ? '' : filters[pill]
    };

    setActivePills(nextActivePills);
    setFilters(nextFilters);
    syncResults(nextActivePills, nextFilters, deselectedIds);
  }

  function updateFilter(pill: ExplorerRegisterPillKey, value: string | null) {
    const nextFilters = {
      ...filters,
      [pill]: value ?? ''
    };

    setFilters(nextFilters);
    syncResults(activePills, nextFilters, deselectedIds);
  }

  function clearFilters() {
    setActivePills(DEFAULT_ACTIVE_PILLS);
    setFilters(EMPTY_FILTERS);
    setHasSearched(false);
    setDeselectedIds([]);
    resetExplorerSelectedCount();
  }

  function search() {
    setHasSearched(true);
    setDeselectedIds([]);
    setExplorerSelectedCount(filteredBaseResults.length);
  }

  function deselectResult(id: string) {
    if (deselectedIds.includes(id)) {
      return;
    }

    const nextDeselectedIds = [...deselectedIds, id];
    setDeselectedIds(nextDeselectedIds);
    setExplorerSelectedCount(filteredBaseResults.length - nextDeselectedIds.length);
  }

  return {
    pills: explorerRegisterPills,
    activePills,
    togglePill,
    filters,
    updateFilter,
    clearFilters,
    search,
    hasSearched,
    visibleResults,
    visibleFilterOptions,
    deselectResult,
    explorerSelectedCount
  };
}
