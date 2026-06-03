'use client'

import {
  ActionIcon,
  Button,
  Card,
  Group,
  Alert,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconFileText,
  IconInfoCircle,
  IconPlus,
  IconXFilled
} from '@tabler/icons-react'
import { useDashboardConfiguration } from '../../hooks/useDashboardConfiguration'
import classes from './DashboardConfigurationPage.module.css'

const formInputClasses = {
  input: classes.formInput
}

function SectionTitle({
  title,
  description
}: {
  title: string
  description: string
}) {
  return (
    <div className={classes.sectionIntro}>
      <Text component='div' className={classes.pageTitle}>
        {title}
      </Text>
      <Text className={classes.pageSubtitle}>{description}</Text>
    </div>
  )
}

export function DashboardConfigurationPage() {
  const {
    state,
    activeTab,
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnId,
    selectedVisibleColumnId,
    availableColumns,
    visibleColumns,
    successOpened,
    updateTab,
    updateIntimacion,
    updateInforme,
    openColumnPicker,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn,
    updateColumn,
    removeColumn,
    confirmChanges,
    closeSuccess
  } = useDashboardConfiguration()

  const isIntimacion = activeTab === 'intimacion'

  return (
    <div className={classes.page}>
      <div className={classes.shell}>
        <div className={classes.shellRail}>
          <button type='button' className={classes.shellRailItem}>
            <IconFileText size={14} />
            <span>Documentos de salida</span>
          </button>
        </div>

        <div className={classes.shellBody}>
          <section className={classes.headerSection}>
            <SectionTitle
              title='Personalizar documentos de salida'
              description='Editá la estructura de los documentos generados. Los cambios se aplican globalmente al confirmar.'
            />

            <div className={classes.tabsRow}>
              <button
                type='button'
                className={`${classes.tabButton} ${isIntimacion ? classes.tabButtonActive : ''}`}
                onClick={() => updateTab('intimacion')}
              >
                Intimación
              </button>
              <button
                type='button'
                className={`${classes.tabButton} ${!isIntimacion ? classes.tabButtonActive : ''}`}
                onClick={() => updateTab('informe')}
              >
                Informe de análisis
              </button>
            </div>
          </section>

          {isIntimacion ? (
            <div className={classes.contentView}>
              <div className={classes.viewColumn}>
                <Card className={classes.sectionCard} radius='lg' padding={0}>
                  <Text className={classes.sectionLabel}>Asunto</Text>
                  <div className={classes.fieldGroup}>
                    <Text className={classes.fieldTitle}>Texto del asunto</Text>
                    <TextInput
                      value={state.intimacion.asunto}
                      onChange={(event) =>
                        updateIntimacion('asunto', event.currentTarget.value)
                      }
                      classNames={formInputClasses}
                    />
                  </div>
                </Card>

                <Card className={classes.sectionCard} radius='lg' padding={0}>
                  <Text className={classes.sectionLabel}>
                    Cuerpo del documento
                  </Text>
                  <Stack gap='md'>
                    <div className={classes.fieldGroup}>
                      <Text className={classes.fieldTitle}>Saludo</Text>
                      <TextInput
                        value={state.intimacion.saludo}
                        onChange={(event) =>
                          updateIntimacion('saludo', event.currentTarget.value)
                        }
                        classNames={formInputClasses}
                      />
                    </div>

                    <div className={classes.fieldGroup}>
                      <Text className={classes.fieldTitle}>
                        Texto del cuerpo
                      </Text>
                      <Textarea
                        value={state.intimacion.cuerpo}
                        onChange={(event) =>
                          updateIntimacion('cuerpo', event.currentTarget.value)
                        }
                        classNames={formInputClasses}
                      />
                    </div>
                  </Stack>
                </Card>

                <Card className={classes.sectionCard} radius='lg' padding={0}>
                  <Text className={classes.sectionLabel}>
                    Planilla adjunta — Columnas
                  </Text>
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
                      value={state.intimacion.fuenteInformacion}
                      onChange={(event) =>
                        updateIntimacion(
                          'fuenteInformacion',
                          event.currentTarget.value
                        )
                      }
                      placeholder='Ej: Facturación de compras, ARCA, etc.'
                      classNames={formInputClasses}
                    />
                  </div>

                  <div className={classes.fieldGroupFooter}>
                    <Text className={classes.fieldTitle}>Fecha de corte</Text>
                    <TextInput
                      value={state.intimacion.fechaCorte}
                      onChange={(event) =>
                        updateIntimacion(
                          'fechaCorte',
                          event.currentTarget.value
                        )
                      }
                      classNames={formInputClasses}
                    />
                  </div>
                </Card>

                <Group justify='flex-end' className={classes.footerActions}>
                  <Button
                    className={classes.primaryButton}
                    onClick={confirmChanges}
                  >
                    Confirmar cambios
                  </Button>
                </Group>
              </div>
            </div>
          ) : (
            <div className={classes.contentView}>
              <div className={classes.viewColumn}>
                <Alert
                  variant='light'
                  color='blue'
                  radius='md'
                  className={classes.infoAlert}
                  icon={<IconInfoCircle size={16} />}
                >
                  <Text className={classes.infoAlertText}>
                    <strong>Configuración global del Informe de Investigación.</strong>{' '}
                    Solo el título y el texto se editan acá y aplican a todos los
                    usuarios. Los datos del contribuyente, la acción
                    fiscalizadora y los cruces se completan al generar el informe
                    desde el Padrón Unificado.
                  </Text>
                </Alert>

                <Card className={classes.sectionCard} radius='lg' padding={0}>
                  <Text className={classes.sectionLabel}>Título del informe</Text>
                  <div className={classes.fieldGroup}>
                    <Text className={classes.fieldTitle}>Texto del título</Text>
                    <TextInput
                      value={state.informe.titulo}
                      onChange={(event) =>
                        updateInforme('titulo', event.currentTarget.value)
                      }
                      classNames={formInputClasses}
                    />
                  </div>
                </Card>

                <Card className={classes.sectionCard} radius='lg' padding={0}>
                  <Text className={classes.sectionLabel}>Texto introductorio</Text>
                  <div className={classes.fieldGroup}>
                    <Text className={classes.fieldTitle}>Cuerpo del informe</Text>
                    <Textarea
                      value={state.informe.cuerpo}
                      onChange={(event) =>
                        updateInforme('cuerpo', event.currentTarget.value)
                      }
                      minRows={5}
                      classNames={formInputClasses}
                    />
                  </div>
                </Card>

                <Group justify='flex-end' className={classes.footerActions}>
                  <Button
                    className={classes.primaryButton}
                    onClick={confirmChanges}
                  >
                    Confirmar cambios
                  </Button>
                </Group>
              </div>
            </div>
          )}
        </div>
      </div>

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
              Seleccioná las columnas que aparecerán en la planilla adjunta de
              la intimación.
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
            <div className={classes.columnPickerHeader}>
              Columnas disponibles
            </div>
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
          <Button
            className={classes.primaryButton}
            onClick={confirmColumnPicker}
          >
            Aceptar
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={successOpened}
        onClose={closeSuccess}
        centered
        zIndex={800}
        title='Configuración actualizada'
        classNames={{
          overlay: classes.modalOverlay,
          content: classes.modalContent,
          header: classes.modalHeader,
          body: classes.modalBody,
          title: classes.modalTitle,
          close: classes.modalClose
        }}
      >
        <Text className={classes.modalText}>
          Se guardaron los cambios correctamente.
        </Text>
      </Modal>
    </div>
  )
}
