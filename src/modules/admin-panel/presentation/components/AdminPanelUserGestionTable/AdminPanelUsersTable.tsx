import { Table } from '@mantine/core'
import type { IAdminPanelUser } from '../../../data/models/AdminPanel'
import type { AvatarColorTone } from '../../utils/getAvatarColorStyles'
import classes from '../../styles/AdminPanel.module.css'
import { AdminPanelUserTableRow } from './AdminPanelUserTableRow'
import { AdminPanelUsersEmptyState } from './AdminPanelUsersEmptyState'

export function AdminPanelUsersTable({
  users,
  avatarColorByUserId,
  onEditUser,
  onDeleteUser
}: AdminPanelUsersTableProps) {
  return (
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
          {users.length ? (
            users.map((user) => (
              <AdminPanelUserTableRow
                key={user.id}
                user={user}
                avatarColor={avatarColorByUserId[user.id] ?? 'blue'}
                onEditUser={onEditUser}
                onDeleteUser={onDeleteUser}
              />
            ))
          ) : (
            <AdminPanelUsersEmptyState />
          )}
        </Table.Tbody>
      </Table>
    </div>
  )
}

interface AdminPanelUsersTableProps {
  users: IAdminPanelUser[]
  avatarColorByUserId: Record<string, AvatarColorTone>
  onEditUser: (user: IAdminPanelUser) => void
  onDeleteUser: (user: IAdminPanelUser) => void
}
