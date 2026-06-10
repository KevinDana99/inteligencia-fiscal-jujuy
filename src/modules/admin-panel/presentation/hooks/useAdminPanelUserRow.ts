'use client'

import { useCallback } from 'react'
import { getInitials } from '@/utils'
import type { IAdminPanelUser } from '../../data/models/AdminPanel'
import {
  getAvatarColorStyles,
  type AvatarColorTone
} from '../utils/getAvatarColorStyles'
import classes from '../styles/AdminPanel.module.css'

export function useAdminPanelUserRow({
  user,
  avatarColor,
  onEditUser,
  onDeleteUser
}: UseAdminPanelUserRowOptions) {
  const handleEditUser = useCallback(() => {
    onEditUser(user)
  }, [onEditUser, user])

  const handleDeleteUser = useCallback(() => {
    onDeleteUser(user)
  }, [onDeleteUser, user])

  return {
    avatarInitials: getInitials(user.fullName),
    avatarStyle: getAvatarColorStyles(avatarColor, user.isAdmin ? 5 : 6),
    roleBadgeRootClassName: user.isAdmin
      ? classes.roleBadgeAdmin
      : classes.roleBadge,
    showActions: !user.isAdmin && user.hasUsuarioId !== false,
    handleEditUser,
    handleDeleteUser
  }
}

interface UseAdminPanelUserRowOptions {
  user: IAdminPanelUser
  avatarColor: AvatarColorTone
  onEditUser: (user: IAdminPanelUser) => void
  onDeleteUser: (user: IAdminPanelUser) => void
}
