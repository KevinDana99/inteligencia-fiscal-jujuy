'use client'

import {
  ActionIcon,
  Button,
  Modal,
  Table,
  Text
} from '@mantine/core'
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconFileText,
  IconX
} from '@tabler/icons-react'
import type { IntimationTemplateState } from '@/modules/dashboard-layout/presentation/components/IntimationTemplate/useIntimationTemplate'
import type { ICrossPreviewPlanRow } from '../../../data/models/CrossManagement'
import classes from './IntimationExportModal.module.css'

type IntimationExportContributor = Pick<
  ICrossPreviewPlanRow,
  'id' | 'cuit' | 'businessName' | 'cells'
>

type IntimationExportModalProps = {
  opened: boolean
  onClose: () => void
  onBack: () => void
  onDownloadPdf?: () => void
  onDownloadDocx?: () => void
  contributors: IntimationExportContributor[]
  activeIndex: number
  onPrevious: () => void
  onNext: () => void
  templateState: IntimationTemplateState
}

const COLUMN_CELL_INDEX_BY_ID: Record<string, number> = {
  'fact-arca-anio': 4,
  'fact-arca-fecha': 5,
  'ag-percepcion': 6,
  'ag-retencion': 7,
  'pago-a-cta': 8,
  mes: 13,
  anio: 14,
  'cierre-ej': 15,
  'tot-ing-pais': 16,
  'ci-decl': 17,
  'tot-egr': 18,
  'coef-egr': 19,
  'nuevo-ci': 20,
  'cu-decl': 21,
  ncu: 22,
  'bi-total-pais': 23,
  'bi-estimada': 24,
  'bi-decl-cm03': 25,
  alicuota: 26,
  'dif-creditos': 28,
  saf: 29,
  'base-interna': 10,
  'base-terceros': 23,
  'diferencia-base': 12
}

function resolveColumnValue(
  contributor: IntimationExportContributor | undefined,
  columnId: string
) {
  if (!contributor) {
    return '—'
  }

  const index = COLUMN_CELL_INDEX_BY_ID[columnId]

  if (typeof index !== 'number') {
    return '—'
  }

  return contributor.cells[index] ?? '—'
}

export function IntimationExportModal({
  opened,
  onClose,
  onBack,
  onDownloadPdf,
  onDownloadDocx,
  contributors,
  activeIndex,
  onPrevious,
  onNext,
  templateState
}: IntimationExportModalProps) {
  const currentContributor =
    contributors[Math.min(Math.max(activeIndex, 0), Math.max(contributors.length - 1, 0))]

  const currentPage = contributors.length ? activeIndex + 1 : 0
  const totalPages = contributors.length

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered={false}
      withinPortal
      classNames={{
        overlay: classes.overlay,
        content: classes.content,
        body: classes.body
      }}
    >
      <div className={classes.shell}>
        <div className={classes.topBar}>
          <div className={classes.topBarLeft}>
            <IconFileText size={16} color='var(--mantine-color-gray-4)' />
            <Text className={classes.topBarTitle}>Intimación — Previsualización</Text>
            <span className={classes.countBadge}>
              {contributors.length} intimaciones
            </span>
          </div>

          <ActionIcon
            variant='subtle'
            className={classes.closeButton}
            aria-label='Cerrar previsualización'
            onClick={onClose}
          >
            <IconX size={14} />
          </ActionIcon>
        </div>

        <div className={classes.paginationBar}>
          <ActionIcon
            variant='subtle'
            className={classes.pageButton}
            aria-label='Contribuyente anterior'
            onClick={onPrevious}
            disabled={currentPage <= 1}
          >
            <IconChevronLeft size={14} />
          </ActionIcon>
          <Text className={classes.paginationLabel}>
            Contribuyente {currentPage} de {totalPages}
          </Text>
          <ActionIcon
            variant='subtle'
            className={classes.pageButton}
            aria-label='Contribuyente siguiente'
            onClick={onNext}
            disabled={currentPage >= totalPages}
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        </div>

        <div className={classes.contributorBar}>
          <span className={classes.contributorName}>
            {currentContributor?.businessName ?? 'Sin contribuyente'}
          </span>
          <span className={classes.contributorCuit}>
            CUIT: {currentContributor?.cuit ?? '—'}
          </span>
        </div>

        <div className={classes.previewSurface}>
          <div className={classes.pageSheet}>
            <div className={classes.pageNumber}>Página 1</div>
            <div className={classes.docHeaderBlock}>
              <Text className={classes.docContributor}>
                CONTRIBUYENTE: {currentContributor?.businessName ?? '—'}
              </Text>
              <Text className={classes.docContributor}>
                CUIT: {currentContributor?.cuit ?? '—'}
              </Text>
            </div>

            <Text className={classes.docSubject}>{templateState.asunto}</Text>

            <div className={classes.docBody}>
              <Text className={classes.docParagraph}>{templateState.saludo}</Text>
              {templateState.cuerpo.split('\n').map((paragraph, index) => (
                <Text key={`${paragraph}-${index}`} className={classes.docParagraph}>
                  {paragraph || '\u00A0'}
                </Text>
              ))}
            </div>

            <div className={classes.previewTableWrap}>
              <Text className={classes.previewTableTitle}>
                PLANILLA ADJUNTA - DETALLE DE DIFERENCIA DE BASE IMPONIBLE
              </Text>

              <Table
                className={classes.previewTable}
                withTableBorder={false}
                withColumnBorders={false}
              >
                <Table.Thead>
                  <Table.Tr>
                    {templateState.columnas.map((column) => (
                      <Table.Th key={column.id} className={classes.previewTableHeader}>
                        {column.value}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    {templateState.columnas.map((column) => (
                      <Table.Td key={column.id} className={classes.previewTableCell}>
                        {resolveColumnValue(currentContributor, column.id)}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>

            {templateState.fuenteInformacion ? (
              <Text className={classes.docFooterMeta}>
                Fuente de información: {templateState.fuenteInformacion}
              </Text>
            ) : null}
            <Text className={classes.docFooterMeta}>{templateState.fechaCorte}</Text>
          </div>
        </div>

        <div className={classes.bottomBar}>
          <Button
            variant='subtle'
            className={classes.backButton}
            leftSection={<IconChevronLeft size={14} />}
            onClick={onBack}
          >
            Volver
          </Button>

          <div className={classes.downloadActions}>
            <Button
              variant='subtle'
              className={classes.secondaryDownloadButton}
              leftSection={<IconDownload size={14} />}
              onClick={onDownloadDocx}
            >
              Descargar Word
            </Button>
            <Button
              className={classes.primaryDownloadButton}
              leftSection={<IconDownload size={14} />}
              onClick={onDownloadPdf}
            >
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
