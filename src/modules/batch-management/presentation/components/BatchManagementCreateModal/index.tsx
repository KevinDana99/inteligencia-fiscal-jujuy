'use client'

import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title
} from '@mantine/core'
import { IconFileUpload } from '@tabler/icons-react'
import classes from './BatchManagementCreateModal.module.css'

const REGIME_OPTIONS = [
  { value: 'CM', label: 'Convenio Multilateral' },
  { value: 'RG', label: 'Régimen General' },
  { value: 'SAF', label: 'SAF' }
]

export function BatchManagementCreateModal({
  opened,
  batchNumber,
  name,
  regime,
  description,
  cuitsText,
  onClose,
  onFieldChange
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
}) {
  return (
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
              onChange={(event) => onFieldChange('name', event.currentTarget.value)}
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
              classNames={{ input: classes.fieldSelectInput }}
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
          >
            Importar Excel
          </Button>

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
        <Button className={classes.submitButton}>Cargar lote</Button>
      </Group>
    </Modal>
  )
}
