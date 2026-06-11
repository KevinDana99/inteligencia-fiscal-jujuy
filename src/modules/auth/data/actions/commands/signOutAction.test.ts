import { AUTH_ROUTES } from '@/constants'
import { signOutAction } from './signOutAction'

const mockRedirect = jest.fn()
const mockReadServerAuthSession = jest.fn()
const mockClearServerAuthCookies = jest.fn()
const mockCreateServerAuthSource = jest.fn()
const mockSignOut = jest.fn()

jest.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args)
}))

jest.mock('@/lib/auth/cookies', () => ({
  readServerAuthSession: (...args: unknown[]) => mockReadServerAuthSession(...args),
  clearServerAuthCookies: (...args: unknown[]) => mockClearServerAuthCookies(...args)
}))

jest.mock('../../data-access', () => ({
  createServerAuthSource: (...args: unknown[]) => mockCreateServerAuthSource(...args)
}))

describe('signOutAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateServerAuthSource.mockResolvedValue({ signOut: mockSignOut })
    mockReadServerAuthSession.mockResolvedValue({
      refreshToken: 'refresh-token'
    })
    mockClearServerAuthCookies.mockResolvedValue(undefined)
  })

  it('clears auth cookies and redirects to login after revoking the session', async () => {
    const redirectError = new Error('NEXT_REDIRECT')

    mockSignOut.mockResolvedValue({ success: true })
    mockRedirect.mockImplementation(() => {
      throw redirectError
    })

    await expect(signOutAction()).rejects.toBe(redirectError)

    expect(mockSignOut).toHaveBeenCalledWith('refresh-token')
    expect(mockClearServerAuthCookies).toHaveBeenCalledTimes(1)
    expect(mockRedirect).toHaveBeenCalledWith(AUTH_ROUTES.login)
  })

  it('still clears auth cookies when the revoke request fails', async () => {
    const revokeError = new Error('Unable to revoke session')

    mockSignOut.mockRejectedValue(revokeError)

    await expect(signOutAction()).rejects.toThrow(revokeError)

    expect(mockClearServerAuthCookies).toHaveBeenCalledTimes(1)
    expect(mockRedirect).not.toHaveBeenCalled()
  })
})
