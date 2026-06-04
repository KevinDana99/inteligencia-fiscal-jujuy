import type { RefObject } from 'react'
import { Card, Divider, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconMail } from '@tabler/icons-react'
import type { IAdminAllowedDomains } from '../../../data/models/AdminPanel'
import classes from '../../styles/AdminPanel.module.css'
import { AdminPanelAllowedDomainForm } from './AdminPanelAllowedDomainForm'
import { AdminPanelAllowedDomainItem } from './AdminPanelAllowedDomainItem'

export function AdminPanelAllowedDomainsCard({
  domains,
  domainError,
  formRef,
  formAction,
  isPending,
  onRemoveDomain,
  onChangeDomain,
  onAddDomainSubmit
}: AdminPanelAllowedDomainsCardProps) {
  return (
    <Card className={classes.configCard} radius='md' padding={24}>
      <Stack gap='md'>
        <Group gap='sm' align='center'>
          <ThemeIcon
            variant='transparent'
            color='blue.5'
            radius={8}
            size={32}
            className={classes.configHeaderIcon}
          >
            <IconMail size={16} />
          </ThemeIcon>

          <Stack gap={0}>
            <Title order={5} className={classes.configCardTitle}>
              Dominios de email permitidos
            </Title>
            <Text className={classes.configCardSubtitle}>
              Solo los emails con estos dominios podrán registrarse en el
              sistema
            </Text>
          </Stack>
        </Group>

        <Divider className={classes.configDivider} />

        <Stack gap='sm'>
          {domains.map((domain) => (
            <AdminPanelAllowedDomainItem
              key={domain.id}
              domain={domain}
              isPending={isPending}
              onRemoveDomain={onRemoveDomain}
            />
          ))}

          <AdminPanelAllowedDomainForm
            formRef={formRef}
            formAction={formAction}
            domainError={domainError}
            isPending={isPending}
            onChangeDomain={onChangeDomain}
            onAddDomainSubmit={onAddDomainSubmit}
          />
        </Stack>
      </Stack>
    </Card>
  )
}

interface AdminPanelAllowedDomainsCardProps {
  domains: IAdminAllowedDomains
  domainError: string | null
  formRef: RefObject<HTMLFormElement | null>
  formAction: (payload: FormData) => void
  isPending: boolean
  onRemoveDomain: (domainId: number) => void
  onChangeDomain: () => void
  onAddDomainSubmit: () => void
}
