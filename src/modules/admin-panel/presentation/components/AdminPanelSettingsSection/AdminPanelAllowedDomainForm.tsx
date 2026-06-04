import type { RefObject } from 'react'
import { Button, Group, Stack, Text, TextInput } from '@mantine/core'
import { IconMail, IconPlus } from '@tabler/icons-react'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelAllowedDomainForm({
  formRef,
  formAction,
  domainError,
  isPending,
  onChangeDomain,
  onAddDomainSubmit
}: AdminPanelAllowedDomainFormProps) {
  return (
    <Stack gap='xs'>
      <Text className={classes.configSectionLabel}>Agregar nuevo dominio</Text>

      <form
        ref={formRef}
        action={formAction}
        onSubmitCapture={onAddDomainSubmit}
      >
        <Group gap='sm' align='flex-start'>
          <div className={classes.configDomainField}>
            <TextInput
              name='dominio'
              placeholder='ejemplo.gob.ar'
              disabled={isPending}
              onChange={onChangeDomain}
              leftSection={<IconMail size={16} />}
              className={classes.configDomainInput}
              classNames={{
                input: `${classes.modalInput} ${domainError ? classes.modalInputError : ''}`,
                section: classes.modalInputSection
              }}
            />
            <Text className={classes.configDomainError}>
              {domainError ?? ''}
            </Text>
          </div>

          <Button
            type='submit'
            disabled={isPending}
            loading={isPending}
            leftSection={<IconPlus size={15} />}
            className={classes.configAddButton}
            radius='xl'
          >
            Agregar
          </Button>
        </Group>
      </form>
    </Stack>
  )
}

interface AdminPanelAllowedDomainFormProps {
  formRef: RefObject<HTMLFormElement | null>
  formAction: (payload: FormData) => void
  domainError: string | null
  isPending: boolean
  onChangeDomain: () => void
  onAddDomainSubmit: () => void
}
