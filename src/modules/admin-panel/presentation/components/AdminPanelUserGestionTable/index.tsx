import { Stack } from '@mantine/core'
import type { IAdminPanelUser } from '../../../data/models/AdminPanel'
import type { AvatarColorTone } from '../../utils/getAvatarColorStyles'
import { AdminPanelUsersHeader } from './AdminPanelUsersHeader'
import { AdminPanelUsersTable } from './AdminPanelUsersTable'
import { AdminPanelUsersToolbar } from './AdminPanelUsersToolbar'

export function AdminPanelUserGestionTable({
  activeUsersCount,
  filteredUsers,
  avatarColorByUserId,
  searchValue,
  setSearchValue,
  openCreateModal,
  openEditModal,
  openDeleteModal
}: AdminPanelUserGestionTableProps) {
  return (
    <Stack gap='lg'>
      <AdminPanelUsersHeader />

      <AdminPanelUsersToolbar
        activeUsersCount={activeUsersCount}
        filteredUsersCount={filteredUsers.length}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onCreateUser={openCreateModal}
      />

      <AdminPanelUsersTable
        users={filteredUsers}
        avatarColorByUserId={avatarColorByUserId}
        onEditUser={openEditModal}
        onDeleteUser={openDeleteModal}
      />
    </Stack>
  )
}

interface AdminPanelUserGestionTableProps {
  activeUsersCount: number
  filteredUsers: IAdminPanelUser[]
  avatarColorByUserId: Record<string, AvatarColorTone>
  searchValue: string
  setSearchValue: (value: string) => void
  openCreateModal: () => void
  openEditModal: (user: IAdminPanelUser) => void
  openDeleteModal: (user: IAdminPanelUser) => void
}
