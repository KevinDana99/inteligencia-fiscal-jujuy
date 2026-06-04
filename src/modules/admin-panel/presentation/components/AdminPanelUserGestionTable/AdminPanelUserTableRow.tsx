import { ActionIcon, Avatar, Badge, Table, Text } from '@mantine/core'
import { IconCrown, IconEdit, IconTrash } from '@tabler/icons-react'
import type { IAdminPanelUser } from '../../../data/models/AdminPanel'
import { useAdminPanelUserRow } from '../../hooks'
import type { AvatarColorTone } from '../../utils/getAvatarColorStyles'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelUserTableRow({
  user,
  avatarColor,
  onEditUser,
  onDeleteUser
}: AdminPanelUserTableRowProps) {
  const {
    avatarInitials,
    avatarStyle,
    roleBadgeRootClassName,
    showActions,
    handleEditUser,
    handleDeleteUser
  } = useAdminPanelUserRow({
    user,
    avatarColor,
    onEditUser,
    onDeleteUser
  })

  return (
    <Table.Tr>
      <Table.Td>
        <div className={classes.userCell}>
          <Avatar
            radius='xl'
            size={36}
            style={avatarStyle}
            className={classes.userAvatar}
          >
            {avatarInitials}
          </Avatar>
          {user.isAdmin ? (
            <IconCrown
              size={22}
              stroke={1.9}
              fill='currentColor'
              className={classes.adminCrown}
            />
          ) : null}
          <div className={classes.userNameWrap}>
            <Text className={classes.userName}>{user.fullName}</Text>
          </div>
        </div>
      </Table.Td>
      <Table.Td>
        <Text className={classes.emailCell}>{user.email}</Text>
      </Table.Td>
      <Table.Td>
        <Badge
          color='blue'
          radius='xl'
          variant={user.isAdmin ? 'filled' : 'light'}
          classNames={{
            root: roleBadgeRootClassName,
            label: classes.roleBadgeLabel
          }}
        >
          {user.roleLabel}
        </Badge>
      </Table.Td>
      <Table.Td>
        {showActions ? (
          <div className={classes.actions}>
            <ActionIcon
              variant='light'
              color='indigo'
              radius='md'
              className={`${classes.actionButton} ${classes.editAction}`}
              onClick={handleEditUser}
            >
              <IconEdit size={17} />
            </ActionIcon>
            <ActionIcon
              variant='light'
              color='red'
              radius='md'
              className={`${classes.actionButton} ${classes.deleteAction}`}
              onClick={handleDeleteUser}
            >
              <IconTrash size={17} />
            </ActionIcon>
          </div>
        ) : null}
      </Table.Td>
    </Table.Tr>
  )
}

interface AdminPanelUserTableRowProps {
  user: IAdminPanelUser
  avatarColor: AvatarColorTone
  onEditUser: (user: IAdminPanelUser) => void
  onDeleteUser: (user: IAdminPanelUser) => void
}
