'use client'

import { useRef, useState } from 'react'
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
import classes from './BatchManagementCreateModal.module.css'

const REGIME_OPTIONS = [
  { value: 'CM', label: 'Convenio Multilateral' },
  { value: 'RG', label: 'Régimen General' },
  { value: 'SAF', label: 'SAF' }
]

const IMPORT_PREVIEW_ROWS = [
  {
    id: '1',
    cuit: '30-70123456-8',
    businessName: 'DISTRIBUIDORA NORTE ANDINO S.A.',
    status: 'valid'
  },
  {
    id: '2',
    cuit: '20-28456789-4',
    businessName: 'COMERCIAL PUNA NORTE S.R.L.',
    status: 'valid'
  },
  {
    id: '3',
    cuit: '30-61234567-2',
    businessName: 'TRANSPORTES QUEBRADA ALTA S.A.',
    status: 'valid'
  },
  {
    id: '4',
    cuit: '27-32178654-3',
    businessName: 'MINERA ALTIPLANO JUJUY S.A.',
    status: 'valid'
  },
  {
    id: '5',
    cuit: '30-55467891-0',
    businessName: 'AGRO HUMAHUACA S.R.L.',
    status: 'valid'
  },
  {
    id: '6',
    cuit: '99-00000000-0',
    businessName: '—',
    status: 'invalid'
  }
] as const

function ImportPreviewModal({
  opened,
  fileName,
  onClose,
  onConfirm
}: {
  opened: boolean
  fileName: string
  onClose: () => void
  onConfirm: () => void
}) {
  const validCount = IMPORT_PREVIEW_ROWS.filter((row) => row.status === 'valid').length
  const invalidCount = IMPORT_PREVIEW_ROWS.length - validCount

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
            {fileName} · 6 registros encontrados
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
              {IMPORT_PREVIEW_ROWS.map((row, index) => {
                const isInvalid = row.status === 'invalid'

                return (
                  <Table.Tr key={row.id} className={isInvalid ? classes.previewInvalidRow : ''}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td className={isInvalid ? classes.previewInvalidText : classes.previewMonoText}>
                      {row.cuit}
                    </Table.Td>
                    <Table.Td className={isInvalid ? classes.previewInvalidText : undefined}>
                      {row.businessName}
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        radius="xl"
                        className={
                          isInvalid ? classes.invalidStateBadge : classes.validStateBadge
                        }
                      >
                        {isInvalid ? '✕ Inválido' : '✓ Válido'}
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
  onClose,
  onFieldChange,
  onSubmit
}: {
  opened: boolean
  batchNumber: string
  name: string
  regime: string | null
  description: string
  cuitsText: string
  onClose: () => void
  onFieldChange: (
    field: 'name' | 'regime' | 'description' | 'cuitsText',
    value: string | null
  ) => void
  onSubmit: () => boolean
}) {
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false)
  const [selectedImportFileName, setSelectedImportFileName] = useState('archivo.xlsx')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isCreateReady = Boolean(name.trim() && regime && cuitsText.trim())
  const validImportedCuits = IMPORT_PREVIEW_ROWS.filter((row) => row.status === 'valid')
    .map((row) => row.cuit)
    .join('\n')

  const handleImportButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]

    if (!file) {
      return
    }

    setSelectedImportFileName(file.name)
    setIsImportPreviewOpen(true)
    event.currentTarget.value = ''
  }

  const handleConfirmImport = () => {
    onFieldChange('cuitsText', validImportedCuits)
    setIsImportPreviewOpen(false)
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
          >
            Cargar lote
          </Button>
        </Group>
      </Modal>

      <ImportPreviewModal
        opened={isImportPreviewOpen}
        fileName={selectedImportFileName}
        onClose={() => setIsImportPreviewOpen(false)}
        onConfirm={handleConfirmImport}
      />
    </>
  )
}
