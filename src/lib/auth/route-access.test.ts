import {
  ADMIN_PANEL_ROUTES,
  AUTH_ROUTES,
  PRIVATE_DASHBOARD_ROUTES,
  USER_ROLES
} from '@/constants';
import {
  getProtectedRouteRedirect,
  isAdminRoute,
  isPostLoginRedirectPath,
  isPrivateDashboardRoute
} from './route-access';

describe('route-access', () => {
  it('detects admin routes including nested paths', () => {
    expect(isAdminRoute(ADMIN_PANEL_ROUTES.dashboard)).toBe(true);
    expect(isAdminRoute(ADMIN_PANEL_ROUTES.settings)).toBe(true);
    expect(isAdminRoute('/')).toBe(false);
  });

  it('detects shared private dashboard routes', () => {
    expect(isPrivateDashboardRoute('/')).toBe(true);
    expect(
      isPrivateDashboardRoute(PRIVATE_DASHBOARD_ROUTES.batchManagement)
    ).toBe(true);
    expect(isPrivateDashboardRoute(ADMIN_PANEL_ROUTES.dashboard)).toBe(false);
    expect(isPrivateDashboardRoute(AUTH_ROUTES.login)).toBe(false);
  });

  it('redirects admins away from the shared private dashboard', () => {
    expect(getProtectedRouteRedirect('/', USER_ROLES.ADMIN)).toBe(AUTH_ROUTES.admin);
    expect(
      getProtectedRouteRedirect(
        PRIVATE_DASHBOARD_ROUTES.settings,
        USER_ROLES.ADMIN
      )
    ).toBe(AUTH_ROUTES.admin);
    expect(
      getProtectedRouteRedirect(ADMIN_PANEL_ROUTES.dashboard, USER_ROLES.ADMIN)
    ).toBeNull();
  });

  it('redirects fiscal analysts away from admin routes', () => {
    expect(
      getProtectedRouteRedirect(
        ADMIN_PANEL_ROUTES.dashboard,
        USER_ROLES.FISCAL_ANALYST
      )
    ).toBe(AUTH_ROUTES.login);
    expect(
      getProtectedRouteRedirect(
        ADMIN_PANEL_ROUTES.settings,
        USER_ROLES.FISCAL_ANALYST
      )
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

  it('accepts private app paths as post-login redirect targets', () => {
    expect(isPostLoginRedirectPath(PRIVATE_DASHBOARD_ROUTES.batchManagement)).toBe(true);
    expect(isPostLoginRedirectPath('/vista-previa-padron/30-12345678-1?id=abc')).toBe(true);
    expect(isPostLoginRedirectPath(ADMIN_PANEL_ROUTES.settings)).toBe(true);
  });

  it('rejects login, external, and browser internal post-login redirects', () => {
    expect(isPostLoginRedirectPath(AUTH_ROUTES.login)).toBe(false);
    expect(isPostLoginRedirectPath(`${AUTH_ROUTES.login}?mode=admin`)).toBe(false);
    expect(isPostLoginRedirectPath('//example.com')).toBe(false);
    expect(
      isPostLoginRedirectPath(
        '/.well-known/appspecific/com.chrome.devtools.json'
      )
    ).toBe(false);
  });
});
