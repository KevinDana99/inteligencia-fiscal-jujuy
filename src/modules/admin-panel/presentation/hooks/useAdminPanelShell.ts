"use client";

import { useCallback } from "react";
import type {
  IAdminPanelData,
  IAdminPanelUser,
} from "../../data/models/AdminPanel";
import { ADMIN_PANEL_ROLE_OPTIONS } from "../constants/adminPanelRoles";
import { useAdminPanelAvatarPalette } from "./admin-panel-shell/useAdminPanelAvatarPalette";
import { useAdminPanelModalState } from "./admin-panel-shell/useAdminPanelModalState";
import { useAdminPanelUsers } from "./admin-panel-shell/useAdminPanelUsers";
import { useDeleteAdminPanelUser } from "./admin-panel-shell/useDeleteAdminPanelUser";

export function useAdminPanelShell(initialData: IAdminPanelData) {
  const usersState = useAdminPanelUsers(initialData.users);
  const avatarColorByUserId = useAdminPanelAvatarPalette(initialData.users);
  const modalState = useAdminPanelModalState();
  const deleteState = useDeleteAdminPanelUser({
    selectedUser: modalState.selectedUser,
    markUserAsDeleted: usersState.markUserAsDeleted,
    closeDeleteModal: modalState.closeDeleteModal,
    clearSelectedUser: modalState.clearSelectedUser,
  });

  const openCreateModal = useCallback(() => {
    deleteState.clearActionError();
    modalState.openCreateModal();
  }, [deleteState, modalState]);

  const openEditModal = useCallback(
    (user: IAdminPanelUser) => {
      deleteState.clearActionError();
      modalState.openEditModal(user);
    },
    [deleteState, modalState]
  );

  const openDeleteModal = useCallback(
    (user: IAdminPanelUser) => {
      deleteState.clearActionError();
      modalState.openDeleteModal(user);
    },
    [deleteState, modalState]
  );

  const closeCreateModal = useCallback(() => {
    deleteState.clearActionError();
    modalState.closeCreateModal();
  }, [deleteState, modalState]);

  const closeEditModal = useCallback(() => {
    deleteState.clearActionError();
    modalState.closeEditModal();
  }, [deleteState, modalState]);

  const closeDeleteModal = useCallback(() => {
    deleteState.clearActionError();
    modalState.closeDeleteModal();
  }, [deleteState, modalState]);

  const orderUsersPerRole = (users: IAdminPanelUser[]) => {
    return [...users].sort((a, b) => {
      const adminA = Number(!!a.isAdmin);
      const adminB = Number(!!b.isAdmin);
      return adminB - adminA;
    });
  };
  return {
    searchValue: usersState.searchValue,
    activeUsersCount: usersState.activeUsersCount,
    filteredUsers: orderUsersPerRole(usersState.filteredUsers),
    avatarColorByUserId,
    actionError: deleteState.actionError,
    isActionPending: deleteState.isActionPending,
    selectedUser: modalState.selectedUser,
    createOpened: modalState.createOpened,
    editOpened: modalState.editOpened,
    deleteOpened: modalState.deleteOpened,
    roleOptions: [...ADMIN_PANEL_ROLE_OPTIONS],
    setSearchValue: usersState.setSearchValue,
    deleteUser: deleteState.deleteUser,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    clearActionError: deleteState.clearActionError,
  };
}
