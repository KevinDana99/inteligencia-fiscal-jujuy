'use client'

import { Fragment } from 'react'
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  Menu,
  Select,
  Stack,
  Table,
  Text
} from '@mantine/core'
import {
  IconChevronRight,
  IconDotsVertical,
  IconSearch
} from '@tabler/icons-react'
import type {
  IBatchCrossFilters,
  IBatchManagementItem,
  IBatchManagementItems
} from '../../../data/models/BatchManagement'
import classes from './BatchManagementTable.module.css'

const YEAR_OPTIONS = ['2021', '2022', '2023', '2024', '2025']
const CROSS_OPTIONS = [
  'Control de desvio de BI - Regimen Gral',
  'Control de desvio de BI - Regimen CM',
  'Control de BI declarada por actividad',
  'Control de creditos',
  'Control de SAF',
  'Control de Agentes',
  'Deteccion de no inscriptos',
  'Comparacion de Bases Presuntivas'
]

function BatchManagementMenu({
  batchId,
  filters,
  onYearChange,
  onCrossTypeToggle,
  onConfirm
}: {
  batchId: string
  filters: IBatchCrossFilters
  onYearChange: (
    batchId: string,
    field: keyof Pick<IBatchCrossFilters, 'fromYear' | 'toYear'>,
    value: string | null
  ) => void
  onCrossTypeToggle: (batchId: string, crossType: string) => void
  onConfirm: (batchId: string) => void
}) {
  return (
    <Menu
      shadow="md"
      width={320}
      withinPortal={false}
      position="bottom-end"
      offset={8}
    >
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="md"
          onClick={(event) => event.stopPropagation()}
          className={classes.rowActionButton}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown
        onClick={(event) => event.stopPropagation()}
        className={classes.crossMenuDropdown}
      >
        <div className={classes.menuSection}>
          <Menu.Label className={classes.menuLabel}>
            Periodo a fiscalizar <span className={classes.menuLabelHint}>(máx. 5 años)</span>
          </Menu.Label>
          <div className={classes.periodBody}>
            <Group gap="xs" className={classes.periodRow}>
              <div className={classes.periodField}>
                <Text size="xs" className={classes.menuHint}>
                  Desde
                </Text>
                <Select
                  data={YEAR_OPTIONS}
                  value={filters.fromYear}
                  onChange={(value) => onYearChange(batchId, 'fromYear', value)}
                  className={classes.crossMenuSelect}
                  classNames={{
                    input: classes.crossMenuSelectInput,
                    dropdown: classes.crossMenuSelectDropdown
                  }}
                />
              </div>
              <span className={classes.periodArrow}>→</span>
              <div className={classes.periodField}>
                <Text size="xs" className={classes.menuHint}>
                  Hasta
                </Text>
                <Select
                  data={YEAR_OPTIONS}
                  value={filters.toYear}
                  onChange={(value) => onYearChange(batchId, 'toYear', value)}
                  className={classes.crossMenuSelect}
                  classNames={{
                    input: classes.crossMenuSelectInput,
                    dropdown: classes.crossMenuSelectDropdown
                  }}
                />
              </div>
            </Group>
          </div>
        </div>

        <div className={classes.menuSection}>
          <Stack gap={0} className={classes.menuBody}>
            <Menu.Label className={`${classes.menuLabel} ${classes.menuSectionLabel}`}>
              Tipo de cruce
            </Menu.Label>
            {CROSS_OPTIONS.map((option) => (
              <Checkbox
                key={option}
                label={option}
                checked={filters.crossTypes.includes(option)}
                onChange={() => onCrossTypeToggle(batchId, option)}
                color="blue"
                size="xs"
                classNames={{
                  root: classes.crossMenuCheckbox,
                  body: classes.crossMenuCheckboxBody,
                  input: classes.crossMenuCheckboxInput,
                  label: classes.crossMenuCheckboxLabel
                }}
              />
            ))}
          </Stack>
        </div>
        <Group justify="flex-end" className={classes.menuFooter}>
          <Button
            size="sm"
            className={classes.menuButton}
            onClick={() => onConfirm(batchId)}
          >
            Confirmar
          </Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  )
}

