import type { ChangeEventHandler } from 'react'
import { PasswordInput, Select, TextInput } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { ADMIN_PANEL_MODAL_INPUT_CLASSES } from '../../constants/adminPanelModalInputClasses'
import classes from '../../styles/AdminPanel.module.css'
import { AdminPanelPasswordStrengthBar } from './AdminPanelPasswordStrengthBar'
import { AdminPanelUserFormLabel } from './AdminPanelUserFormLabel'
import { AdminPanelUserPasswordVisibilityIcon } from './AdminPanelUserPasswordVisibilityIcon'

export function AdminPanelUserFormFields({
  roleOptions,
  defaultValues,
  password,
  passwordStrength,
  passwordColor,
  isPending,
  emailError,
  confirmPasswordError,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange
}: AdminPanelUserFormFieldsProps) {
  return (
    <div className={classes.modalSection}>
      <div className={classes.formRow2}>
        <div className={classes.modalField}>
          <TextInput
            name='nombre'
            label={<AdminPanelUserFormLabel label='Nombre' required />}
            defaultValue={defaultValues.firstName}
            disabled={isPending}
            classNames={ADMIN_PANEL_MODAL_INPUT_CLASSES}
          />
        </div>

        <div className={classes.modalField}>
          <TextInput
            name='apellido'
            label={<AdminPanelUserFormLabel label='Apellido' required />}
            defaultValue={defaultValues.lastName}
            disabled={isPending}
            classNames={ADMIN_PANEL_MODAL_INPUT_CLASSES}
          />
        </div>
      </div>

      <div className={classes.modalField}>
        <TextInput
          mt='md'
          type='email'
          name='correo'
          label={<AdminPanelUserFormLabel label='Email' required />}
          placeholder='Ejemplo@gmail.com'
          defaultValue={defaultValues.email}
          disabled={isPending}
          error={emailError}
          onChange={onEmailChange}
          classNames={{
            ...ADMIN_PANEL_MODAL_INPUT_CLASSES,
            input: `${classes.modalInput} ${
              emailError ? classes.modalInputError : ''
            }`,
            error: classes.modalError
          }}
        />
      </div>

      <div className={classes.modalField}>
        <Select
          mt='md'
          name='cargo'
          label={<AdminPanelUserFormLabel label='Cargo' required />}
          placeholder='Selecciona un cargo ...'
          defaultValue={defaultValues.roleLabel}
          data={roleOptions}
          disabled={isPending}
          rightSection={<IconChevronDown size={18} stroke={1.8} />}
          classNames={ADMIN_PANEL_MODAL_INPUT_CLASSES}
        />
      </div>

      <div className={classes.modalField}>
        <PasswordInput
          mt='md'
          name={password.name}
          label={
            <AdminPanelUserFormLabel
              label={password.label}
              required={password.required}
            />
          }
          disabled={isPending}
          onChange={onPasswordChange}
          visibilityToggleIcon={AdminPanelUserPasswordVisibilityIcon}
          classNames={ADMIN_PANEL_MODAL_INPUT_CLASSES}
        />
      </div>

      <div className={classes.modalField}>
        <PasswordInput
          mt='md'
          name={password.confirmName}
          label={
            <AdminPanelUserFormLabel
              label={password.confirmLabel}
              required={password.confirmRequired}
            />
          }
          disabled={isPending}
          error={confirmPasswordError}
          onChange={onConfirmPasswordChange}
          visibilityToggleIcon={AdminPanelUserPasswordVisibilityIcon}
          classNames={{
            ...ADMIN_PANEL_MODAL_INPUT_CLASSES,
            input: `${classes.modalInput} ${
              confirmPasswordError ? classes.modalInputError : ''
            }`,
            error: classes.modalError
          }}
        />
      </div>

      <AdminPanelPasswordStrengthBar
        passwordStrength={passwordStrength}
        passwordColor={passwordColor}
      />
    </div>
  )
}

export interface AdminPanelUserFormDefaultValues {
  firstName: string
  lastName: string
  email: string
  roleLabel: string
}

interface AdminPanelUserFormFieldsProps {
  roleOptions: string[]
  defaultValues: AdminPanelUserFormDefaultValues
  password: AdminPanelUserFormPasswordConfig
  passwordStrength: number
  passwordColor: string
  isPending: boolean
  emailError: string | null
  confirmPasswordError: string | null
  onEmailChange: () => void
  onPasswordChange: ChangeEventHandler<HTMLInputElement>
  onConfirmPasswordChange: () => void
}

interface AdminPanelUserFormPasswordConfig {
  name: string
  label: string
  required: boolean
  confirmName: string
  confirmLabel: string
  confirmRequired: boolean
}
