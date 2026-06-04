import { AUTH_ROUTES, USER_ROLES } from './constants';
import {
  getProtectedRouteRedirect,
  isAdminRoute,
  isPrivateDashboardRoute
} from './route-access';

describe('route-access', () => {
  it('detects admin routes including nested paths', () => {
    expect(isAdminRoute('/admin')).toBe(true);
    expect(isAdminRoute('/admin/configuracion')).toBe(true);
    expect(isAdminRoute('/')).toBe(false);
  });

  it('detects shared private dashboard routes', () => {
    expect(isPrivateDashboardRoute('/')).toBe(true);
    expect(isPrivateDashboardRoute('/gestion-de-lotes')).toBe(true);
    expect(isPrivateDashboardRoute('/admin')).toBe(false);
    expect(isPrivateDashboardRoute('/login')).toBe(false);
  });

  it('redirects admins away from the shared private dashboard', () => {
    expect(getProtectedRouteRedirect('/', USER_ROLES.ADMIN)).toBe(AUTH_ROUTES.admin);
    expect(getProtectedRouteRedirect('/configuracion', USER_ROLES.ADMIN)).toBe(
      AUTH_ROUTES.admin
    );
    expect(getProtectedRouteRedirect('/admin', USER_ROLES.ADMIN)).toBeNull();
  });

  it('redirects fiscal analysts away from admin routes', () => {
    expect(getProtectedRouteRedirect('/admin', USER_ROLES.FISCAL_ANALYST)).toBe(
      AUTH_ROUTES.login
    );
    expect(
      getProtectedRouteRedirect('/admin/configuracion', USER_ROLES.FISCAL_ANALYST)
    ).toBe(AUTH_ROUTES.login);
    expect(getProtectedRouteRedirect('/', USER_ROLES.FISCAL_ANALYST)).toBeNull();
  });

  it('keeps the proxy neutral when the user type is unknown', () => {
    expect(getProtectedRouteRedirect('/', null)).toBeNull();
  });

  it('keeps authenticated non-admin variants inside the shared dashboard', () => {
    expect(
      getProtectedRouteRedirect(
        '/',
        'FISCAL' as unknown as (typeof USER_ROLES)[keyof typeof USER_ROLES]
      )
    ).toBeNull();
  });
});