function BatchDetailRow({ batch }: { batch: IBatchManagementItem }) {
  const detailRegime = batch.cuits[0]?.regime

  return (
    <div className={classes.detailInner}>
      <Stack gap="sm">
        <Text className={classes.detailTitle}>
          CUITs en lote {batch.name}
          {detailRegime ? ` - Régimen ${detailRegime}` : ''}
        </Text>

        {batch.cuits.length ? (
          <>
            <Table
              withTableBorder={false}
              withColumnBorders={false}
              className={`${classes.table} ${classes.nestedTable}`}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>CUIT</Table.Th>
                  <Table.Th>Razon Social</Table.Th>
                  <Table.Th>Tipo de contribuyente</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {batch.cuits.map((cuit, index) => (
                  <Table.Tr key={cuit.id}>
                    <Table.Td className={classes.batchDate}>{index + 1}</Table.Td>
                    <Table.Td className={classes.monoText}>{cuit.cuit}</Table.Td>
                    <Table.Td>{cuit.businessName}</Table.Td>
                    <Table.Td>
                      <Badge
                        variant="filled"
                        radius="xl"
                        className={classes.regimeBadge}
                      >
                        {cuit.regime}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Text size="xs" className={classes.expandHint}>
              Mostrando {batch.cuits.length} de {batch.cuitCount} CUITs
              {batch.cuits.length < batch.cuitCount ? (
                <>
                  {' · '}
                  <button type="button" className={classes.expandActionButton}>
                    Ver todos
                  </button>
                </>
              ) : null}
            </Text>
          </>
        ) : (
          <Text size="sm" className={classes.emptyState}>
            Sin CUITs para mostrar.
          </Text>
        )}
      </Stack>
    </div>
  )
}

export function BatchManagementTable({
  batches,
  expandedBatchId,
  onToggleBatch,
  getBatchCrossFilters,
  onBatchCrossYearChange,
  onBatchCrossTypeToggle,
  onBatchCrossConfirm
}: {
  batches: IBatchManagementItems
  expandedBatchId: string | null
  onToggleBatch: (batchId: string) => void
  getBatchCrossFilters: (batchId: string) => IBatchCrossFilters
  onBatchCrossYearChange: (
    batchId: string,
    field: keyof Pick<IBatchCrossFilters, 'fromYear' | 'toYear'>,
    value: string | null
  ) => void
  onBatchCrossTypeToggle: (batchId: string, crossType: string) => void
  onBatchCrossConfirm: (batchId: string) => void
}) {
  if (!batches.length) {
    return (
      <div className={classes.tableWrap}>
        <Table withTableBorder={false} withColumnBorders={false} className={classes.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={classes.chevronColumn} />
              <Table.Th className={classes.batchNumberHeader}>Nro de lote</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>
                <span className={classes.cuitCountHeader}>Cantidad de CUITs</span>
              </Table.Th>
              <Table.Th>Fecha de generación</Table.Th>
              <Table.Th style={{ width: 44 }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Group gap="sm" py="md">
                  <IconSearch size={16} className={classes.batchDate} />
                  <Text className={classes.emptyState}>
                    No se encontraron resultados para la busqueda actual.
                  </Text>
                </Group>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    )
  }

  return (
    <div className={classes.tableWrap}>
      <Table
        withTableBorder={false}
        withColumnBorders={false}
        className={classes.table}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={classes.chevronColumn} />
            <Table.Th className={classes.batchNumberHeader}>Nro de lote</Table.Th>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Descripción</Table.Th>
            <Table.Th>
              <span className={classes.cuitCountHeader}>Cantidad de CUITs</span>
            </Table.Th>
            <Table.Th>Fecha de generación</Table.Th>
            <Table.Th style={{ width: 44 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {batches.map((batch) => {
            const isExpanded = expandedBatchId === batch.id

            return (
              <Fragment key={batch.id}>
                <Table.Tr
                  className={`${classes.row} ${isExpanded ? classes.rowExpanded : ''}`}
                  onClick={() => onToggleBatch(batch.id)}
                >
                  <Table.Td className={classes.chevronCell}>
                    <span
                      className={`${classes.chevron} ${isExpanded ? classes.chevronOpen : ''}`}
                    >
                      <IconChevronRight size={13} />
                    </span>
                  </Table.Td>
                  <Table.Td className={`${classes.batchCell} ${classes.batchNumber}`}>
                    {batch.batchNumber}
                  </Table.Td>
                  <Table.Td className={`${classes.batchCell} ${classes.batchName}`}>
                    {batch.name}
                  </Table.Td>
                  <Table.Td className={`${classes.batchCell} ${classes.batchDescription}`}>
                    {batch.description}
                  </Table.Td>
                  <Table.Td className={classes.cuitCountCell}>
                    <span className={classes.cuitCountValue}>{batch.cuitCount}</span>
                  </Table.Td>
                  <Table.Td className={`${classes.batchCell} ${classes.batchDate}`}>
                    {batch.createdAt}
                  </Table.Td>
                  <Table.Td onClick={(event) => event.stopPropagation()}>
                    <BatchManagementMenu
                      batchId={batch.id}
                      filters={getBatchCrossFilters(batch.id)}
                      onYearChange={onBatchCrossYearChange}
                      onCrossTypeToggle={onBatchCrossTypeToggle}
                      onConfirm={onBatchCrossConfirm}
                    />
                  </Table.Td>
                </Table.Tr>
                {isExpanded ? (
                  <Table.Tr key={`${batch.id}-details`}>
                    <Table.Td colSpan={7} className={classes.detailCell}>
                      <BatchDetailRow batch={batch} />
                    </Table.Td>
                  </Table.Tr>
                ) : null}
              </Fragment>
            )
          })}
        </Table.Tbody>
      </Table>
    </div>
  )
}
