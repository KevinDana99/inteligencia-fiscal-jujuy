import { Button, Group, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { useFormStatus } from 'react-dom'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelUserFormFooter({
  submitLabel,
  error,
  isPending,
  onClose
}: AdminPanelUserFormFooterProps) {
  return (
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
        <AdminPanelUserSubmitButton label={submitLabel} />
      </Group>
      {error ? <Text className={classes.modalError}>{error}</Text> : null}
    </div>
  )
}

function AdminPanelUserSubmitButton({ label }: AdminPanelUserSubmitButtonProps) {
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

interface AdminPanelUserFormFooterProps {
  submitLabel: string
  error: string | null
  isPending: boolean
  onClose: () => void
}

interface AdminPanelUserSubmitButtonProps {
  label: string
}
