import {
  buildExpiredClientCookie,
  hasClientCookie
} from './authLoginSuccessToastCookie'

describe('auth login success toast cookie utilities', () => {
  it('detects a cookie by exact name', () => {
    expect(
      hasClientCookie('theme=light; auth-login-success-toast=1', 'auth-login-success-toast')
    ).toBe(true)
  })

  it('does not match partial cookie names', () => {
    expect(
      hasClientCookie(
        'auth-login-success-toast-extra=1',
        'auth-login-success-toast'
      )
    ).toBe(false)
  })

  it('builds a path-scoped expired cookie', () => {
    expect(buildExpiredClientCookie('auth-login-success-toast', false)).toBe(
      'auth-login-success-toast=; Max-Age=0; path=/; SameSite=Lax'
    )
  })

  it('adds Secure when the page is served over https', () => {
    expect(buildExpiredClientCookie('auth-login-success-toast', true)).toBe(
      'auth-login-success-toast=; Max-Age=0; path=/; SameSite=Lax; Secure'
    )
  })
})
