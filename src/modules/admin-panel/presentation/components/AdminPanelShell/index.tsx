'use client';

import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import type { IAdminPanelData } from '../../../data/models/AdminPanel';
import { AdminPanelHomeSection } from '../AdminPanelHomeSection';
import { AdminPanelNavbar } from '../AdminPanelNavbar';
import { AdminPanelSettingsSection } from '../AdminPanelSettingsSection';
import { AdminPanelSidebar } from '../AdminPanelSidebar';
import { useAdminPanelShell } from '../../hooks';
import classes from './AdminPanelShell.module.css';

export default function AdminPanelShell({
  data,
  session
}: {
  data: IAdminPanelData;
  session: IAuthSession;
}) {
  const {
    section,
    metrics,
    searchValue,
    activeUsersCount,
    filteredUsers,
    selectedUser,
    createOpened,
    editOpened,
    passwordOpened,
    deleteOpened,
    isSignOutPending,
    roleOptions,
    setSection,
    setSearchValue,
    signOut,
    createUser,
    updateUser,
    registerPasswordChange,
    deleteUser,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openPasswordModal,
    closePasswordModal,
    openDeleteModal,
    closeDeleteModal
  } = useAdminPanelShell(data);

  return (
    <div className={classes.page}>
      <div className={classes.layout}>
        <AdminPanelNavbar
          session={session}
          signOut={signOut}
          isSignOutPending={isSignOutPending}
        />

        <AdminPanelSidebar section={section} setSection={setSection} />

        <main className={classes.main}>
          <div className={classes.content}>
            {section === 'home' ? (
              <AdminPanelHomeSection
                metrics={metrics}
                activeUsersCount={activeUsersCount}
                filteredUsers={filteredUsers}
                selectedUser={selectedUser}
                createOpened={createOpened}
                editOpened={editOpened}
                passwordOpened={passwordOpened}
                deleteOpened={deleteOpened}
                roleOptions={roleOptions}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                openCreateModal={openCreateModal}
                openEditModal={openEditModal}
                openPasswordModal={openPasswordModal}
                openDeleteModal={openDeleteModal}
                closeCreateModal={closeCreateModal}
                closeEditModal={closeEditModal}
                closePasswordModal={closePasswordModal}
                closeDeleteModal={closeDeleteModal}
                createUser={createUser}
                updateUser={updateUser}
                registerPasswordChange={registerPasswordChange}
                deleteUser={deleteUser}
              />
            ) : (
              <AdminPanelSettingsSection />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
