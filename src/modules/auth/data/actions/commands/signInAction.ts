'use server';

import type { Route } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import {
  mapIamSessionResponseToSerializedAuthSession
} from '@/lib/auth/session-mapper';
import { setServerAuthCookies } from '@/lib/auth/cookies';
import { AUTH_COOKIE_NAMES } from '@/lib/auth/constants';
import {
  AUTH_LOGIN_SUCCESS_TOAST_COOKIE,
  AUTH_LOGIN_SUCCESS_TOAST_MAX_AGE
} from '@/lib/auth/login-success-toast'
import { AUTH_SESSION_EXPIRED_NOTICE_COOKIE } from '@/lib/auth/session-expired-notice'
import { getRedirectPathByUserType } from '@/lib/auth/proxy-session'
import { createServerAuthSource } from '../../data-access';
import type {
  IAuthActionState,
  IAuthSignInActionData
} from '../../models/Auth';

function redactToken(token: string): string {
  if (token.length <= 12) {
    return '***';
  }

  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

function isNextRedirectError(error: unknown): boolean {
  if (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof error.digest === 'string' &&
    error.digest.startsWith('NEXT_REDIRECT')
  ) {
    return true
  }

  if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
    return true
  }

  if (typeof error === 'string' && error === 'NEXT_REDIRECT') {
    return true
  }

  return String(error).includes('NEXT_REDIRECT')
}

export async function signInAction(
  _previousState: IAuthActionState<IAuthSignInActionData>,
  formData: FormData
): Promise<IAuthActionState<IAuthSignInActionData>> {
  const correo = String(formData.get('correo') ?? '').trim()
  const contrasena = String(formData.get('contrasena') ?? '')
  const cookieStore = await cookies()

  try {
    console.log('[auth][login][request]', {
      correo,
      contrasena: '[REDACTED]'
    })

    const source = await createServerAuthSource()
    const response = await source.signIn({ correo, contrasena })
    const currentContext = await source.getCurrentContext(response.token)
    const serializedSession =
      mapIamSessionResponseToSerializedAuthSession(response)
    await setServerAuthCookies(serializedSession)
    cookieStore.set(AUTH_LOGIN_SUCCESS_TOAST_COOKIE, '1', {
      path: '/',
      sameSite: 'lax',
      maxAge: AUTH_LOGIN_SUCCESS_TOAST_MAX_AGE
    })
    cookieStore.delete(AUTH_COOKIE_NAMES.postLoginRedirect)
    cookieStore.delete(AUTH_SESSION_EXPIRED_NOTICE_COOKIE)
    const redirectTo = getRedirectPathByUserType(
      currentContext.tipoUsuario
    )

    console.log('[auth][login][response]', {
      token: redactToken(response.token),
      expiraEn: response.expiraEn,
      refrescarToken: redactToken(response.refrescarToken),
      refrescarTokenExpiraEn: response.refrescarTokenExpiraEn,
      usuario: response.usuario,
      redirectTo
    })

    redirect(redirectTo as Route)
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error
    }

    const authError =
      error instanceof Error && error.message === 'Invalid credentials'
        ? {
            code: 'autenticacion.no_autorizado',
            message:
              'La solicitud requiere un token valido o credenciales correctas.',
            statusCode: 401
          }
        : {
            code: 'autenticacion.error_interno',
            message: 'No fue posible iniciar sesion. Intenta nuevamente.',
            statusCode: 500
          }

    console.log('[auth][login][error]', {
      correo,
      error: error instanceof Error ? error.message : 'Unable to sign in'
    })

    return {
      success: false,
      message:
        authError.code === 'autenticacion.no_autorizado'
          ? 'El correo electronico o la contrasena son incorrectos. Verifica tus datos e intenta nuevamente.'
          : authError.message,
      errors: authError,
      data: null
    }
  }
}
