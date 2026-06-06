'use client'

import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Textarea
} from '@mantine/core'
import {
  IconAlertTriangle,
  IconCheck,
} from '@tabler/icons-react'
import {
  useSendToReprocessingModal,
  type ISendToReprocessingModalProps
} from './useSendToReprocessingModal'
import classes from './SendToReprocessingModal.module.css'

export function SendToReprocessingModal(
  props: ISendToReprocessingModalProps
) {
  const {
    description,
    isSubmitting,
    subtitle,
    setDescription,
    handleClose,
    handleConfirm
  } = useSendToReprocessingModal(props)

  return (
    <Modal
      opened={props.opened}
      onClose={handleClose}
      centered
      withCloseButton
      title={
        <Stack className={classes.headerStack}>
          <div className={classes.titleRow}>
            <span className={classes.statusBadge}>
              <span className={classes.statusDot} />
              En Reproceso
            </span>
            <Text className={classes.title}>Agregar descripción</Text>
          </div>
          <Text className={classes.subtitle}>{subtitle}</Text>
        </Stack>
      }
      classNames={{
        content: classes.modalContent,
        overlay: classes.modalOverlay,
        header: classes.modalHeader,
        body: classes.modalBody,
        close: classes.modalCloseButton
      }}
    >
      <div className={classes.fieldGroup}>
        <Text component='label' className={classes.fieldLabel}>
          Motivo / Descripción <span className={classes.optionalLabel}>(opcional)</span>
        </Text>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          placeholder='Ej: Pendiente revisión de coeficientes, desvío detectado en período 2024...'
          autosize
          minRows={3}
          classNames={{ input: classes.textarea }}
        />
        <Text className={classes.fieldHint}>
          Esta descripción aparecerá en la pantalla de Reproceso.
        </Text>
      </div>

      <div className={classes.alertBox}>
        <IconAlertTriangle size={16} className={classes.alertIcon} />
        <Text className={classes.alertText}>
          <span className={classes.alertTextLine}>
            El CUIT quedará marcado como pendiente de investigación
          </span>
          <span className={classes.alertTextLine}>profunda.</span>
        </Text>
      </div>

      <Group justify='flex-end' gap={8} className={classes.modalFooter}>
        <Button
          variant='default'
          className={classes.cancelButton}
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          className={classes.confirmButton}
          onClick={() => {
            void handleConfirm()
          }}
          loading={isSubmitting}
          leftSection={<IconCheck size={13} />}
        >
          Confirmar reproceso
        </Button>
      </Group>
    </Modal>
  )
}

export type { ISendToReprocessingModalProps } from './useSendToReprocessingModal'
