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
import {
  IconCheck,
  IconChevronDown,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react'
import type {
  IAdminPanelCreateUserInput,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../../data/models/AdminPanel'
import classes from '../AdminPanelShell/AdminPanelShell.module.css'
import useAdminFormModal from '../../hooks/useAdminFormModal'

const modalInputClasses = {
  label: classes.modalLabel,
  input: classes.modalInput,
  section: classes.modalInputSection,
  dropdown: classes.modalDropdown,
  option: classes.modalOption
}

const modalErrorInputClasses = {
  ...modalInputClasses,
  input: `${classes.modalInput} ${classes.modalInputError}`
}

function UserFormModal({
  opened,
  title,
  subtitle,
  submitLabel,
  initialUser,
  roleOptions,
  onClose,
  onSubmit,
  error,
  isPending = false
}: {
  opened: boolean
  title: string
  subtitle: string
  submitLabel: string
  initialUser?: IAdminPanelUser | null
  roleOptions: string[]
  onClose: () => void
  onSubmit: (
    payload: IAdminPanelCreateUserInput | IAdminPanelUpdateUserInput
  ) => Promise<boolean>
  error?: string | null
  isPending?: boolean
}) {
  const {
    errors,
    passwordColor,
    email,
    lastName,
    firstName,
    roleLabel,
    passwordStrength,
    password,
    handleSubmit,
    setEmail,
    setFirstName,
    setLastName,
    setPassword,
    setRoleLabel
  } = useAdminFormModal(onSubmit, roleOptions, initialUser)

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
      <div className={classes.modalSection}>
        <div className={classes.formRow2}>
          <div className={classes.modalField}>
            <TextInput
              label={
                <span className={classes.modalLabel}>
                  Nombre<span className={classes.modalRequired}>*</span>
                </span>
              }
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
              classNames={
                errors.firstName ? modalErrorInputClasses : modalInputClasses
              }
            />
            {errors.firstName ? (
              <Text className={classes.modalError}>{errors.firstName}</Text>
            ) : null}
          </div>

          <div className={classes.modalField}>
            <TextInput
              label={
                <span className={classes.modalLabel}>
                  Apellido<span className={classes.modalRequired}>*</span>
                </span>
              }
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              classNames={
                errors.lastName ? modalErrorInputClasses : modalInputClasses
              }
            />
            {errors.lastName ? (
              <Text className={classes.modalError}>{errors.lastName}</Text>
            ) : null}
          </div>
        </div>

        <div className={classes.modalField}>
          <TextInput
            mt='md'
            type='email'
            label={
              <span className={classes.modalLabel}>
                Email<span className={classes.modalRequired}>*</span>
              </span>
            }
            placeholder='Ejemplo@gmail.com'
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            classNames={
              errors.email ? modalErrorInputClasses : modalInputClasses
            }
          />
          {errors.email ? (
            <Text className={classes.modalError}>{errors.email}</Text>
          ) : null}
        </div>

        <div className={classes.modalField}>
          <Select
            mt='md'
            label={
              <span className={classes.modalLabel}>
                Cargo<span className={classes.modalRequired}>*</span>
              </span>
            }
            placeholder='Selecciona un cargo ...'
            value={roleLabel}
            data={roleOptions}
            onChange={(value) => setRoleLabel(value ?? '')}
            rightSection={<IconChevronDown size={18} stroke={1.8} />}
            classNames={
              errors.roleLabel ? modalErrorInputClasses : modalInputClasses
            }
          />
          {errors.roleLabel ? (
            <Text className={classes.modalError}>{errors.roleLabel}</Text>
          ) : null}
        </div>

        <div className={classes.modalField}>
          <PasswordInput
            mt='md'
            label={
              <span className={classes.modalLabel}>
                Contraseña<span className={classes.modalRequired}>*</span>
              </span>
            }
            placeholder='**********'
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            visibilityToggleIcon={({ reveal }) =>
              reveal ? (
                <IconEyeOff size={18} stroke={1.8} />
              ) : (
                <IconEye size={18} stroke={1.8} />
              )
            }
            classNames={
              errors.password ? modalErrorInputClasses : modalInputClasses
            }
          />
          {errors.password ? (
            <Text className={classes.modalError}>{errors.password}</Text>
          ) : null}
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
            onClick={onClose}
            className={classes.modalCancelButton}
          >
            Cancelar
          </Button>
          <Button
            size='sm'
            onClick={handleSubmit}
            leftSection={<IconCheck size={16} />}
            loading={isPending}
            className={classes.primaryButton}
          >
            {submitLabel}
          </Button>
        </Group>
        {error ? <Text className={classes.modalError}>{error}</Text> : null}
      </div>
    </Modal>
  )
}

export default UserFormModal
