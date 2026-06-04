'use client'

import type { ReactNode } from 'react'
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconPlus,
  IconXFilled
} from '@tabler/icons-react'
import type { IntimationTemplateController } from './useIntimationTemplate'
import classes from './IntimationTemplate.module.css'

const formInputClasses = {
  input: classes.formInput
}

type IntimationTemplateProps = {
  controller: IntimationTemplateController
  confirmLabel?: string
  confirmButtonClassName?: string
  onConfirm?: () => void
  footerActions?: ReactNode
}

export function IntimationTemplate({
  controller,
  confirmLabel = 'Confirmar cambios',
  confirmButtonClassName,
  onConfirm,
  footerActions
}: IntimationTemplateProps) {
  const {
    state,
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnId,
    selectedVisibleColumnId,
    availableColumns,
    visibleColumns,
    updateField,
    openColumnPicker,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn,
    updateColumn,
    removeColumn
  } = controller

  return (
    <div className={classes.root}>
      <Card className={classes.sectionCard} radius='lg' padding={0}>
        <Text className={classes.sectionLabel}>Asunto</Text>
        <div className={classes.fieldGroup}>
          <Text className={classes.fieldTitle}>Texto del asunto</Text>
          <TextInput
            value={state.asunto}
            onChange={(event) => updateField('asunto', event.currentTarget.value)}
            classNames={formInputClasses}
          />
        </div>
      </Card>

      <Card className={classes.sectionCard} radius='lg' padding={0}>
        <Text className={classes.sectionLabel}>Cuerpo del documento</Text>
        <Stack gap='md'>
          <div className={classes.fieldGroup}>
            <Text className={classes.fieldTitle}>Saludo</Text>
            <TextInput
              value={state.saludo}
              onChange={(event) =>
                updateField('saludo', event.currentTarget.value)
              }
              classNames={formInputClasses}
            />
          </div>

          <div className={classes.fieldGroup}>
            <Text className={classes.fieldTitle}>Texto del cuerpo</Text>
            <Textarea
              value={state.cuerpo}
              onChange={(event) =>
                updateField('cuerpo', event.currentTarget.value)
              }
              classNames={formInputClasses}
            />
          </div>
        </Stack>
      </Card>

      <Card className={classes.sectionCard} radius='lg' padding={0}>
        <Text className={classes.sectionLabel}>Planilla adjunta — Columnas</Text>
        <Text className={classes.sectionHint}>
          Columnas que aparecen en la tabla de comparación de bases
        </Text>

        <Stack gap='sm' className={classes.columnList}>
          {visibleColumns.map((column) => (
            <div key={column.id} className={classes.columnRow}>
              <span className={classes.columnToken}>✓</span>
              <TextInput
                value={column.value}
                onChange={(event) =>
                  updateColumn(column.id, event.currentTarget.value)
                }
                className={classes.columnInput}
                classNames={formInputClasses}
              />
              <ActionIcon
                variant='subtle'
                color='red'
                aria-label={`Eliminar columna ${column.value}`}
                onClick={() => removeColumn(column.id)}
                className={classes.columnRemove}
              >
                <IconXFilled size={16} />
              </ActionIcon>
            </div>
          ))}
        </Stack>

        <Button
          variant='default'
          className={classes.addColumnButton}
          leftSection={<IconPlus size={14} />}
          onClick={openColumnPicker}
        >
          Elegir columnas de planilla
        </Button>

        <div className={classes.fieldGroup}>
          <Text className={classes.fieldTitle}>
            Fuente de información{' '}
            <span className={classes.optionalLabel}>(opcional)</span>
          </Text>
          <TextInput
            value={state.fuenteInformacion}
            onChange={(event) =>
              updateField('fuenteInformacion', event.currentTarget.value)
            }
            placeholder='Ej: Facturación de compras, ARCA, etc.'
            classNames={formInputClasses}
          />
        </div>

        <div className={classes.fieldGroupFooter}>
          <Text className={classes.fieldTitle}>Fecha de corte</Text>
          <TextInput
            value={state.fechaCorte}
            onChange={(event) =>
              updateField('fechaCorte', event.currentTarget.value)
            }
            classNames={formInputClasses}
          />
        </div>
      </Card>

      <Group justify='flex-end' className={classes.footerActions}>
        {footerActions ?? (
          <Button
            className={`${classes.primaryButton} ${confirmButtonClassName ?? ''}`.trim()}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        )}
      </Group>

      <Modal
        opened={columnPickerOpened}
        onClose={closeColumnPicker}
        centered
        zIndex={820}
        size={620}
        title={
          <div className={classes.modalTitleWrap}>
            <Text className={classes.modalTitle}>
              Elegir columnas de la planilla
            </Text>
            <Text className={classes.modalSubtitle}>
              Seleccioná las columnas que aparecerán en la planilla adjunta de la
              intimación.
            </Text>
          </div>
        }
        classNames={{
          overlay: classes.modalOverlay,
          content: classes.columnModalContent,
          header: classes.modalHeader,
          body: classes.columnModalBody,
          close: classes.modalClose
        }}
      >
        <div className={classes.columnPickerGrid}>
          <Card className={classes.columnPickerCard} radius='lg' padding={0}>
            <div className={classes.columnPickerHeader}>Columnas disponibles</div>
            <Stack gap='xs' className={classes.columnPickerList}>
              {availableColumns.map((column) => (
                <div
                  key={column.id}
                  className={`${classes.columnPickerRow} ${selectedAvailableColumnId === column.id ? classes.columnPickerRowSelected : ''}`}
                  onClick={() => selectAvailableColumn(column.id)}
                  role='button'
                  tabIndex={0}
                >
                  <Text className={classes.columnPickerLabel}>
                    {column.label}
                  </Text>
                </div>
              ))}
            </Stack>
          </Card>

          <div className={classes.columnPickerArrows}>
            <ActionIcon
              variant='default'
              size='lg'
              className={classes.columnPickerArrowButton}
              onClick={addSelectedColumn}
              disabled={!selectedAvailableColumnId}
            >
              <IconArrowNarrowRight size={18} />
            </ActionIcon>
            <ActionIcon
              variant='default'
              size='lg'
              className={classes.columnPickerArrowButton}
              onClick={removeSelectedColumn}
              disabled={!selectedVisibleColumnId}
            >
              <IconArrowNarrowLeft size={18} />
            </ActionIcon>
          </div>

          <Card className={classes.columnPickerCard} radius='lg' padding={0}>
            <div className={classes.columnPickerHeader}>Columnas visibles</div>
            <Stack gap='xs' className={classes.columnPickerList}>
              {columnPickerDraft.map((column) => (
                <div
                  key={column.id}
                  className={`${classes.columnPickerRow} ${selectedVisibleColumnId === column.id ? classes.columnPickerRowSelected : ''}`}
                  onClick={() => selectVisibleColumn(column.id)}
                  role='button'
                  tabIndex={0}
                >
                  <Text className={classes.columnPickerLabel}>
                    {column.value}
                  </Text>
                </div>
              ))}
            </Stack>
          </Card>
        </div>

        <Group justify='flex-end' className={classes.columnPickerFooter}>
          <Button
            variant='default'
            className={classes.modalCancelButton}
            onClick={closeColumnPicker}
          >
            Cancelar
          </Button>
          <Button className={classes.primaryButton} onClick={confirmColumnPicker}>
            Aceptar
          </Button>
        </Group>
      </Modal>
    </div>
  )
}
