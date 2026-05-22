'use client'

import { Fragment } from 'react'
import { useRouter } from 'next/navigation'
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
  IconChevronDown,
  IconDotsVertical,
  IconSearch
} from '@tabler/icons-react'
import type {
  IBatchCrossFilters,
  IBatchCrossSectionFilters,
  IBatchManagementItem,
  IBatchManagementItems
} from '../../../data/models/BatchManagement'
import classes from './BatchManagementTable.module.css'

const currentDate = new Date()
const currentYear = currentDate.getFullYear()

const YEAR_OPTIONS = Array.from({ length: 6 }, (_, index) => String(currentYear - 5 + index))
const MONTH_OPTIONS = [
  { value: '01', label: 'Ene' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Abr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Ago' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dic' }
]
const MONTHLY_CROSS_OPTIONS = [
  'Control de desvio de BI - Regimen Gral',
  'Control de creditos',
  'Control de SAF',
  'Control de Agentes'
]
const ANNUAL_CROSS_OPTIONS = [
  'Control de desvio de BI - Regimen CM',
  'Control de BI declarada por actividad',
  'Deteccion de no inscriptos',
  'Comparacion de Bases Presuntivas',
  'Contribuyentes con más de dos inmuebles'
]

function getContributorTypeLabel(regime: string) {
  return regime === 'Convenio Multilateral' ? 'CM' : regime
}

function formatCuit(value: string) {
  const normalizedValue = value.replace(/\D/g, '')

  if (normalizedValue.length !== 11) {
    return value
  }

  return `${normalizedValue.slice(0, 2)}-${normalizedValue.slice(2, 10)}-${normalizedValue.slice(10)}`
}

