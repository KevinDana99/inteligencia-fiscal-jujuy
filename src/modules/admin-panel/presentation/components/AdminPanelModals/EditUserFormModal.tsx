'use client'

import type { IAdminPanelUser } from '../../../data/models/AdminPanel'
import { ADMIN_PANEL_EDIT_USER_PASSWORD_CONFIG } from '../../constants/adminPanelUserForm'
import { useEditAdminUserFormModal } from '../../hooks/useEditAdminUserFormModal'
import { AdminPanelUserFormFields } from './AdminPanelUserFormFields'
import { AdminPanelUserFormFooter } from './AdminPanelUserFormFooter'
import { AdminPanelUserFormModalFrame } from './AdminPanelUserFormModalFrame'

function EditUserFormModal({
  opened,
  title,
  subtitle,
  submitLabel,
  initialUser,
  roleOptions,
  onClose
}: EditUserFormModalProps) {
  const {
    formRef,
    passwordStrength,
    passwordColor,
    isPending,
    emailError,
    confirmPasswordError,
    error,
    formAction,
    defaultValues,
    handleEmailChange,
    handleSubmitCapture,
    handlePasswordChange,
    handleConfirmPasswordChange
  } = useEditAdminUserFormModal(onClose, initialUser, roleOptions)

  return (
    <AdminPanelUserFormModalFrame
      opened={opened}
      title={title}
      subtitle={subtitle}
      onClose={onClose}
    >
      <form
        ref={formRef}
        action={formAction}
        onSubmitCapture={handleSubmitCapture}
      >
        <input type='hidden' name='usuarioId' value={initialUser?.id ?? ''} />

        <AdminPanelUserFormFields
          roleOptions={roleOptions}
          defaultValues={defaultValues}
          password={ADMIN_PANEL_EDIT_USER_PASSWORD_CONFIG}
          passwordStrength={passwordStrength}
          passwordColor={passwordColor}
          isPending={isPending}
          emailError={emailError}
          confirmPasswordError={confirmPasswordError}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onConfirmPasswordChange={handleConfirmPasswordChange}
        />

        <AdminPanelUserFormFooter
          submitLabel={submitLabel}
          error={error}
          isPending={isPending}
          onClose={onClose}
        />
      </form>
    </AdminPanelUserFormModalFrame>
  )
}

export default EditUserFormModal

interface EditUserFormModalProps {
  opened: boolean
  title: string
  subtitle: string
  submitLabel: string
  initialUser?: IAdminPanelUser | null
  roleOptions: string[]
  onClose: () => void
}
