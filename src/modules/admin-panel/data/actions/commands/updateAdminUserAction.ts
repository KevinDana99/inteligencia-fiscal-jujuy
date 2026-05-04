'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminPanelSource } from '../../data-access';
import type { IAdminPanelCommandResult } from '../../models/AdminPanel';
import type { ApiUpdateAdminUserRequestDto } from '../../sources/rest/dtos/ApiAdminPanelDtos';

export async function updateAdminUserAction(
  userId: string,
  params: ApiUpdateAdminUserRequestDto
): Promise<IAdminPanelCommandResult> {
  const requestPayload = {
    usuarioId: userId,
    ...params,
    nuevaContrasena: params.nuevaContrasena ? '[REDACTED]' : null,
    confirmarContrasena: params.confirmarContrasena ? '[REDACTED]' : null
  };

  const source = await createServerAdminPanelSource();
  const result = await source.updateAdminUser({
    id: userId,
    firstName: params.nombre,
    lastName: params.apellido,
    email: params.correo,
    roleLabel: params.cargo,
    password: params.nuevaContrasena ?? ''
  });

  console.log({
    endpoint: `/api/super-administrador/usuarios/${userId}`,
    action: 'updateAdminUserAction',
    METHOD: 'PATCH',
    REQUEST: requestPayload,
    RESPONSE: {
      success: result.success,
      status: result.status,
      code: result.code,
      error: result.error,
      data: result.success ? null : undefined
    }
  });

  if (result.success) {
    revalidatePath('/admin');
  }

  return result;
}
