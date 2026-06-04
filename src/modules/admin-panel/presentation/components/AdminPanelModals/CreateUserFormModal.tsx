'use client'

import { ADMIN_PANEL_CREATE_USER_PASSWORD_CONFIG } from '../../constants/adminPanelUserForm'
import { useCreateAdminUserFormModal } from '../../hooks/useCreateAdminUserFormModal'
import { AdminPanelUserFormFields } from './AdminPanelUserFormFields'
import { AdminPanelUserFormFooter } from './AdminPanelUserFormFooter'
import { AdminPanelUserFormModalFrame } from './AdminPanelUserFormModalFrame'

function CreateUserFormModal({
  opened,
  title,
  subtitle,
  submitLabel,
  roleOptions,
  onClose
}: CreateUserFormModalProps) {
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
    handleConfirmPasswordChange,
    handleSubmitCapture,
    handlePasswordChange
  } = useCreateAdminUserFormModal(onClose, roleOptions)

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
        <AdminPanelUserFormFields
          roleOptions={roleOptions}
          defaultValues={defaultValues}
          password={ADMIN_PANEL_CREATE_USER_PASSWORD_CONFIG}
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

export default CreateUserFormModal

interface CreateUserFormModalProps {
  opened: boolean
  title: string
  subtitle: string
  submitLabel: string
  roleOptions: string[]
  onClose: () => void
}
