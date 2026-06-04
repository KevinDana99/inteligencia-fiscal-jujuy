'use client'

import Link from 'next/link'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  TextInput
} from '@mantine/core'
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconActivity,
  IconChevronDown,
  IconChevronLeft,
  IconFileText,
  IconList,
  IconLayoutList,
  IconSearch,
} from '@tabler/icons-react'
import {
  IntimationTemplate
} from '@/modules/dashboard-layout/presentation/components/IntimationTemplate'
import { useIntimationTemplate } from '@/modules/dashboard-layout/presentation/components/IntimationTemplate/useIntimationTemplate'
import { SendToReprocessingModal } from '@/modules/reprocessing/presentation/components'
import type { ICrossFilterColumnKey } from '../../../data/models/CrossManagement'
import { crossPreviewMockById } from '../../../data/sources/mock/fixtures/crossItems'
import { CrossFilterModal } from '../CrossFilterModal'
import { useCrossPreview } from '../../hooks'
import classes from './CrossPreviewPage.module.css'

const INDICATOR_CLASS_BY_TONE = {
  blue: classes.indicatorBlue,
  violet: classes.indicatorViolet,
  green: classes.indicatorGreen,
  orange: classes.indicatorOrange,
  red: classes.indicatorRed,
  darkBlue: classes.indicatorDarkBlue
} as const

const STATUS_OPTIONS: Record<string, string> = {
  estado: '— Estado',
  relevante: '✓ Relevante',
  reproceso: '🔴 Reproceso'
}

const ANALYSIS_FILTERABLE_COLUMNS: Array<{
  key: ICrossFilterColumnKey
  label: string
  title: string
}> = [
  { key: 'declaredBase', label: 'B.I. 910', title: 'B.I. 910' },
  { key: 'pretendedBase', label: 'B.I. PRETENDIDA', title: 'B.I. Pretendida' },
  { key: 'difference', label: 'DIFERENCIA', title: 'Diferencia' },
  { key: 'tax', label: 'IMPUESTO ESTIMADO', title: 'Impuesto Estimado' },
  { key: 'netDebt', label: 'NETO A PAGAR', title: 'Neto a Pagar' }
]

const PLAN_COLUMN_GROUPS = [
  { label: 'Identificación', span: 4, className: 'neutral' },
  { label: 'Fuentes de base imponible', span: 6, className: 'bi' },
  { label: 'Mayor base', span: 1, className: 'bi' },
  { label: 'CM05 Jujuy', span: 1, className: 'cm' },
  { label: 'Diferencia / período', span: 3, className: 'diff' },
  { label: 'CM05 — Coeficientes declarados', span: 5, className: 'cm' },
  { label: 'Nuevos coeficientes', span: 3, className: 'coef' },
  { label: 'BI estimada vs declarada', span: 3, className: 'estimated' },
  { label: 'Impuesto', span: 2, className: 'tax' },
  { label: 'Créditos', span: 2, className: 'coef' },
  { label: 'Final', span: 1, className: 'final' }
] as const

function Pager({
  current,
  total,
  disabled
}: {
  current: number
  total: number
  disabled?: boolean
}) {
  return (
    <div className={classes.pager}>
      <ActionIcon
        variant='default'
        radius='md'
        className={classes.pagerButton}
        disabled={disabled || current <= 1}
      >
        <IconArrowNarrowLeft size={14} />
      </ActionIcon>
      <Text className={classes.pagerLabel}>
        {current} / {total}
      </Text>
      <ActionIcon
        variant='default'
        radius='md'
        className={classes.pagerButton}
        disabled={disabled || current >= total}
      >
        <IconArrowNarrowRight size={14} />
      </ActionIcon>
    </div>
  )
}

