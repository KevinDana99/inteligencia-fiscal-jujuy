import { Stack, Text, Title } from '@mantine/core';
import type {
  IAdminPanelCreateUserInput,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../../data/models/AdminPanel';
import type { AvatarColorTone } from '../../utils/getAvatarColorStyles';
import { AdminPanelModals } from '../AdminPanelModals';
import { AdminPanelUserGestionTable } from '../AdminPanelUserGestionTable';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelHomeSection({
  activeUsersCount,
  filteredUsers,
  avatarColorByUserId,
  actionError,
  isActionPending,
  formattedDate,
  selectedUser,
  createOpened,
  editOpened,
  deleteOpened,
  roleOptions,
  searchValue,
  setSearchValue,
  openCreateModal,
  openEditModal,
  openDeleteModal,
  closeCreateModal,
  closeEditModal,
  closeDeleteModal,
  createUser,
  updateUser,
  deleteUser
}: {
  activeUsersCount: number;
  filteredUsers: IAdminPanelUser[];
  avatarColorByUserId: Record<string, AvatarColorTone>;
  actionError: string | null;
  isActionPending: boolean;
  formattedDate: string;
  selectedUser: IAdminPanelUser | null;
  createOpened: boolean;
  editOpened: boolean;
  deleteOpened: boolean;
  roleOptions: string[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  openCreateModal: () => void;
  openEditModal: (user: IAdminPanelUser) => void;
  openDeleteModal: (user: IAdminPanelUser) => void;
  closeCreateModal: () => void;
  closeEditModal: () => void;
  closeDeleteModal: () => void;
  createUser: (input: IAdminPanelCreateUserInput) => Promise<boolean>;
  updateUser: (input: IAdminPanelUpdateUserInput) => Promise<boolean>;
  deleteUser: () => Promise<boolean>;
}) {
  return (
    <>
      <Stack gap="xl">
        <Stack gap={8} className={classes.widgetTitleBlock}>
          <Title order={1} className={classes.heroTitle}>
            Bienvenido, Administrador 👋
          </Title>
          <Text className={classes.heroDate}>{formattedDate}</Text>
        </Stack>

        <AdminPanelUserGestionTable
          activeUsersCount={activeUsersCount}
          filteredUsers={filteredUsers}
          avatarColorByUserId={avatarColorByUserId}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          openCreateModal={openCreateModal}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </Stack>

      <AdminPanelModals
        selectedUser={selectedUser}
        createOpened={createOpened}
        editOpened={editOpened}
        deleteOpened={deleteOpened}
        actionError={actionError}
        isActionPending={isActionPending}
        roleOptions={roleOptions}
        closeCreateModal={closeCreateModal}
        closeEditModal={closeEditModal}
        closeDeleteModal={closeDeleteModal}
        createUser={createUser}
        updateUser={updateUser}
        deleteUser={deleteUser}
      />
    </>
  );
}
