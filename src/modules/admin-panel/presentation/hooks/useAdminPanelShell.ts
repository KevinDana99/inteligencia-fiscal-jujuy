'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { deleteAdminUserAction } from '../../data/actions';
import type {
  IAdminPanelData,
  IAdminPanelUser
} from '../../data/models/AdminPanel';
import {
  AVATAR_COLOR_TOKENS,
  type AvatarColorTone
} from '../utils/getAvatarColorStyles';

const USER_ROLE_OPTIONS = ['Fiscal', 'Inspectora', 'Analista', 'Coordinadora'] as const;
const ADMIN_AVATAR_COLOR: AvatarColorTone = 'blue';

function getSeededNumber(seed: string): number {
  return [...seed].reduce(
    (accumulator, char) => (accumulator * 31 + char.charCodeAt(0)) % 2147483647,
    7
  );
}

function shuffleAvatarColors(
  colors: readonly AvatarColorTone[],
  seed = `${colors.join('-')}-${colors.length}`
): AvatarColorTone[] {
  const shuffledColors = [...colors];
  let currentSeed = getSeededNumber(seed);

  for (let currentIndex = shuffledColors.length - 1; currentIndex > 0; currentIndex -= 1) {
    currentSeed = (currentSeed * 48271) % 2147483647;
    const randomIndex = currentSeed % (currentIndex + 1);
    [shuffledColors[currentIndex], shuffledColors[randomIndex]] = [
      shuffledColors[randomIndex],
      shuffledColors[currentIndex]
    ];
  }

  return shuffledColors;
}

function drawAvatarColor(availableColors: AvatarColorTone[], seed?: string) {
  const nextAvailableColors =
    availableColors.length > 0
      ? [...availableColors]
      : shuffleAvatarColors(AVATAR_COLOR_TOKENS, seed);

  const nextColor = nextAvailableColors.shift() ?? 'blue';

  return {
    nextColor,
    nextAvailableColors
  };
}

function buildInitialAvatarPalette(users: IAdminPanelUser[]) {
  let availableColors = shuffleAvatarColors(
    AVATAR_COLOR_TOKENS.filter((color) => color !== ADMIN_AVATAR_COLOR),
    users.map((user) => user.id).join('|')
  );

  const avatarColorByUserId = users.reduce<Record<string, AvatarColorTone>>((accumulator, user) => {
    if (user.isAdmin) {
      accumulator[user.id] = ADMIN_AVATAR_COLOR;
      return accumulator;
    }

    const { nextColor, nextAvailableColors } = drawAvatarColor(availableColors, user.id);
    availableColors = nextAvailableColors;
    accumulator[user.id] = nextColor;
    return accumulator;
  }, {});

  return {
    avatarColorByUserId,
    availableColors
  };
}

export function useAdminPanelShell(initialData: IAdminPanelData) {
  const [users, setUsers] = useState(initialData.users);
  const [avatarPalette, setAvatarPalette] = useState(() => buildInitialAvatarPalette(initialData.users));
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<IAdminPanelUser | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const [createOpened, createHandlers] = useDisclosure(false);
  const [editOpened, editHandlers] = useDisclosure(false);
  const [deleteOpened, deleteHandlers] = useDisclosure(false);

  useEffect(() => {
    setUsers(initialData.users)
    setAvatarPalette(buildInitialAvatarPalette(initialData.users))
  }, [initialData.users])

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

  const deleteUser = async () => {
    if (!selectedUser || selectedUser.isAdmin) {
      deleteHandlers.close();
      return false;
    }

    setActionError(null);
    setIsActionPending(true);

    return new Promise<boolean>((resolve) => {
      startTransition(() => {
        void deleteAdminUserAction(selectedUser.id)
          .then((result) => {
            if (!result.success) {
              setActionError(result.error ?? 'No fue posible eliminar el usuario.');
              resolve(false);
              return;
            }

            setUsers((currentUsers) =>
              currentUsers.map((user) =>
                user.id === selectedUser.id ? { ...user, isDeleted: true } : user
              )
            );
            setSelectedUser(null);
            deleteHandlers.close();
            resolve(true);
          })
          .catch(() => {
            setActionError('No fue posible eliminar el usuario.');
            resolve(false);
          })
          .finally(() => {
            setIsActionPending(false);
          });
      });
    });
  };

  const openEditModal = (user: IAdminPanelUser) => {
    setActionError(null);
    setSelectedUser(user);
    editHandlers.open();
  };

  const openDeleteModal = (user: IAdminPanelUser) => {
    setActionError(null);
    setSelectedUser(user);
    deleteHandlers.open();
  };

  const closeEditModal = () => {
    setActionError(null);
    setSelectedUser(null);
    editHandlers.close();
  };

  const closeDeleteModal = () => {
    setActionError(null);
    setSelectedUser(null);
    deleteHandlers.close();
  };

  return {
    searchValue,
    activeUsersCount: activeUsers.length,
    filteredUsers,
    avatarColorByUserId: avatarPalette.avatarColorByUserId,
    actionError,
    isActionPending,
    selectedUser,
    createOpened,
    editOpened,
    deleteOpened,
    roleOptions: [...USER_ROLE_OPTIONS],
    setSearchValue,
    deleteUser,
    openCreateModal: () => {
      setActionError(null);
      createHandlers.open();
    },
    closeCreateModal: () => {
      setActionError(null);
      createHandlers.close();
    },
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    clearActionError: () => setActionError(null)
  };
}