function BatchManagementMenu({
  batchId,
  filters,
  validationMessage,
  canConfirm,
  onSectionToggle,
  onYearChange,
  onMonthChange,
  onCrossTypeToggle,
  onConfirm
}: {
  batchId: string
  filters: IBatchCrossFilters
  validationMessage: string | null
  canConfirm: boolean
  onSectionToggle: (batchId: string, section: keyof IBatchCrossFilters) => void
  onYearChange: (
    batchId: string,
    section: keyof IBatchCrossFilters,
    field: keyof Pick<IBatchCrossSectionFilters, 'fromYear' | 'toYear'>,
    value: string | null
  ) => void
  onMonthChange: (
    batchId: string,
    field: keyof Pick<IBatchCrossSectionFilters, 'fromMonth' | 'toMonth'>,
    value: string | null
  ) => void
  onCrossTypeToggle: (
    batchId: string,
    section: keyof IBatchCrossFilters,
    crossType: string
  ) => void
  onConfirm: (batchId: string) => void
}) {
  const router = useRouter()

  const handleConfirm = () => {
    onConfirm(batchId)
    router.push(`/gestion-de-cruces?batchId=${batchId}`)
  }

  return (
    <Menu
      shadow="md"
      width={420}
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
        <div className={classes.crossSection}>
          <button
            type="button"
            className={`${classes.crossSectionToggle} ${classes.monthlySectionToggle}`}
            onClick={() => onSectionToggle(batchId, 'monthly')}
          >
            <span className={classes.crossSectionLeft}>
              <span className={classes.monthlyPill}>Mensual</span>
              <span className={classes.crossSectionTitle}>Cruces mensuales</span>
            </span>
            <IconChevronDown
              size={13}
              className={`${classes.crossSectionChevron} ${filters.monthly.isOpen ? classes.crossSectionChevronOpen : ''}`}
            />
          </button>
          {filters.monthly.isOpen ? (
            <div className={classes.crossSectionBody}>
              <div className={`${classes.periodCard} ${classes.monthlyPeriodCard}`}>
                <div className={classes.periodCardTitle}>Período</div>
                <Group gap={6} wrap="nowrap" align="flex-end" className={classes.monthlyPeriodRow}>
                  <div className={classes.periodField}>
                    <Text className={`${classes.periodLabel} ${classes.monthlyPeriodLabel}`}>Desde</Text>
                    <div className={classes.monthlySelectPair}>
                      <Select
                        data={MONTH_OPTIONS}
                        value={filters.monthly.fromMonth}
                        onChange={(value) => onMonthChange(batchId, 'fromMonth', value)}
                        className={classes.crossMenuSelect}
                        classNames={{
                          input: classes.crossMenuSelectInput,
                          dropdown: classes.crossMenuSelectDropdown
                        }}
                      />
                      <Select
                        data={YEAR_OPTIONS}
                        value={filters.monthly.fromYear}
                        onChange={(value) => onYearChange(batchId, 'monthly', 'fromYear', value)}
                        className={classes.crossMenuSelect}
                        classNames={{
                          input: classes.crossMenuYearInput,
                          dropdown: classes.crossMenuSelectDropdown
                        }}
                      />
                    </div>
                  </div>
                  <span className={classes.periodArrow}>→</span>
                  <div className={classes.periodField}>
                    <Text className={`${classes.periodLabel} ${classes.monthlyPeriodLabel}`}>Hasta</Text>
                    <div className={classes.monthlySelectPair}>
                      <Select
                        data={MONTH_OPTIONS}
                        value={filters.monthly.toMonth}
                        onChange={(value) => onMonthChange(batchId, 'toMonth', value)}
                        className={classes.crossMenuSelect}
                        classNames={{
                          input: classes.crossMenuSelectInput,
                          dropdown: classes.crossMenuSelectDropdown
                        }}
                      />
                      <Select
                        data={YEAR_OPTIONS}
                        value={filters.monthly.toYear}
                        onChange={(value) => onYearChange(batchId, 'monthly', 'toYear', value)}
                        className={classes.crossMenuSelect}
                        classNames={{
                          input: classes.crossMenuYearInput,
                          dropdown: classes.crossMenuSelectDropdown
                        }}
                      />
                    </div>
                  </div>
                </Group>
              </div>

              <Stack gap={0} className={classes.crossChecks}>
                {MONTHLY_CROSS_OPTIONS.map((option) => (
                  <Checkbox
                    key={option}
                    label={option}
                    checked={filters.monthly.crossTypes.includes(option)}
                    onChange={() => onCrossTypeToggle(batchId, 'monthly', option)}
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
          ) : null}
        </div>

        <div className={classes.crossSection}>
          <button
            type="button"
            className={`${classes.crossSectionToggle} ${classes.annualSectionToggle}`}
            onClick={() => onSectionToggle(batchId, 'annual')}
          >
            <span className={classes.crossSectionLeft}>
              <span className={classes.annualPill}>Anual</span>
              <span className={classes.crossSectionTitle}>Cruces anuales</span>
            </span>
            <IconChevronDown
              size={13}
              className={`${classes.crossSectionChevron} ${filters.annual.isOpen ? classes.crossSectionChevronOpen : ''}`}
            />
          </button>
          {filters.annual.isOpen ? (
            <div className={classes.crossSectionBody}>
              <div className={`${classes.periodCard} ${classes.annualPeriodCard}`}>
                <div className={`${classes.periodCardTitle} ${classes.annualPeriodCardTitle}`}>Período</div>
                <Group gap={6} wrap="nowrap" align="flex-end" className={classes.periodRow}>
                  <div className={classes.periodField}>
                    <Text className={`${classes.periodLabel} ${classes.annualPeriodLabel}`}>Desde</Text>
                    <Select
                      data={YEAR_OPTIONS}
                      value={filters.annual.fromYear}
                      onChange={(value) => onYearChange(batchId, 'annual', 'fromYear', value)}
                      className={classes.crossMenuSelect}
                      classNames={{
                        input: classes.crossMenuSelectInput,
                        dropdown: classes.crossMenuSelectDropdown
                      }}
                    />
                  </div>
                  <span className={classes.periodArrow}>→</span>
                  <div className={classes.periodField}>
                    <Text className={`${classes.periodLabel} ${classes.annualPeriodLabel}`}>Hasta</Text>
                    <Select
                      data={YEAR_OPTIONS}
                      value={filters.annual.toYear}
                      onChange={(value) => onYearChange(batchId, 'annual', 'toYear', value)}
                      className={classes.crossMenuSelect}
                      classNames={{
                        input: classes.crossMenuSelectInput,
                        dropdown: classes.crossMenuSelectDropdown
                      }}
                    />
                  </div>
                </Group>
              </div>

              <Stack gap={0} className={classes.crossChecks}>
                {ANNUAL_CROSS_OPTIONS.map((option) => (
                  <Checkbox
                    key={option}
                    label={option}
                    checked={filters.annual.crossTypes.includes(option)}
                    onChange={() => onCrossTypeToggle(batchId, 'annual', option)}
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
          ) : null}
        </div>

        {validationMessage ? (
          <Text className={classes.crossValidationMessage}>{validationMessage}</Text>
        ) : null}

        <Group justify="flex-end" className={classes.menuFooter}>
          <Button
            size="sm"
            className={classes.menuButton}
            onClick={handleConfirm}
            disabled={!canConfirm}
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
                    <Table.Td className={classes.monoText}>{formatCuit(cuit.cuit)}</Table.Td>
                    <Table.Td>{cuit.businessName}</Table.Td>
                    <Table.Td>
                      <Badge
                        variant="filled"
                        radius="xl"
                        className={classes.regimeBadge}
                      >
                        {getContributorTypeLabel(cuit.regime)}
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
  getBatchCrossValidationMessage,
  canConfirmBatchCrossFilters,
  onBatchCrossSectionToggle,
  onBatchCrossYearChange,
  onBatchCrossMonthChange,
  onBatchCrossTypeToggle,
  onBatchCrossConfirm
}: {
  batches: IBatchManagementItems
  expandedBatchId: string | null
  onToggleBatch: (batchId: string) => void
  getBatchCrossFilters: (batchId: string) => IBatchCrossFilters
  getBatchCrossValidationMessage: (batchId: string) => string | null
  canConfirmBatchCrossFilters: (batchId: string) => boolean
  onBatchCrossSectionToggle: (batchId: string, section: keyof IBatchCrossFilters) => void
  onBatchCrossYearChange: (
    batchId: string,
    section: keyof IBatchCrossFilters,
    field: 'fromYear' | 'toYear',
    value: string | null
  ) => void
  onBatchCrossMonthChange: (
    batchId: string,
    field: 'fromMonth' | 'toMonth',
    value: string | null
  ) => void
  onBatchCrossTypeToggle: (
    batchId: string,
    section: keyof IBatchCrossFilters,
    crossType: string
  ) => void
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
                      validationMessage={getBatchCrossValidationMessage(batch.id)}
                      canConfirm={canConfirmBatchCrossFilters(batch.id)}
                      onSectionToggle={onBatchCrossSectionToggle}
                      onYearChange={onBatchCrossYearChange}
                      onMonthChange={onBatchCrossMonthChange}
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
