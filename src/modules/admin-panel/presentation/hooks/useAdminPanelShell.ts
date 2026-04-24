'use client';

import { useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import type {
  IAdminPanelCreateUserInput,
  IAdminPanelData,
  IAdminPanelUpdateUserInput,
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

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildUserFromInput(
  input: IAdminPanelCreateUserInput,
  existingUsersLength: number
): IAdminPanelUser {
  return {
    id: `${slugify(input.fullName)}-${existingUsersLength + 1}`,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    roleLabel: input.roleLabel
  };
}

export function useAdminPanelShell(initialData: IAdminPanelData) {
  const [users, setUsers] = useState(initialData.users);
  const [avatarPalette, setAvatarPalette] = useState(() => buildInitialAvatarPalette(initialData.users));
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<IAdminPanelUser | null>(null);
  const [createOpened, createHandlers] = useDisclosure(false);
  const [editOpened, editHandlers] = useDisclosure(false);
  const [deleteOpened, deleteHandlers] = useDisclosure(false);

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
    setUsers((currentUsers) => {
      const nextUser = buildUserFromInput(input, currentUsers.length);

      setAvatarPalette((currentPalette) => {
        const availablePool =
          currentPalette.availableColors.length > 0
            ? currentPalette.availableColors
            : shuffleAvatarColors(
                AVATAR_COLOR_TOKENS.filter((color) => color !== ADMIN_AVATAR_COLOR),
                nextUser.id
              );

        const { nextColor, nextAvailableColors } = drawAvatarColor(availablePool, nextUser.id);

        return {
          avatarColorByUserId: {
            ...currentPalette.avatarColorByUserId,
            [nextUser.id]: nextColor
          },
          availableColors: nextAvailableColors
        };
      });

      return [...currentUsers, nextUser];
    });
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

  const openDeleteModal = (user: IAdminPanelUser) => {
    setSelectedUser(user);
    deleteHandlers.open();
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    editHandlers.close();
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
    deleteHandlers.close();
  };

  return {
    searchValue,
    activeUsersCount: activeUsers.length,
    filteredUsers,
    avatarColorByUserId: avatarPalette.avatarColorByUserId,
    selectedUser,
    createOpened,
    editOpened,
    deleteOpened,
    roleOptions: [...USER_ROLE_OPTIONS],
    setSearchValue,
    createUser,
    updateUser,
    deleteUser,
    openCreateModal: createHandlers.open,
    closeCreateModal: createHandlers.close,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal
  };
}
