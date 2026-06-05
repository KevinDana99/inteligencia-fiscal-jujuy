'use client'

import {
  Alert,
  Button,
  Card,
  Group,
  Modal,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import {
  IconFileText,
  IconInfoCircle,
} from '@tabler/icons-react'
import {
  IntimationTemplate
} from '../IntimationTemplate'
import { useIntimationTemplate } from '../IntimationTemplate/useIntimationTemplate'
import { useDashboardConfiguration } from '../../hooks/useDashboardConfiguration'
import classes from './DashboardConfigurationPage.module.css'

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
  const intimacionTemplate = useIntimationTemplate()
  const {
    state,
    informe,
    activeTab,
    successOpened,
    updateTab,
    updateInforme,
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
                <IntimationTemplate
                  controller={intimacionTemplate}
                  onConfirm={confirmChanges}
                />
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
                      value={informe.titulo}
                      onChange={(event) =>
                        updateInforme('titulo', event.currentTarget.value)
                      }
                      classNames={{ input: classes.formInput }}
                    />
                  </div>
                </Card>

                <Card className={classes.sectionCard} radius='lg' padding={0}>
                  <Text className={classes.sectionLabel}>Texto introductorio</Text>
                  <div className={classes.fieldGroup}>
                    <Text className={classes.fieldTitle}>Cuerpo del informe</Text>
                    <Textarea
                      value={informe.cuerpo}
                      onChange={(event) =>
                        updateInforme('cuerpo', event.currentTarget.value)
                      }
                      minRows={5}
                      classNames={{ input: classes.formInput }}
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
