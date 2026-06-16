'use server'

import { createServerAdminPanelSource } from '../../data-access'
import type { IAdminPanelActionState } from '../../models/AdminPanel'
import { adminPanelUserIdentitySchema } from '../../../presentation/utils/adminPanelUserValidation'

export async function updateAdminUserAction(
  _previousState: IAdminPanelActionState<null>,
  formData: FormData
): Promise<IAdminPanelActionState<null>> {
  const userId = String(formData.get('usuarioId') ?? '').trim()
  const endpoint = `/api/super-administrador/usuarios/${encodeURIComponent(userId)}`
  const nombre = String(formData.get('nombre') ?? '').trim()
  const apellido = String(formData.get('apellido') ?? '').trim()
  const correo = String(formData.get('correo') ?? '')
    .trim()
    .toLowerCase()
  const cargo = String(formData.get('cargo') ?? '').trim()
  const nuevaContrasena = String(formData.get('nuevaContrasena') ?? '').trim()
  const confirmarContrasena = String(
    formData.get('confirmarContrasena') ?? ''
  ).trim()

  const requestPayload = {
    usuarioId: userId,
    nombre,
    apellido,
    correo,
    cargo,
    nuevaContrasena: nuevaContrasena ? '[REDACTED]' : null,
    confirmarContrasena: confirmarContrasena ? '[REDACTED]' : null
  }

  const identityValidation = adminPanelUserIdentitySchema.safeParse({
    nombre,
    apellido
  })

  if (!identityValidation.success) {
    const message =
      identityValidation.error.flatten().fieldErrors.nombre?.[0] ??
      identityValidation.error.flatten().fieldErrors.apellido?.[0] ??
      'No fue posible validar los datos del usuario.'

    return {
      success: false,
      message,
      errors: {
        code: 'super_administrador.usuarios.editar.validacion_identidad',
        message,
        statusCode: 400
      },
      data: null
    }
  }

  const source = await createServerAdminPanelSource()
  const result = await source.updateAdminUser({
    id: userId,
    firstName: nombre,
    lastName: apellido,
    email: correo,
    roleLabel: cargo,
    newPassword: nuevaContrasena || null,
    confirmPassword: confirmarContrasena || null
  })

  console.log({
    endpoint,
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
  })

  if (!result.success) {
    return {
      success: false,
      message: result.error ?? 'No fue posible actualizar el usuario.',
      errors: {
        code:
          result.code ??
          'super_administrador.usuarios.editar.error_desconocido',
        message: result.error ?? 'No fue posible actualizar el usuario.',
        statusCode: result.status ?? 500
      },
      data: null
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
    data: null
  }
}
