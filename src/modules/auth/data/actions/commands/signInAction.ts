'use server';

import { mapIamSessionResponseToAuthSession } from '@/lib/auth/session-mapper';
import { setServerAuthCookies } from '@/lib/auth/cookies';
import { createServerAuthSource } from '../../data-access';
import type { IIamActionError, IIamSessionResponse, IIamSignInRequest } from '../../models/Auth';

function redactToken(token: string): string {
  if (token.length <= 12) {
    return '***';
  }

  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

export async function signInAction(
  params: IIamSignInRequest
): Promise<IIamSessionResponse | IIamActionError> {
  try {
    console.log('[auth][login][request]', {
      correo: params.correo,
      contrasena: '[REDACTED]'
    });

    const source = await createServerAuthSource();
    const response = await source.signIn(params);
    await setServerAuthCookies(mapIamSessionResponseToAuthSession(response));

    console.log('[auth][login][response]', {
      token: redactToken(response.token),
      expiraEn: response.expiraEn,
      refrescarToken: redactToken(response.refrescarToken),
      refrescarTokenExpiraEn: response.refrescarTokenExpiraEn,
      usuario: response.usuario
    });

    return response;
  } catch (error) {
    console.log('[auth][login][error]', {
      correo: params.correo,
      error: error instanceof Error ? error.message : 'Unable to sign in'
    });

    return {
      error: error instanceof Error ? error.message : 'Unable to sign in'
    };
  }
}
