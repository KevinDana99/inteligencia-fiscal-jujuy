'use server';

import type { IAdminPanelUser, IModuleQueryResult } from '../../models/AdminPanel';
import { createServerAdminPanelSource } from '../../data-access';

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

export async function getAdminUserAction(
  userId: string
): Promise<IModuleQueryResult<IAdminPanelUser>> {
  try {
    console.log('[admin-panel][get-user][request]', { usuarioId: userId });
    const source = await createServerAdminPanelSource();
    const data = await source.getAdminUser(userId);

    console.log('[admin-panel][get-user][response]', mapUserToContractLog(data));

    return {
      data
    };
  } catch (error) {
    console.log('[admin-panel][get-user][error]', {
      usuarioId: userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