export function CrossPreviewPage({ crossId }: { crossId: string }) {
  const cross = crossPreviewMockById[crossId]
  const intimationTemplate = useIntimationTemplate()
  const handleIntimationNext = () => {}

  if (!cross) {
    return (
      <Card className={classes.emptyCard} radius='lg' padding='xl'>
        <Stack gap='xs'>
          <Text className={classes.emptyTitle}>Cruce no encontrado</Text>
          <Text className={classes.emptyText}>
            No se encontró información asociada al cruce solicitado.
          </Text>
        </Stack>
      </Card>
    )
  }

  const {
    activeTab,
    planillaSearch,
    resumenSearch,
    columnFilters,
    activeFilterColumn,
    filterError,
    isFilterPending,
    intimationModalOpened,
    pendingReprocessingRow,
    filteredPlanRows,
    filteredAnalysisRows,
    statusByCuit,
    updateTab,
    openFilterModal,
    closeFilterModal,
    applyFilter,
    clearFilter,
    requestAnalysisStatusChange,
    closeReprocessingModal,
    confirmReprocessingModal,
    openIntimationModal,
    closeIntimationModal,
    setPlanillaSearch,
    setResumenSearch
  } = useCrossPreview(cross)

  const isPlanilla = activeTab === 'planilla'

  const renderStatusSelect = (row: (typeof cross.analysisRows)[number]) => {
    const status = statusByCuit[row.cuit]

    return (
      <select
        value={status}
        onChange={(event) =>
          requestAnalysisStatusChange(
            row,
            event.currentTarget.value as
              | 'estado'
              | 'relevante'
              | 'reproceso'
          )
        }
        className={`${classes.statusSelect} ${
          status === 'relevante'
            ? classes.statusSelectRelevant
            : status === 'reproceso'
              ? classes.statusSelectReprocessing
              : classes.statusSelectNeutral
        }`}
      >
        <option value='estado'>{STATUS_OPTIONS.estado}</option>
        <option value='relevante'>{STATUS_OPTIONS.relevante}</option>
        <option value='reproceso'>{STATUS_OPTIONS.reproceso}</option>
      </select>
    )
  }

  const renderAnalysisHeaderCell = (
    column: (typeof ANALYSIS_FILTERABLE_COLUMNS)[number]
  ) => (
    <Table.Th key={column.key} className={classes.analysisHeaderCell}>
      <button
        type='button'
        className={`${classes.columnFilterButton} ${
          columnFilters[column.key] ? classes.columnFilterButtonActive : ''
        }`}
        onClick={() => openFilterModal({ key: column.key, label: column.title })}
      >
        <span>{column.label}</span>
        <IconChevronDown size={12} stroke={2.2} />
      </button>
    </Table.Th>
  )

  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <div className={classes.topBarLeft}>
          <Link href='/gestion-de-cruces' className={classes.backButton}>
            <IconChevronLeft size={14} />
            Gestión de Cruces
          </Link>

          <div className={classes.viewToggle}>
            <button
              type='button'
              className={`${classes.viewToggleButton} ${isPlanilla ? classes.viewToggleButtonActive : ''}`}
              onClick={() => updateTab('planilla')}
            >
              <IconList size={13} />
              Planilla
            </button>
            <button
              type='button'
              className={`${classes.viewToggleButton} ${!isPlanilla ? classes.viewToggleButtonActive : ''}`}
              onClick={() => updateTab('resumen')}
            >
              <IconLayoutList size={13} />
              Resumen
            </button>
          </div>
        </div>

        {!isPlanilla ? (
          <Button
            size='xs'
            className={classes.primaryButton}
            leftSection={<IconFileText size={14} />}
            onClick={openIntimationModal}
          >
            Generar intimación
          </Button>
        ) : null}
      </div>

      <Card className={classes.headerCard} radius='lg' padding={0}>
        <div className={classes.headerCardInner}>
          <div className={classes.headerIcon}>
            <IconActivity size={18} color='#4375EE' stroke={2} />
          </div>
          <div className={classes.headerTitleBlock}>
            <Text className={classes.headerEyebrow}>Cruce en curso</Text>
            <Text className={classes.headerTitle}>{cross.name}</Text>
          </div>

          <div className={classes.headerMeta}>
            <div className={classes.metaItem}>
              <Text className={classes.metaLabel}>Lote / CUIT</Text>
              <Text className={classes.metaValue}>{cross.sourceRef}</Text>
            </div>
            <div className={classes.metaItem}>
              <Text className={classes.metaLabel}>Período</Text>
              <Text className={classes.metaValue}>{cross.period}</Text>
            </div>
            <div className={classes.metaItem}>
              <Text className={classes.metaLabel}>Total CUITs</Text>
              <Text className={classes.metaValue}>{cross.cuitCount}</Text>
            </div>
            <div className={classes.metaItem}>
              <Text className={classes.metaLabel}>Relevantes</Text>
              <Text className={classes.metaValueSuccess}>
                {cross.relevantCountLabel}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {isPlanilla ? (
        <div className={`${classes.contentStack} ${classes.planillaStack}`}>
          <Group gap='md' className={classes.indicatorsRow}>
            {cross.indicators.map((indicator) => (
              <div key={indicator.id} className={classes.indicatorItem}>
                <span
                  className={`${classes.indicatorSwatch} ${INDICATOR_CLASS_BY_TONE[indicator.tone]}`}
                />
                <Text className={classes.indicatorLabel}>{indicator.label}</Text>
              </div>
            ))}
          </Group>

          <Card className={classes.tableCard} radius='lg' padding={0}>
            <div className={`${classes.tableToolbar} ${classes.tableToolbarTall}`}>
              <Text className={classes.tableToolbarTitle}>Planilla de datos</Text>
              <TextInput
                value={planillaSearch}
                onChange={(event) => setPlanillaSearch(event.currentTarget.value)}
                placeholder='Buscar CUIT o razón social...'
                leftSection={<IconSearch size={14} />}
                className={classes.toolbarSearch}
                classNames={{
                  input: classes.toolbarSearchInput,
                  section: classes.toolbarSearchSection
                }}
              />
            </div>

            <div className={classes.tableWrap}>
              <Table className={classes.planTable} withTableBorder={false} withColumnBorders={false}>
                <Table.Thead>
                  <Table.Tr>
                    {PLAN_COLUMN_GROUPS.map((group) => (
                      <Table.Th
                        key={group.label}
                        colSpan={group.span}
                        className={`${classes.planGroupHeaderCell} ${
                          group.className === 'neutral'
                            ? classes.planGroupNeutralHeaderCell
                            : group.className === 'bi'
                              ? classes.planGroupBiHeaderCell
                              : group.className === 'cm'
                                ? classes.planGroupCmHeaderCell
                                : group.className === 'diff'
                                  ? classes.planGroupDiffHeaderCell
                                  : group.className === 'coef'
                                    ? classes.planGroupCoefHeaderCell
                                    : group.className === 'estimated'
                                      ? classes.planGroupEstimatedHeaderCell
                                      : group.className === 'tax'
                                        ? classes.planGroupTaxHeaderCell
                                        : classes.planGroupFinalHeaderCell
                        }`}
                      >
                        {group.label}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                  <Table.Tr>
                    {cross.planColumns.map((column) => (
                      <Table.Th
                        key={column}
                        className={`${classes.tableHeaderCell} ${
                          [
                            'Fact. ARCA (año)',
                            'Fact. ARCA (fecha)',
                            'Ag. Percepción',
                            'Ag. Retención',
                            'Pago a Cta.',
                            'Retenciones',
                            'MAYOR'
                          ].includes(column)
                            ? classes.planBiHeaderCell
                              : [
                                    'CM05 Jujuy',
                                    'Cierre Ej.',
                                    'Tot. Ing. País',
                                    'CI Decl.',
                                    'Tot. Egr.',
                                    'Coef. Egr.'
                                  ].includes(column)
                                ? classes.planCmHeaderCell
                                : ['Dif. Base', 'Mes', 'Año'].includes(column)
                                  ? classes.planDiffHeaderCell
                              : [
                                    'Nuevo CI',
                                    'CU Decl.',
                                    'NCU',
                                    'Dif. Créditos',
                                    'SAF'
                                  ].includes(column)
                                ? classes.planCoefHeaderCell
                                : [
                                      'BI Total País',
                                      'BI Estimada',
                                      'BI Decl. CM03'
                                    ].includes(column)
                                  ? classes.planEstimatedHeaderCell
                                  : ['Alícuota', 'Imp. Presuntivo'].includes(
                                        column
                                      )
                                    ? classes.planTaxHeaderCell
                                  : column === 'EST. FINAL'
                                    ? classes.planFinalHeaderCell
                            : ''
                        }`}
                      >
                        {column}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPlanRows.length ? (
                    filteredPlanRows.map((row) => (
                      <Table.Tr key={row.id}>
                        {row.cells.map((cell, index) => (
                          <Table.Td
                            key={`${row.id}-${index}`}
                            className={`${classes.tableBodyCell} ${
                              index === 0 || index === 1 ? classes.planIdCell : ''
                            } ${index === 2 ? classes.planCuitCell : ''} ${
                              index === 3 ? classes.planBusinessNameCell : ''
                            } ${index >= 4 && index <= 10 ? classes.planBiBodyCell : ''} ${
                              index === 11 || (index >= 15 && index <= 19)
                                ? classes.planCmBodyCell
                                : ''
                            } ${
                              index >= 12 && index <= 14
                                ? classes.planDiffBodyCell
                                : ''
                            } ${index === 12 ? classes.planDiffValueCell : ''} ${
                              index === 13 || index === 14 ? classes.planDiffMetaCell : ''
                            } ${
                              (index >= 20 && index <= 22) || index === 28 || index === 29
                                ? classes.planCoefBodyCell
                                : ''
                            } ${
                              index >= 23 && index <= 25
                                ? classes.planEstimatedBodyCell
                                : ''
                            } ${index === 24 ? classes.planEstimatedBlueCell : ''} ${
                              index === 26 || index === 27
                                ? classes.planTaxBodyCell
                                : ''
                            } ${index === 30 ? classes.planFinalBodyCell : ''}`}
                          >
                            {cell}
                          </Table.Td>
                        ))}
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={cross.planColumns.length}>
                        <Text className={classes.emptyStateText}>
                          No se encontraron resultados para la búsqueda actual.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </div>
          </Card>
        </div>
      ) : (
        <div className={classes.contentStack}>
          <Card className={classes.tableCard} radius='lg' padding={0}>
            <div className={`${classes.tableToolbar} ${classes.tableToolbarCompact}`}>
              <Text className={classes.tableToolbarTitle}>Resumen</Text>
              <Badge className={classes.toolbarBadge} radius='xl'>
                {cross.cuitCount} CUITs · {cross.source === 'Lote' ? 'RÉGIMEN CM' : 'PADRÓN'}
              </Badge>
            </div>

            <div className={classes.simpleTableWrap}>
              <Table className={classes.summaryTable} withTableBorder={false} withColumnBorders={false}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className={`${classes.summaryHeaderCell} ${classes.summaryHeaderCellLeft}`}>RÉGIMEN</Table.Th>
                    <Table.Th className={classes.summaryHeaderCell}>B.I. 910</Table.Th>
                    <Table.Th className={classes.summaryHeaderCell}>B.I. PRETENDIDA</Table.Th>
                    <Table.Th className={classes.summaryHeaderCell}>DIF A FAVOR DPR</Table.Th>
                    <Table.Th className={classes.summaryHeaderCell}>IMPUESTO</Table.Th>
                    <Table.Th className={classes.summaryHeaderCell}>DEUDA NETA</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cross.summaryRows.map((row) => (
                    <Table.Tr key={row.regime}>
                      <Table.Td className={`${classes.summaryBodyCell} ${classes.summaryBodyCellLeft}`}>{row.regime}</Table.Td>
                      <Table.Td className={classes.summaryBodyCell}>{row.declaredBase}</Table.Td>
                      <Table.Td className={classes.summaryBodyCell}>{row.pretendedBase}</Table.Td>
                      <Table.Td className={`${classes.summaryBodyCell} ${classes.summaryDangerCell}`}>{row.difference}</Table.Td>
                      <Table.Td className={`${classes.summaryBodyCell} ${classes.summaryDangerCell}`}>{row.tax}</Table.Td>
                      <Table.Td className={`${classes.summaryBodyCell} ${classes.summaryDangerCell}`}>{row.netDebt}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </Card>

          <Card className={classes.tableCard} radius='lg' padding={0}>
            <div className={`${classes.tableToolbar} ${classes.tableToolbarTall}`}>
              <Text className={classes.tableToolbarTitle}>
                Análisis sistémico por CUIT
              </Text>
              <TextInput
                value={resumenSearch}
                onChange={(event) => setResumenSearch(event.currentTarget.value)}
                placeholder='Buscar CUIT o razón social...'
                leftSection={<IconSearch size={14} />}
                className={classes.toolbarSearch}
                classNames={{
                  input: classes.toolbarSearchInput,
                  section: classes.toolbarSearchSection
                }}
              />
            </div>

            <div className={classes.simpleTableWrap}>
              <Table className={classes.analysisTable} withTableBorder={false} withColumnBorders={false}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className={`${classes.analysisHeaderCell} ${classes.analysisHeaderCellLeft}`}>CUIT</Table.Th>
                    <Table.Th className={`${classes.analysisHeaderCell} ${classes.analysisHeaderCellLeft}`}>RAZÓN SOCIAL</Table.Th>
                    {ANALYSIS_FILTERABLE_COLUMNS.map(renderAnalysisHeaderCell)}
                    <Table.Th className={classes.analysisHeaderCell}>ESTADO</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredAnalysisRows.length ? (
                    filteredAnalysisRows.map((row) => (
                      <Table.Tr key={row.cuit}>
                        <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisBodyCellMonospace}`}>{row.cuit}</Table.Td>
                        <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisBodyCellLeft}`}>{row.businessName}</Table.Td>
                        <Table.Td className={classes.analysisBodyCell}>{row.declaredBase}</Table.Td>
                        <Table.Td className={classes.analysisBodyCell}>{row.pretendedBase}</Table.Td>
                        <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisDangerCell}`}>{row.difference}</Table.Td>
                        <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisDangerCell}`}>{row.tax}</Table.Td>
                        <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisDangerCell}`}>{row.netDebt}</Table.Td>
                        <Table.Td className={classes.analysisBodyCell}>
                          <div className={classes.statusCell}>
                            {renderStatusSelect(row)}
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={8}>
                        <Text className={classes.emptyStateText}>
                          No se encontraron resultados para la búsqueda actual.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </div>

            <div className={classes.tableFooter}>
              <Pager current={1} total={1} disabled />
            </div>
          </Card>
        </div>
      )}

      <Modal
        opened={intimationModalOpened}
        onClose={closeIntimationModal}
        centered
        size={640}
        title='Generar intimación'
        classNames={{
          overlay: classes.intimationModalOverlay,
          content: classes.intimationModalContent,
          header: classes.intimationModalHeader,
          body: classes.intimationModalBody,
          title: classes.intimationModalTitle,
          close: classes.intimationModalClose
        }}
      >
        <IntimationTemplate
          controller={intimationTemplate}
          footerActions={
            <Button
              className={classes.intimationModalNextButton}
              onClick={handleIntimationNext}
            >
              Siguiente
            </Button>
          }
        />
      </Modal>

      <SendToReprocessingModal
        opened={Boolean(pendingReprocessingRow)}
        onClose={closeReprocessingModal}
        contribuyenteId={pendingReprocessingRow?.cuit ?? ''}
        cuit={pendingReprocessingRow?.cuit ?? ''}
        razonSocial={pendingReprocessingRow?.businessName ?? ''}
        onConfirm={async () => {
          confirmReprocessingModal()
        }}
      />

      <CrossFilterModal
        opened={Boolean(activeFilterColumn)}
        columnKey={activeFilterColumn?.key ?? null}
        columnLabel={activeFilterColumn?.label ?? ''}
        initialValue={
          activeFilterColumn ? columnFilters[activeFilterColumn.key] ?? null : null
        }
        isPending={isFilterPending}
        error={filterError}
        onClose={closeFilterModal}
        onClear={clearFilter}
        onApply={applyFilter}
      />
    </div>
  )
}
