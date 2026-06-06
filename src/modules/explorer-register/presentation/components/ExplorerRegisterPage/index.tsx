'use client';

import {
  ActionIcon,
  Button,
  Card,
  Select,
  Stack,
  Table,
  Text
} from '@mantine/core';
import { IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import { DashboardNavbarActionPortal } from '@/modules/dashboard-layout/presentation/contexts';
import type { ExplorerRegisterPillKey } from '../../../data/models/ExplorerRegister';
import { useExplorerRegister } from '../../hooks/useExplorerRegister';
import classes from './ExplorerRegisterPage.module.css';

const PILL_LABEL_BY_KEY: Record<ExplorerRegisterPillKey, string> = {
  rubro: 'Rubro',
  actividad: 'Actividad',
  tipo: 'Tipo Contribuyente',
  domicilio: 'Domicilio',
  localidad: 'Localidad',
  provincia: 'Provincia',
  riesgo: 'Matriz de riesgo',
  control: 'Sistema de Control',
  mercurio: 'Mercurio (Ruta)',
  trufa: 'Trufa (Operativos)',
  agente: 'Agente',
  retenido: 'Sujeto Retenido',
  convenio: 'Convenio Jurisdicción'
};

export function ExplorerRegisterPage() {
  const {
    pills,
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
  } = useExplorerRegister();

  return (
    <>
      <DashboardNavbarActionPortal>
        <Button
          size="sm"
          radius="xl"
          leftSection={<IconPlus size={16} />}
          className={classes.navbarActionButton}
        >
          Crear lote con {explorerSelectedCount} resultados
        </Button>
      </DashboardNavbarActionPortal>

      <div className={classes.page}>
        <div>
          <Text className={classes.sectionLabel}>
            Columnas y filtros disponibles
          </Text>
          <div className={classes.pillsRow}>
            {pills.map((pill) => {
              const isActive = activePills.includes(pill.key);

              return (
                <Button
                  key={pill.key}
                  variant="default"
                  radius="xl"
                  className={`${classes.pillButton} ${
                    isActive ? classes.pillButtonActive : ''
                  }`}
                  onClick={() => togglePill(pill.key)}
                >
                  {pill.label}
                </Button>
              );
            })}
          </div>
        </div>

        <Card className={classes.filtersCard} radius="lg" padding="lg">
          <Stack gap="md">
            <div className={classes.filtersHeader}>
              <Text className={classes.filtersTitle}>Configurar filtros</Text>
              <div className={classes.filtersActions}>
                <Button
                  variant="default"
                  radius="xl"
                  className={classes.clearButton}
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </Button>
                <Button
                  radius="xl"
                  leftSection={<IconSearch size={13} />}
                  className={classes.searchButton}
                  onClick={search}
                >
                  Buscar
                </Button>
              </div>
            </div>

            <div className={classes.filtersGrid}>
              {activePills.map((pill) => (
                <div
                  key={pill}
                  className={`${classes.filterField} ${
                    pill === 'actividad' || pill === 'domicilio'
                      ? classes.filterFieldWide
                      : ''
                  }`}
                >
                  <Text className={classes.filterLabel}>
                    {PILL_LABEL_BY_KEY[pill]}
                  </Text>
                  <Select
                    value={filters[pill]}
                    onChange={(value) => updateFilter(pill, value)}
                    data={[
                      { value: '', label: 'Todas las opciones' },
                      ...(visibleFilterOptions.get(pill) ?? []).map((option) => ({
                        value: option,
                        label: option
                      }))
                    ]}
                    className={classes.filterSelect}
                  />
                </div>
              ))}
            </div>
          </Stack>
        </Card>

      {hasSearched ? (
        visibleResults.length > 0 ? (
          <div className={classes.tableWrap}>
            <Table withColumnBorders={false} className={classes.table}>
              <Table.Thead className={classes.thead}>
                <Table.Tr>
                  <Table.Th className={`${classes.th} ${classes.xHeader}`} />
                  <Table.Th className={classes.th}>CUIT</Table.Th>
                  <Table.Th className={classes.th}>Nombre / Razón Social</Table.Th>
                  {activePills.map((pill) => (
                    <Table.Th key={pill} className={classes.th}>
                      {PILL_LABEL_BY_KEY[pill]}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {visibleResults.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td className={classes.td}>
                      <ActionIcon
                        variant="subtle"
                        radius="xl"
                        className={classes.removeButton}
                        onClick={() => deselectResult(item.id)}
                        aria-label={`Deseleccionar ${item.businessName}`}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    </Table.Td>
                    <Table.Td className={classes.td}>{item.cuit}</Table.Td>
                    <Table.Td className={`${classes.td} ${classes.businessName}`}>
                      {item.businessName}
                    </Table.Td>
                    {activePills.map((pill) => (
                      <Table.Td key={pill} className={classes.td}>
                        {item[pill]}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : (
          <Card className={classes.fallbackCard} padding="xl" radius="lg">
            <Text className={classes.fallbackText}>
              No se encontro coincidencias para la busqueda realizada
            </Text>
          </Card>
        )
      ) : (
        <Card className={classes.fallbackCard} padding="xl" radius="lg">
          <Text className={classes.fallbackText}>
            Seleccioná columnas/filtros arriba y presioná Buscar para poblar el cuadro.
          </Text>
        </Card>
      )}
      </div>
    </>
  );
}
