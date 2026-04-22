'use client';

import { useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useSignOut } from '@/modules/auth/presentation/hooks';
import type {
  AdminPanelSection,
  IAdminPanelCreateUserInput,
  IAdminPanelData,
  IAdminPanelMetrics,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../data/models/AdminPanel';

const USER_ROLE_OPTIONS = ['Fiscal', 'Inspectora', 'Analista', 'Coordinadora'] as const;
const USER_AVATAR_COLORS = ['indigo', 'green', 'orange', 'grape', 'cyan'] as const;

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildMetrics(
  users: IAdminPanelUser[],
  historicalPasswordChanges: number
): IAdminPanelMetrics {
  const activeUsers = users.filter((user) => !user.isDeleted);
  const distinctRoles = new Set(activeUsers.map((user) => user.roleLabel)).size;

  return {
    activeUsers: activeUsers.length,
    deletedUsers: users.filter((user) => user.isDeleted).length,
    passwordChanges: historicalPasswordChanges,
    distinctRoles
  };
}

function buildUserFromInput(
  input: IAdminPanelCreateUserInput,
  existingUsersLength: number
): IAdminPanelUser {
  return {
    id: `${slugify(input.fullName)}-${existingUsersLength + 1}`,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    roleLabel: input.roleLabel,
    avatarColor: USER_AVATAR_COLORS[existingUsersLength % USER_AVATAR_COLORS.length]
  };
}

export function useAdminPanelShell(initialData: IAdminPanelData) {
  const { signOut, isPending: isSignOutPending } = useSignOut();
  const [section, setSection] = useState<AdminPanelSection>('home');
  const [users, setUsers] = useState(initialData.users);
  const [historicalPasswordChanges, setHistoricalPasswordChanges] = useState(
    initialData.historicalPasswordChanges
  );
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<IAdminPanelUser | null>(null);
  const [createOpened, createHandlers] = useDisclosure(false);
  const [editOpened, editHandlers] = useDisclosure(false);
  const [passwordOpened, passwordHandlers] = useDisclosure(false);
  const [deleteOpened, deleteHandlers] = useDisclosure(false);

  const metrics = useMemo(
    () => buildMetrics(users, historicalPasswordChanges),
    [historicalPasswordChanges, users]
  );

  const activeUsers = useMemo(() => users.filter((user) => !user.isDeleted), [users]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return activeUsers;
    }

    return activeUsers.filter((user) => {
      const haystack = `${user.fullName} ${user.email} ${user.roleLabel}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [activeUsers, searchValue]);

  const createUser = (input: IAdminPanelCreateUserInput) => {
    setUsers((currentUsers) => [...currentUsers, buildUserFromInput(input, currentUsers.length)]);
    createHandlers.close();
  };

  const updateUser = (input: IAdminPanelUpdateUserInput) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === input.id
          ? {
              ...user,
              fullName: input.fullName.trim(),
              email: input.email.trim().toLowerCase(),
              roleLabel: input.roleLabel
            }
          : user
      )
    );
    setSelectedUser(null);
    editHandlers.close();
  };

  const registerPasswordChange = () => {
    setHistoricalPasswordChanges((currentValue) => currentValue + 1);
    setSelectedUser(null);
    passwordHandlers.close();
  };

  const deleteUser = () => {
    if (!selectedUser || selectedUser.isAdmin) {
      deleteHandlers.close();
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, isDeleted: true } : user
      )
    );
    setSelectedUser(null);
    deleteHandlers.close();
  };

  const openEditModal = (user: IAdminPanelUser) => {
    setSelectedUser(user);
    editHandlers.open();
  };

  const openPasswordModal = (user: IAdminPanelUser) => {
    setSelectedUser(user);
    passwordHandlers.open();
  };

  const openDeleteModal = (user: IAdminPanelUser) => {
    setSelectedUser(user);
    deleteHandlers.open();
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    editHandlers.close();
  };

  const closePasswordModal = () => {
    setSelectedUser(null);
    passwordHandlers.close();
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
    deleteHandlers.close();
  };

  return {
    section,
    metrics,
    searchValue,
    activeUsersCount: activeUsers.length,
    filteredUsers,
    selectedUser,
    createOpened,
    editOpened,
    passwordOpened,
    deleteOpened,
    isSignOutPending,
    roleOptions: [...USER_ROLE_OPTIONS],
    setSection,
    setSearchValue,
    signOut,
    createUser,
    updateUser,
    registerPasswordChange,
    deleteUser,
    openCreateModal: createHandlers.open,
    closeCreateModal: createHandlers.close,
    openEditModal,
    closeEditModal,
    openPasswordModal,
    closePasswordModal,
    openDeleteModal,
    closeDeleteModal
  };
}
