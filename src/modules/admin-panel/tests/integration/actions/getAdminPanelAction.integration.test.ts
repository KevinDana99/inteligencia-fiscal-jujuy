import { getAdminPanelAction } from '../../../data/actions/queries/getAdminPanelAction'
import { ADMIN_PANEL_MOCK_DATA } from '../../../data/sources/mock/fixtures/adminPanelData'

const ORIGINAL_USE_MOCK_ADMIN_PANEL =
  process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL

describe('getAdminPanelAction', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL = 'true'
  })

  afterEach(() => {
    if (typeof ORIGINAL_USE_MOCK_ADMIN_PANEL === 'undefined') {
      delete process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL
      return
    }

    process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL = ORIGINAL_USE_MOCK_ADMIN_PANEL
  })

  test('returns the admin panel users from the module source', async () => {
    const result = await getAdminPanelAction()

    expect(result.error).toBeUndefined()
    expect(result.data).not.toBeNull()
    expect(result.data?.users).toHaveLength(ADMIN_PANEL_MOCK_DATA.users.length)
    expect(result.data?.users).toEqual(
      ADMIN_PANEL_MOCK_DATA.users.map((user) => ({
        ...user,
        isAdmin: Boolean(user.isAdmin),
        isDeleted: Boolean(user.isDeleted)
      }))
    )
    expect(result.data?.users[0]).toEqual({
      id: '019dbb8f-e390-724b-aaee-e13b1c356530',
      fullName: 'Administrador',
      email: 'admin@plantilla.local',
      roleLabel: 'Administrador',
      isAdmin: true,
      isDeleted: false
    })
  })
})
