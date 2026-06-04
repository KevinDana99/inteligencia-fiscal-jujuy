import type { IAdminPanelUser } from '../../data/models/AdminPanel'

export function buildAdminPanelUsersKey(users: IAdminPanelUser[]) {
  return users
    .map((user) =>
      [
        user.id,
        user.fullName,
        user.email,
        user.roleLabel,
        user.isDeleted ? '1' : '0',
        user.isAdmin ? '1' : '0'
      ].join(':')
    )
    .join('|')
}
