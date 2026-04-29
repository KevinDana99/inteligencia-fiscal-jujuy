import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Stack,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import {
  IconCrown,
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash
} from '@tabler/icons-react'
import type { IAdminPanelUser } from '../../../data/models/AdminPanel'
import {
  getAvatarColorStyles,
  type AvatarColorTone
} from '../../utils/getAvatarColorStyles'
import { getInitials } from '../../utils/getInitials'
import classes from '../AdminPanelShell/AdminPanelShell.module.css'

export function AdminPanelUserGestionTable({
  activeUsersCount,
  filteredUsers,
  avatarColorByUserId,
  searchValue,
  setSearchValue,
  openCreateModal,
  openEditModal,
  openDeleteModal
}: {
  activeUsersCount: number
  filteredUsers: IAdminPanelUser[]
  avatarColorByUserId: Record<string, AvatarColorTone>
  searchValue: string
  setSearchValue: (value: string) => void
  openCreateModal: () => void
  openEditModal: (user: IAdminPanelUser) => void
  openDeleteModal: (user: IAdminPanelUser) => void
}) {
  return (
    <Stack gap='lg'>
      <div className={classes.panelHeader}>
        <Stack gap={4}>
          <Title order={2} className={classes.sectionTitle}>
            Gestión de usuarios
          </Title>
          <Text className={classes.panelSubtitle}>
            Administrá las cuentas del sistema
          </Text>
        </Stack>

        <Button
          leftSection={<IconPlus size={18} />}
          radius='xl'
          size='sm'
          onClick={openCreateModal}
          className={classes.primaryButton}
        >
          Nuevo usuario
        </Button>
      </div>

      <div className={classes.searchRow}>
        <TextInput
          leftSection={<IconSearch size={16} />}
          placeholder={`Buscar entre ${activeUsersCount} usuarios...`}
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          className={classes.searchInput}
        />
        <Text className={classes.searchCounter}>
          {filteredUsers.length} usuarios activos
        </Text>
      </div>

      <div className={classes.tableWrap}>
        <Table
          highlightOnHover
          withTableBorder={false}
          withColumnBorders={false}
          withRowBorders
          verticalSpacing='md'
          horizontalSpacing='lg'
          className={classes.table}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Usuario</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Cargo</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredUsers.length ? (
              filteredUsers.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <div className={classes.userCell}>
                      <Avatar
                        radius='xl'
                        size={36}
                        style={getAvatarColorStyles(
                          avatarColorByUserId[user.id] ?? 'blue',
                          user.isAdmin ? 5 : 6
                        )}
                        className={classes.userAvatar}
                      >
                        {getInitials(user.fullName)}
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
                        root: user.isAdmin ? classes.roleBadgeAdmin : classes.roleBadge,
                        label: classes.roleBadgeLabel
                      }}
                    >
                      {user.roleLabel}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {user.isAdmin ? null : (
                      <div className={classes.actions}>
                        <ActionIcon
                          variant='light'
                          color='indigo'
                          radius='md'
                          className={`${classes.actionButton} ${classes.editAction}`}
                          onClick={() => openEditModal(user)}
                        >
                          <IconEdit size={17} />
                        </ActionIcon>
                        <ActionIcon
                          variant='light'
                          color='red'
                          radius='md'
                          className={`${classes.actionButton} ${classes.deleteAction}`}
                          onClick={() => openDeleteModal(user)}
                        >
                          <IconTrash size={17} />
                        </ActionIcon>
                      </div>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text className={classes.emptyState}>
                    No hay usuarios que coincidan con la búsqueda actual.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </Stack>
  )
}
