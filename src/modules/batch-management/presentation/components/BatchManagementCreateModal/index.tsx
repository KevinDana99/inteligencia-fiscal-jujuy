'use client'

import { useRef, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import {
  IconAlertTriangleFilled,
  IconCheck,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUpload
} from '@tabler/icons-react'
import type {
  IBatchLoadedCuitRow,
  IBatchPreviewData
} from '../../../data/models/BatchManagement'
import classes from './BatchManagementCreateModal.module.css'

const REGIME_OPTIONS = [
  { value: 'CM', label: 'Convenio Multilateral' },
  { value: 'Regimen Local', label: 'Local' },
  { value: 'No inscripto', label: 'No inscripto' }
]

function ImportPreviewModal({
  opened,
  previewData,
  onClose,
  onConfirm
}: {
  opened: boolean
  previewData: IBatchPreviewData | null
  onClose: () => void
  onConfirm: () => void
}) {
  const validCount = previewData?.validCount ?? 0
  const invalidCount = (previewData?.invalidCount ?? 0) + (previewData?.duplicatedCount ?? 0)

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size={620}
      title={
        <Stack gap={4}>
          <Title order={2} className={classes.title}>
            Vista previa — Importación Excel
          </Title>
          <Text className={classes.description}>
            {previewData?.fileName ?? 'archivo.xlsx'} · {previewData?.foundRecords ?? 0}{' '}
            registros encontrados
          </Text>
        </Stack>
      }
      classNames={{
        content: classes.content,
        header: classes.header,
        body: classes.body,
        close: classes.closeButton,
        overlay: classes.overlay
      }}
    >
      <Stack gap={0} className={classes.previewContent}>
        <Group gap="xs" className={classes.previewStatusRow}>
          <Badge radius="xl" className={classes.validSummaryBadge}>
            ✓ {validCount} válidos
          </Badge>
          <Badge radius="xl" className={classes.invalidSummaryBadge}>
            ✕ {invalidCount} inválido
          </Badge>
        </Group>

        <div className={classes.previewTableWrap}>
          <Table withTableBorder={false} withColumnBorders={false} className={classes.previewTable}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>CUIT</Table.Th>
                <Table.Th>Razón Social</Table.Th>
                <Table.Th>Estado</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {previewData?.records.map((row) => {
                const isInvalid = row.status !== 'valid'

                return (
                  <Table.Tr
                    key={`${row.record}-${row.originalCuit}`}
                    className={isInvalid ? classes.previewInvalidRow : ''}
                  >
                    <Table.Td>{row.record}</Table.Td>
                    <Table.Td className={isInvalid ? classes.previewInvalidText : classes.previewMonoText}>
                      {row.originalCuit}
                    </Table.Td>
                    <Table.Td className={isInvalid ? classes.previewInvalidText : undefined}>
                      {row.businessName ?? '—'}
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        radius="xl"
                        className={
                          isInvalid ? classes.invalidStateBadge : classes.validStateBadge
                        }
                      >
                        {row.status === 'duplicated'
                          ? '✕ Duplicado'
                          : isInvalid
                            ? '✕ Inválido'
                            : '✓ Válido'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </div>

        <Group gap="xs" className={classes.previewAlert}>
          <IconAlertTriangleFilled size={16} className={classes.previewAlertIcon} />
          <Text className={classes.previewAlertText}>
            El CUIT inválido será ignorado. Se importarán{' '}
            <span className={classes.previewAlertStrong}>{validCount} CUITs válidos</span>.
          </Text>
        </Group>
      </Stack>

      <Group justify="flex-end" gap="sm" className={classes.footer}>
        <Button variant="default" className={classes.cancelButton} onClick={onClose}>
          Cancelar
        </Button>
        <Button
          className={classes.submitButtonActive}
          leftSection={<IconCheck size={14} />}
          onClick={onConfirm}
        >
          Confirmar importación ({validCount} CUITs)
        </Button>
      </Group>
    </Modal>
  )
}

type BatchManagementCreateModalProps = {
  opened: boolean
  batchNumber: string
  name: string
  regime: string | null
  description: string
  loadedCuitsSearchValue: string
  filteredLoadedCuits: IBatchLoadedCuitRow[]
  previewData: IBatchPreviewData | null
  isImportPreviewOpen: boolean
  isPreviewPending: boolean
  isCreatePending: boolean
  onClose: () => void
  onFieldChange: (
    field: 'name' | 'regime' | 'description' | 'cuitsText' | 'file',
    value: string | File | null
  ) => void
  onManualCuitsAdd: (value: string) => number
  onLoadedCuitRemove: (rowId: string) => void
  onLoadedCuitsSearchChange: (value: string) => void
  onImportFileSelect: (file: File) => void
  onImportPreviewClose: () => void
  onImportPreviewConfirm: () => void
  onSubmit: () => boolean
}

function BatchManagementCreateModalContent({
  opened,
  name,
  regime,
  description,
  previewData,
  isImportPreviewOpen,
  isPreviewPending,
  isCreatePending,
  onClose,
  onFieldChange,
  onManualCuitsAdd,
  onLoadedCuitRemove,
  loadedCuitsSearchValue,
  filteredLoadedCuits,
  onLoadedCuitsSearchChange,
  onImportFileSelect,
  onImportPreviewClose,
  onImportPreviewConfirm,
  onSubmit
}: BatchManagementCreateModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isManualInputOpen, setIsManualInputOpen] = useState(false)
  const [manualCuitValue, setManualCuitValue] = useState('')
  const isCreateReady = Boolean(name.trim() && regime && filteredLoadedCuits.length)

  const handleImportButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]

    if (!file) {
      return
    }

    onFieldChange('file', file)
    onImportFileSelect(file)
    event.currentTarget.value = ''
  }

  const handleNameChange = (value: string) => {
    onFieldChange('name', value.toUpperCase())
  }

  const handleCreateBatch = () => {
    if (!isCreateReady) {
      return
    }

    onSubmit()
  }

  const handleManualCuitSubmit = () => {
    const addedCount = onManualCuitsAdd(manualCuitValue)

    if (!addedCount) {
      return
    }

    setManualCuitValue('')
    setIsManualInputOpen(false)
  }

  const handleManualInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    handleManualCuitSubmit()
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        centered
        size={580}
        title={
          <Stack gap={4}>
            <Title order={2} className={classes.modalTitle}>
              Crear nuevo lote
            </Title>
            <Text className={classes.description}>
              Completá los datos y cargá los CUITs a analizar
            </Text>
          </Stack>
        }
        classNames={{
          content: classes.content,
          header: classes.modalHeader,
          body: classes.modalBody,
          close: classes.closeButton,
          overlay: classes.overlay
        }}
      >
        <Stack gap={20} className={classes.form}>
          <Group grow gap="md" align="flex-start" className={classes.topFieldRow}>
            <div className={classes.fieldGroup}>
              <Text className={classes.fieldLabel}>
                Nombre del lote <span className={classes.required}>*</span>
              </Text>
              <TextInput
                placeholder="Ej: ANOVA-623"
                value={name}
                onChange={(event) => handleNameChange(event.currentTarget.value)}
                classNames={{ input: classes.fieldInput }}
              />
            </div>

            <div className={classes.fieldGroup}>
              <Text className={classes.fieldLabel}>
                Tipo de contribuyente <span className={classes.required}>*</span>
              </Text>
              <Select
                data={REGIME_OPTIONS}
                placeholder="Seleccioná tipo de contribuyente"
                value={regime}
                onChange={(value) => onFieldChange('regime', value)}
                classNames={{
                  input: classes.fieldSelectInput,
                  dropdown: classes.fieldSelectDropdown,
                  options: classes.fieldSelectOptions,
                  option: classes.fieldSelectOption
                }}
              />
            </div>
          </Group>

          <div className={classes.fieldGroup}>
            <Text className={classes.fieldLabel}>Descripción del lote</Text>
            <TextInput
              placeholder="Ej: Comercio mayorista con variación negativa 2024"
              value={description}
              onChange={(event) => onFieldChange('description', event.currentTarget.value)}
              classNames={{ input: classes.fieldInput }}
            />
          </div>

          <div className={classes.fieldGroup}>
            <Text className={classes.fieldLabel}>
              CUITs a analizar <span className={classes.required}>*</span>
            </Text>

            <Group gap={8} align="center" wrap="nowrap" className={classes.cuitToolbar}>
              <TextInput
                leftSection={<IconSearch size={14} />}
                placeholder="Buscar por CUIT o razón social..."
                value={loadedCuitsSearchValue}
                onChange={(event) => onLoadedCuitsSearchChange(event.currentTarget.value)}
                className={classes.cuitSearchInput}
                classNames={{
                  input: classes.cuitSearchField,
                  section: classes.cuitSearchSection
                }}
              />

              <Button
                variant="default"
                leftSection={<IconUpload size={13} />}
                className={classes.toolbarButton}
                onClick={handleImportButtonClick}
                loading={isPreviewPending}
              >
                Importar Excel
              </Button>

              <Button
                variant="default"
                leftSection={<IconPlus size={13} />}
                className={classes.toolbarButton}
                onClick={() => setIsManualInputOpen((current) => !current)}
              >
                Cargar CUIT
              </Button>
            </Group>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className={classes.hiddenFileInput}
              onChange={handleImportFileChange}
            />

            {isManualInputOpen ? (
              <Group gap={8} wrap="nowrap" className={classes.manualInputRow}>
                <TextInput
                  value={manualCuitValue}
                  onChange={(event) => setManualCuitValue(event.currentTarget.value)}
                  onKeyDown={handleManualInputKeyDown}
                  placeholder="Escribí o pegá un CUIT..."
                  className={classes.manualCuitInput}
                  classNames={{ input: classes.manualCuitField }}
                />
                <Button className={classes.submitInlineButton} onClick={handleManualCuitSubmit}>
                  Agregar
                </Button>
              </Group>
            ) : null}

            <div className={classes.cuitTableContainer}>
              <Table withTableBorder={false} withColumnBorders={false} className={classes.cuitTable}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>#</Table.Th>
                    <Table.Th>CUIT</Table.Th>
                    <Table.Th>Razón Social</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredLoadedCuits.length ? (
                    filteredLoadedCuits.map((row, index) => (
                      <Table.Tr key={row.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td className={classes.tableMonoText}>{row.cuit}</Table.Td>
                        <Table.Td>{row.businessName ?? '—'}</Table.Td>
                        <Table.Td className={classes.removeColumn}>
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            className={classes.removeButton}
                            onClick={() => onLoadedCuitRemove(row.id)}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={4} className={classes.emptyTableCell}>
                        Agregá CUITs usando el campo de arriba o importando un Excel.
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </div>

            <Group justify="space-between" align="center" className={classes.cuitMetaRow}>
              <div className={classes.errorSlot} />
              <Text className={classes.cuitCounter}>
                {filteredLoadedCuits.length} CUITs cargados
              </Text>
            </Group>
          </div>
        </Stack>

        <Group justify="flex-end" gap="sm" className={classes.footer}>
          <Button variant="default" className={classes.cancelButton} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className={isCreateReady ? classes.submitButtonActive : classes.submitButton}
            disabled={!isCreateReady}
            onClick={handleCreateBatch}
            loading={isCreatePending}
          >
            Cargar lote
          </Button>
        </Group>
      </Modal>

      <ImportPreviewModal
        opened={isImportPreviewOpen}
        previewData={previewData}
        onClose={onImportPreviewClose}
        onConfirm={onImportPreviewConfirm}
      />
    </>
  )
}

export function BatchManagementCreateModal(props: BatchManagementCreateModalProps) {
  return <BatchManagementCreateModalContent key={props.batchNumber} {...props} />
}
