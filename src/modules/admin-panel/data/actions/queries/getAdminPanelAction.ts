'use server';

import type { IAdminPanelData, IModuleQueryResult } from '../../models/AdminPanel';
import { createServerAdminPanelSource } from '../../data-access';

function mapUserToContractLog(user: IAdminPanelData['users'][number]) {
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

export async function getAdminPanelAction(): Promise<
  IModuleQueryResult<IAdminPanelData>
> {
  try {
    console.log('[admin-panel][list-users][request]');
    const source = await createServerAdminPanelSource();
    const data = await source.getAdminPanelData();

    console.log('[admin-panel][list-users][response]', {
      resumen: {
        cantidadUsuariosActivos: data.users.filter((user) => !user.isDeleted).length
      },
      usuarios: data.users.map(mapUserToContractLog)
    });

    return {
      data
    };
  } catch (error) {
    console.log('[admin-panel][list-users][error]', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
