import { ActionIcon, Group, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import type { IAdminAllowedDomain } from '../../../data/models/AdminPanel'
import { useAdminPanelAllowedDomainItem } from '../../hooks'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelAllowedDomainItem({
  domain,
  isPending,
  onRemoveDomain
}: AdminPanelAllowedDomainItemProps) {
  const { handleRemoveDomain } = useAdminPanelAllowedDomainItem({
    domainId: domain.id,
    onRemoveDomain
  })

  return (
    <div className={classes.configDomainItem}>
      <Group gap='sm'>
        <span className={classes.configDomainPoint} />
        <Text className={classes.configDomainText}>{domain.domain}</Text>
      </Group>

      <ActionIcon
        variant='subtle'
        color='red'
        disabled={isPending}
        onClick={handleRemoveDomain}
        aria-label={`Eliminar dominio ${domain.domain}`}
        className={classes.configDeleteButton}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </div>
  )
}

interface AdminPanelAllowedDomainItemProps {
  domain: IAdminAllowedDomain
  isPending: boolean
  onRemoveDomain: (domainId: number) => void
}
