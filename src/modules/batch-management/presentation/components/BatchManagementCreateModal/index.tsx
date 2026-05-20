'use client'

import { useRef } from 'react'
import {
  Badge,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title
} from '@mantine/core'
import { IconAlertTriangleFilled, IconCheck, IconFileUpload } from '@tabler/icons-react'
import type { IBatchPreviewData } from '../../../data/models/BatchManagement'
import classes from './BatchManagementCreateModal.module.css'

const REGIME_OPTIONS = [
  { value: 'CM', label: 'Convenio Multilateral' },
  { value: 'Regimen Local', label: 'Regimen Local' }
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

export function BatchManagementCreateModal({
  opened,
  batchNumber,
  name,
  regime,
  description,
  cuitsText,
  previewData,
  isImportPreviewOpen,
  isPreviewPending,
  isCreatePending,
  onClose,
  onFieldChange,
  onImportFileSelect,
  onImportPreviewClose,
  onImportPreviewConfirm,
  onSubmit
}: {
  opened: boolean
  batchNumber: string
  name: string
  regime: string | null
  description: string
  cuitsText: string
  previewData: IBatchPreviewData | null
  isImportPreviewOpen: boolean
  isPreviewPending: boolean
  isCreatePending: boolean
  onClose: () => void
  onFieldChange: (
    field: 'name' | 'regime' | 'description' | 'cuitsText' | 'file',
    value: string | File | null
  ) => void
  onImportFileSelect: (file: File) => void
  onImportPreviewClose: () => void
  onImportPreviewConfirm: () => void
  onSubmit: () => boolean
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isCreateReady = Boolean(name.trim() && regime && cuitsText.trim())

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

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        centered
        size={580}
        title={
          <Stack gap={4}>
            <Title order={2} className={classes.title}>
              Crear nuevo lote
            </Title>
            <Text className={classes.description}>
              Completá los datos y cargá los CUITs a analizar
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
        <Stack gap={0} className={classes.form}>
          <div className={classes.section}>
            <Text className={classes.fieldLabel}>Nro de lote</Text>
            <TextInput
              value={batchNumber}
              readOnly
              classNames={{
                input: `${classes.fieldInput} ${classes.readonlyInput}`
              }}
            />
            <Text className={classes.fieldHint}>Generado automáticamente por el sistema.</Text>
          </div>

          <Group grow gap="md" className={`${classes.section} ${classes.fieldRow}`}>
            <div>
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

            <div>
              <Text className={classes.fieldLabel}>
                Régimen <span className={classes.required}>*</span>
              </Text>
              <Select
                data={REGIME_OPTIONS}
                placeholder="Seleccioná un régimen"
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

          <div className={classes.section}>
            <Text className={classes.fieldLabel}>Descripción del lote</Text>
            <TextInput
              placeholder="Ej: Comercio mayorista con variación negativa 2024"
              value={description}
              onChange={(event) => onFieldChange('description', event.currentTarget.value)}
              classNames={{ input: classes.fieldInput }}
            />
          </div>

          <div className={classes.section}>
            <Text className={classes.fieldLabel}>
              CUITs a analizar <span className={classes.required}>*</span>
            </Text>

            <Button
              variant="default"
              leftSection={<IconFileUpload size={14} />}
              className={classes.importButton}
              mb="md"
              onClick={handleImportButtonClick}
              loading={isPreviewPending}
            >
              Importar Excel
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className={classes.hiddenFileInput}
              onChange={handleImportFileChange}
            />

            <Textarea
              placeholder="Escribí o pegá CUITs..."
              value={cuitsText}
              onChange={(event) => onFieldChange('cuitsText', event.currentTarget.value)}
              classNames={{
                input: `${classes.fieldTextarea} ${classes.cuitsTextarea}`
              }}
            />

            <Text className={classes.helperText}>
              Presioná Enter para agregar, o pegá varios separados por coma.
            </Text>
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
