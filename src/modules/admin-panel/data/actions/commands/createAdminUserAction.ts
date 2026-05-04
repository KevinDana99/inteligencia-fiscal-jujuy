'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminPanelSource } from '../../data-access';
import type {
  IAdminPanelCommandResult,
  IAdminPanelUser
} from '../../models/AdminPanel';
import type { ApiCreateAdminUserRequestDto } from '../../sources/rest/dtos/ApiAdminPanelDtos';

function mapUserToContractLog(user: IAdminPanelUser) {
  const [nombre, ...apellidoParts] = user.fullName.split(' ');

  return {
    usuarioId: user.id,
    nombre: nombre ?? '',
    apellido: apellidoParts.join(' '),
    correo: user.email,
    cargo: user.roleLabel,
    activo: !user.isDeleted,
    esSuperAdministrador: Boolean(user.isAdmin)
  };
}

export async function createAdminUserAction(
  params: ApiCreateAdminUserRequestDto
): Promise<IAdminPanelCommandResult<IAdminPanelUser>> {
  const requestPayload = {
    ...params,
    contrasena: params.contrasena ? '[REDACTED]' : ''
  };

  const source = await createServerAdminPanelSource();
  const result = await source.createAdminUser({
    firstName: params.nombre,
    lastName: params.apellido,
    email: params.correo,
    roleLabel: params.cargo,
    password: params.contrasena
  });

  console.log({
    endpoint: '/api/super-administrador/usuarios',
    action: 'createAdminUserAction',
    METHOD: 'POST',
    REQUEST: requestPayload,
    RESPONSE: {
      success: result.success,
      status: result.status,
      code: result.code,
      error: result.error,
      data: result.data ? mapUserToContractLog(result.data) : null
    }
  });

  if (result.success) {
    revalidatePath('/admin');
  }

  return result;
}
