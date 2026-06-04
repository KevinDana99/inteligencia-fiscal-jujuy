'use client'

import { useState } from 'react'
import type { IAdminPanelUser } from '../../../data/models/AdminPanel'
import { buildInitialAvatarPalette } from '../../utils/adminPanelAvatarPalette'

export function useAdminPanelAvatarPalette(initialUsers: IAdminPanelUser[]) {
  const [avatarPalette] = useState(() => buildInitialAvatarPalette(initialUsers))

  return avatarPalette.avatarColorByUserId
}
