'use server';

import { createServerAdminPanelSource } from '../../data-access';
import type {
  IAdminPanelActionState,
  IAdminPanelCreateUserActionData,
  IAdminPanelUser
} from '../../models/AdminPanel';

function mapUserToContract(user: IAdminPanelUser): IAdminPanelCreateUserActionData {
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
  _previousState: IAdminPanelActionState<IAdminPanelCreateUserActionData>,
  formData: FormData
): Promise<IAdminPanelActionState<IAdminPanelCreateUserActionData>> {
  const params = {
    nombre: String(formData.get('nombre') ?? '').trim(),
    apellido: String(formData.get('apellido') ?? '').trim(),
    correo: String(formData.get('correo') ?? '').trim().toLowerCase(),
    cargo: String(formData.get('cargo') ?? '').trim(),
    contrasena: String(formData.get('contrasena') ?? '')
  }

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
      data: result.data ? mapUserToContract(result.data) : null
    }
  });

  if (result.success) {
    return {
      success: true,
      message: null,
      errors: null,
      data: result.data ? mapUserToContract(result.data) : null
    }
  }

  return {
    success: false,
    message: result.error ?? 'No fue posible crear el usuario.',
    errors: {
      code:
        result.code ?? 'super_administrador.usuarios.crear.error_interno',
      message: result.error ?? 'No fue posible crear el usuario.',
      statusCode: result.status ?? 500
    },
    data: null
  }
}
