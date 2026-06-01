'use client'

import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useFormStatus } from 'react-dom'
import {
  IconCheck,
  IconChevronDown,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react'
import classes from '../AdminPanelShell/AdminPanelShell.module.css'
import { useCreateAdminUserFormModal } from '../../hooks/useCreateAdminUserFormModal'

const modalInputClasses = {
  label: classes.modalLabel,
  input: classes.modalInput,
  section: classes.modalInputSection,
  dropdown: classes.modalDropdown,
  option: classes.modalOption
}

function CreateUserFormModal({
  opened,
  title,
  subtitle,
  submitLabel,
  roleOptions,
  onClose
}: {
  opened: boolean
  title: string
  subtitle: string
  submitLabel: string
  roleOptions: string[]
  onClose: () => void
}) {
  const {
    formRef,
    passwordStrength,
    passwordColor,
    isPending,
    error,
    formAction,
    handlePasswordChange
  } = useCreateAdminUserFormModal(onClose)

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Stack gap='xs'>
          <Title order={3} className={classes.modalTitle}>
            {title}
          </Title>
          <Text className={classes.modalSubtitle}>{subtitle}</Text>
        </Stack>
      }
      centered
      classNames={{
        header: classes.modalHeader,
        content: classes.modalContent,
        body: classes.modalBody,
        overlay: classes.modalOverlay
      }}
    >
      <form ref={formRef} action={formAction}>
        <div className={classes.modalSection}>
          <div className={classes.formRow2}>
            <div className={classes.modalField}>
              <TextInput
                name='nombre'
                label={
                  <span className={classes.modalLabel}>
                    Nombre<span className={classes.modalRequired}>*</span>
                  </span>
                }
                disabled={isPending}
                classNames={modalInputClasses}
              />
            </div>

            <div className={classes.modalField}>
              <TextInput
                name='apellido'
                label={
                  <span className={classes.modalLabel}>
                    Apellido<span className={classes.modalRequired}>*</span>
                  </span>
                }
                disabled={isPending}
                classNames={modalInputClasses}
              />
            </div>
          </div>

          <div className={classes.modalField}>
            <TextInput
              mt='md'
              type='email'
              name='correo'
              label={
                <span className={classes.modalLabel}>
                  Email<span className={classes.modalRequired}>*</span>
                </span>
              }
              placeholder='Ejemplo@gmail.com'
              disabled={isPending}
              classNames={modalInputClasses}
            />
          </div>

          <div className={classes.modalField}>
            <Select
              mt='md'
              name='cargo'
              label={
                <span className={classes.modalLabel}>
                  Cargo<span className={classes.modalRequired}>*</span>
                </span>
              }
              placeholder='Selecciona un cargo ...'
              defaultValue={roleOptions[0] ?? ''}
              data={roleOptions}
              disabled={isPending}
              rightSection={<IconChevronDown size={18} stroke={1.8} />}
              classNames={modalInputClasses}
            />
          </div>

          <div className={classes.modalField}>
            <PasswordInput
              mt='md'
              name='contrasena'
              label={
                <span className={classes.modalLabel}>
                  Contraseña<span className={classes.modalRequired}>*</span>
                </span>
              }
              placeholder='**********'
              onChange={(event) =>
                handlePasswordChange(event.currentTarget.value)
              }
              disabled={isPending}
              visibilityToggleIcon={({ reveal }) =>
                reveal ? (
                  <IconEyeOff size={18} stroke={1.8} />
                ) : (
                  <IconEye size={18} stroke={1.8} />
                )
              }
              classNames={modalInputClasses}
            />
          </div>

          <div className={classes.passwordStrengthRoot}>
            <div
              className={classes.passwordStrengthBar}
              style={{
                width: `${passwordStrength * 20}%`,
                background: `var(--mantine-color-${passwordColor}-${passwordColor === 'teal' ? 6 : 5})`
              }}
            />
          </div>
        </div>

        <div className={classes.modalFooter}>
          <Group justify='flex-end' gap={10}>
            <Button
              variant='default'
              size='sm'
              type='button'
              disabled={isPending}
              onClick={onClose}
              className={classes.modalCancelButton}
            >
              Cancelar
            </Button>
            <CreateUserSubmitButton label={submitLabel} />
          </Group>
          {error ? <Text className={classes.modalError}>{error}</Text> : null}
        </div>
      </form>
    </Modal>
  )
}

export default CreateUserFormModal

function CreateUserSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      size='sm'
      leftSection={<IconCheck size={16} />}
      loading={pending}
      disabled={pending}
      className={classes.primaryButton}
    >
      {label}
    </Button>
  )
}
