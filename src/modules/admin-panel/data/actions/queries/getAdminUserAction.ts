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
  const normalizedUserId = userId.trim();
  const endpoint = `/api/super-administrador/usuarios/${encodeURIComponent(normalizedUserId)}`;
  const action = 'getAdminUserAction';
  const METHOD = 'GET';
  const REQUEST = {
    usuarioId: normalizedUserId
  };

  try {
    const source = await createServerAdminPanelSource();
    const data = await source.getAdminUser(normalizedUserId);

    console.log({
      endpoint,
      action,
      METHOD,
      REQUEST,
      RESPONSE: mapUserToContractLog(data)
    });

    return {
      data
    };
  } catch (error) {
    console.log({
      endpoint,
      action,
      METHOD,
      REQUEST,
      RESPONSE: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
