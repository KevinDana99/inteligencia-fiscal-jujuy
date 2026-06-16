import { AUTH_ROUTES, USER_ROLES, type UserRole } from './constants';

const INTERNAL_BROWSER_ROUTE_PREFIXES = ['/.well-known'];

export function isLoginRoute(pathname: string): boolean {
  return pathname === AUTH_ROUTES.login;
}

export function isInternalBrowserRoute(pathname: string): boolean {
  return INTERNAL_BROWSER_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isPostLoginRedirectPath(path: string): boolean {
  const redirectPath = path.trim();

  if (!redirectPath.startsWith('/') || redirectPath.startsWith('//')) {
    return false;
  }

  const pathname = redirectPath.split(/[?#]/)[0];

  return !isLoginRoute(pathname) && !isInternalBrowserRoute(pathname);
}

export function isAdminRoute(pathname: string): boolean {
  return pathname === AUTH_ROUTES.admin || pathname.startsWith(`${AUTH_ROUTES.admin}/`);
}

export function isPrivateDashboardRoute(pathname: string): boolean {
  return !isLoginRoute(pathname) && !isAdminRoute(pathname);
}

export function getProtectedRouteRedirect(
  pathname: string,
  userType: UserRole | null
): string | null {
  if (!userType) {
    return null;
  }

  if (userType === USER_ROLES.ADMIN) {
    return isPrivateDashboardRoute(pathname) ? AUTH_ROUTES.admin : null;
  }

  return isAdminRoute(pathname) ? AUTH_ROUTES.login : null;
}
