import { Stack, Text, Title } from '@mantine/core';
import type {
  IAdminPanelCreateUserInput,
  IAdminPanelMetrics,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../../data/models/AdminPanel';
import { AdminPanelModals } from '../AdminPanelModals';
import { AdminPanelUserGestionTable } from '../AdminPanelUserGestionTable';
import { AdminPanelWidgetsSection } from '../AdminPanelWidgetsSection';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelHomeSection({
  metrics,
  activeUsersCount,
  filteredUsers,
  selectedUser,
  createOpened,
  editOpened,
  passwordOpened,
  deleteOpened,
  roleOptions,
  searchValue,
  setSearchValue,
  openCreateModal,
  openEditModal,
  openPasswordModal,
  openDeleteModal,
  closeCreateModal,
  closeEditModal,
  closePasswordModal,
  closeDeleteModal,
  createUser,
  updateUser,
  registerPasswordChange,
  deleteUser
}: {
  metrics: IAdminPanelMetrics;
  activeUsersCount: number;
  filteredUsers: IAdminPanelUser[];
  selectedUser: IAdminPanelUser | null;
  createOpened: boolean;
  editOpened: boolean;
  passwordOpened: boolean;
  deleteOpened: boolean;
  roleOptions: string[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  openCreateModal: () => void;
  openEditModal: (user: IAdminPanelUser) => void;
  openPasswordModal: (user: IAdminPanelUser) => void;
  openDeleteModal: (user: IAdminPanelUser) => void;
  closeCreateModal: () => void;
  closeEditModal: () => void;
  closePasswordModal: () => void;
  closeDeleteModal: () => void;
  createUser: (input: IAdminPanelCreateUserInput) => void;
  updateUser: (input: IAdminPanelUpdateUserInput) => void;
  registerPasswordChange: () => void;
  deleteUser: () => void;
}) {
  return (
    <>
      <Stack gap={28}>
        <Stack gap={6}>
          <Title order={1} className={classes.heroTitle}>
            Bienvenido, Administrador 👋
          </Title>
          <Text className={classes.heroDate}>
            {new Intl.DateTimeFormat('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }).format(new Date())}
          </Text>
        </Stack>

        <AdminPanelWidgetsSection metrics={metrics} />

        <AdminPanelUserGestionTable
          activeUsersCount={activeUsersCount}
          filteredUsers={filteredUsers}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          openCreateModal={openCreateModal}
          openEditModal={openEditModal}
          openPasswordModal={openPasswordModal}
          openDeleteModal={openDeleteModal}
        />
      </Stack>

      <AdminPanelModals
        selectedUser={selectedUser}
        createOpened={createOpened}
        editOpened={editOpened}
        passwordOpened={passwordOpened}
        deleteOpened={deleteOpened}
        roleOptions={roleOptions}
        closeCreateModal={closeCreateModal}
        closeEditModal={closeEditModal}
        closePasswordModal={closePasswordModal}
        closeDeleteModal={closeDeleteModal}
        createUser={createUser}
        updateUser={updateUser}
        registerPasswordChange={registerPasswordChange}
        deleteUser={deleteUser}
      />
    </>
  );
}
