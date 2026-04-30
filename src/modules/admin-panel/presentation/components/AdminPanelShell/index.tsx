'use client';

import type { IAdminPanelData } from '../../../data/models/AdminPanel';
import { AdminPanelHomeSection } from '../AdminPanelHomeSection';
import { AdminPanelTemplate } from '../AdminPanelTemplate';
import { useAdminPanelShell } from '../../hooks';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';

export default function AdminPanelShell({
  data,
  session,
  formattedDate
}: {
  data: IAdminPanelData;
  session: IAuthSession;
  formattedDate: string;
}) {
  const {
    searchValue,
    activeUsersCount,
    filteredUsers,
    avatarColorByUserId,
    actionError,
    isActionPending,
    selectedUser,
    createOpened,
    editOpened,
    deleteOpened,
    roleOptions,
    setSearchValue,
    createUser,
    updateUser,
    deleteUser,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal
  } = useAdminPanelShell(data);

  return (
    <AdminPanelTemplate session={session} currentSection="dashboard">
      <AdminPanelHomeSection
        activeUsersCount={activeUsersCount}
        filteredUsers={filteredUsers}
        avatarColorByUserId={avatarColorByUserId}
        actionError={actionError}
        isActionPending={isActionPending}
        formattedDate={formattedDate}
        selectedUser={selectedUser}
        createOpened={createOpened}
        editOpened={editOpened}
        deleteOpened={deleteOpened}
        roleOptions={roleOptions}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        openCreateModal={openCreateModal}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        closeCreateModal={closeCreateModal}
        closeEditModal={closeEditModal}
        closeDeleteModal={closeDeleteModal}
        createUser={createUser}
        updateUser={updateUser}
        deleteUser={deleteUser}
      />
    </AdminPanelTemplate>
  );
}
