'use client'

import Link from 'next/link'
import {
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
import { crossPreviewMockById } from '../../../data/sources/mock/fixtures/crossItems'
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

export function CrossPreviewPage({ crossId }: { crossId: string }) {
  const cross = crossPreviewMockById[crossId]
  const intimationTemplate = useIntimationTemplate()

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
    intimationModalOpened,
    filteredPlanRows,
    filteredAnalysisRows,
    updateTab,
    openIntimationModal,
    closeIntimationModal,
    setPlanillaSearch,
    setResumenSearch
  } = useCrossPreview(cross)

  const isPlanilla = activeTab === 'planilla'

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

      <Card className={classes.headerCard} radius='lg' padding='lg'>
        <div className={classes.headerCardInner}>
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
        <div className={classes.contentStack}>
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
            <div className={classes.tableToolbar}>
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
                    {cross.planColumns.map((column) => (
                      <Table.Th key={column}>{column}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPlanRows.length ? (
                    filteredPlanRows.map((row) => (
                      <Table.Tr key={row.id}>
                        {row.cells.map((cell, index) => (
                          <Table.Td key={`${row.id}-${index}`}>{cell}</Table.Td>
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
            <div className={classes.tableToolbar}>
              <Text className={classes.tableToolbarTitle}>Resumen</Text>
              <Badge className={classes.toolbarBadge} radius='xl'>
                {cross.cuitCount} CUITs · {cross.source === 'Lote' ? 'RÉGIMEN CM' : 'PADRÓN'}
              </Badge>
            </div>

            <div className={classes.simpleTableWrap}>
              <Table className={classes.summaryTable} withTableBorder={false} withColumnBorders={false}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>RÉGIMEN</Table.Th>
                    <Table.Th>B.I. 910</Table.Th>
                    <Table.Th>B.I. PRETENDIDA</Table.Th>
                    <Table.Th>DIFERENCIA</Table.Th>
                    <Table.Th>IMPUESTO</Table.Th>
                    <Table.Th>DEUDA NETA</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cross.summaryRows.map((row) => (
                    <Table.Tr key={row.regime}>
                      <Table.Td>{row.regime}</Table.Td>
                      <Table.Td>{row.declaredBase}</Table.Td>
                      <Table.Td>{row.pretendedBase}</Table.Td>
                      <Table.Td>{row.difference}</Table.Td>
                      <Table.Td>{row.tax}</Table.Td>
                      <Table.Td>{row.netDebt}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </Card>

          <Card className={classes.tableCard} radius='lg' padding={0}>
            <div className={classes.tableToolbar}>
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
                    <Table.Th>CUIT</Table.Th>
                    <Table.Th>RAZÓN SOCIAL</Table.Th>
                    <Table.Th>B.I. 910</Table.Th>
                    <Table.Th>B.I. PRETENDIDA</Table.Th>
                    <Table.Th>DIFERENCIA</Table.Th>
                    <Table.Th>IMPUESTO</Table.Th>
                    <Table.Th>DEUDA NETA</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredAnalysisRows.length ? (
                    filteredAnalysisRows.map((row) => (
                      <Table.Tr key={row.cuit}>
                        <Table.Td>{row.cuit}</Table.Td>
                        <Table.Td>{row.businessName}</Table.Td>
                        <Table.Td>{row.declaredBase}</Table.Td>
                        <Table.Td>{row.pretendedBase}</Table.Td>
                        <Table.Td>{row.difference}</Table.Td>
                        <Table.Td>{row.tax}</Table.Td>
                        <Table.Td>{row.netDebt}</Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
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
          confirmLabel='Generar intimación'
          onConfirm={closeIntimationModal}
        />
      </Modal>
    </div>
  )
}
