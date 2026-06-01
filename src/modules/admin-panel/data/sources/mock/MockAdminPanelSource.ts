import type {
  IAdminPanelCommandResult,
  IAdminPanelCreateUserInput,
  IAdminPanelData,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../models/AdminPanel';
import type { IAdminPanelSource } from '../../interfaces/AdminPanelSource';
import { ADMIN_PANEL_MOCK_DATA } from './fixtures/adminPanelData';

declare global {
  var __adminPanelMockStore__: MockAdminPanelUserRecord[] | undefined
}

type MockAdminPanelUserRecord = {
  id: string
  firstName: string
  lastName: string
  email: string
  roleLabel: string
  password: string
  isAdmin: boolean
  isDeleted: boolean
}

function mapUserToRecord(user: IAdminPanelData['users'][number]): MockAdminPanelUserRecord {
  const [firstName, ...lastNameParts] = user.fullName.split(' ')

  return {
    id: user.id,
    firstName: firstName ?? '',
    lastName: lastNameParts.join(' '),
    email: user.email,
    roleLabel: user.roleLabel,
    password: '',
    isAdmin: Boolean(user.isAdmin),
    isDeleted: Boolean(user.isDeleted)
  }
}

function mapRecordToUser(record: MockAdminPanelUserRecord): IAdminPanelUser {
  return {
    id: record.id,
    fullName: `${record.firstName} ${record.lastName}`.trim(),
    email: record.email,
    roleLabel: record.roleLabel,
    isAdmin: record.isAdmin,
    isDeleted: record.isDeleted
  }
}

function cloneAdminPanelUsers(users: MockAdminPanelUserRecord[]) {
  return users.map((user) => ({ ...user }))
}

function buildAdminPanelData(users: MockAdminPanelUserRecord[]): IAdminPanelData {
  return {
    users: users.map(mapRecordToUser)
  }
}

function ensureUniqueMockUserIds(users: MockAdminPanelUserRecord[]) {
  const idOccurrences = new Map<string, number>()

  return users.map((user) => {
    const currentOccurrence = idOccurrences.get(user.id) ?? 0
    idOccurrences.set(user.id, currentOccurrence + 1)

    if (currentOccurrence === 0) {
      return user
    }

    return {
      ...user,
      id: `${user.id}-${currentOccurrence + 1}`
    }
  })
}

function getAdminPanelMockStore() {
  if (!globalThis.__adminPanelMockStore__) {
    globalThis.__adminPanelMockStore__ = cloneAdminPanelUsers(
      ADMIN_PANEL_MOCK_DATA.users.map(mapUserToRecord)
    )
  }

  globalThis.__adminPanelMockStore__ = ensureUniqueMockUserIds(
    cloneAdminPanelUsers(globalThis.__adminPanelMockStore__)
  )

  return globalThis.__adminPanelMockStore__
}

function setAdminPanelMockStore(nextStore: MockAdminPanelUserRecord[]) {
  globalThis.__adminPanelMockStore__ = nextStore
}

function buildMockUserId(params: {
  firstName: string
  lastName: string
  email: string
}) {
  const fullNameSlug = `${params.firstName.trim().toLowerCase()}-${params.lastName.trim().toLowerCase()}`
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  const emailSlug = params.email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(-8)

  return `${fullNameSlug}-${emailSlug || Date.now().toString(36)}`
}

export class MockAdminPanelSource implements IAdminPanelSource {
  async getAdminPanelData(): Promise<IAdminPanelData> {
    return buildAdminPanelData(cloneAdminPanelUsers(getAdminPanelMockStore()));
  }

  async getAdminUser(userId: string) {
    const user = getAdminPanelMockStore().find((item) => item.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    return mapRecordToUser({ ...user });
  }

  async createAdminUser(
    params: IAdminPanelCreateUserInput
  ): Promise<IAdminPanelCommandResult<(typeof ADMIN_PANEL_MOCK_DATA.users)[number]>> {
    const adminPanelMockStore = getAdminPanelMockStore()
    const normalizedEmail = params.email.trim().toLowerCase()

    if (adminPanelMockStore.some((item) => item.email === normalizedEmail)) {
      return {
        success: false,
        error: 'Ya existe un usuario con el correo informado.',
        code: 'super_administrador.usuarios.crear.correo_duplicado',
        status: 409
      }
    }

    const nextUser: MockAdminPanelUserRecord = {
      id: buildMockUserId({
        firstName: params.firstName,
        lastName: params.lastName,
        email: normalizedEmail
      }),
      firstName: params.firstName.trim(),
      lastName: params.lastName.trim(),
      email: normalizedEmail,
      roleLabel: params.roleLabel,
      password: params.password,
      isAdmin: false,
      isDeleted: false
    }

    setAdminPanelMockStore([...adminPanelMockStore, nextUser])

    return {
      success: true,
      data: mapRecordToUser(nextUser)
    }
  }

  async updateAdminUser(
    params: IAdminPanelUpdateUserInput
  ): Promise<IAdminPanelCommandResult> {
    const adminPanelMockStore = getAdminPanelMockStore()
    const user = adminPanelMockStore.find((item) => item.id === params.id);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
        status: 404
      };
    }

    if (user.isAdmin) {
      return {
        success: false,
        error: 'Super admin account cannot be edited',
        status: 409
      };
    }

    const normalizedEmail = params.email.trim().toLowerCase()

    if (
      adminPanelMockStore.some(
        (item) => item.id !== params.id && item.email === normalizedEmail
      )
    ) {
      return {
        success: false,
        error: 'Ya existe un usuario con el correo informado.',
        code: 'super_administrador.usuarios.editar.correo_duplicado',
        status: 409
      }
    }

    setAdminPanelMockStore(adminPanelMockStore.map((item) =>
        item.id === params.id
          ? {
              ...item,
              firstName: params.firstName.trim(),
              lastName: params.lastName.trim(),
              email: normalizedEmail,
              roleLabel: params.roleLabel,
              password: params.newPassword?.trim() || item.password
            }
          : item
      ))

    return { success: true };
  }

  async deleteAdminUser(userId: string): Promise<IAdminPanelCommandResult> {
    const user = getAdminPanelMockStore().find((item) => item.id === userId);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
        status: 404
      };
    }

    if (user.isAdmin) {
      return {
        success: false,
        error: 'Super admin account cannot be deleted',
        status: 409
      };
    }

    return { success: true };
  }
}
