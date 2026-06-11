export function hasClientCookie(cookieHeader: string, cookieName: string) {
  return cookieHeader
    .split(';')
    .some((cookie) => cookie.trim().startsWith(`${cookieName}=`))
}

export function buildExpiredClientCookie(cookieName: string, secure: boolean) {
  return `${cookieName}=; Max-Age=0; path=/; SameSite=Lax${secure ? '; Secure' : ''}`
}
