'use server'

import { revalidatePath } from 'next/cache'
import { ADMIN_PANEL_ROUTES } from '@/constants'
import { createServerAdminPanelSource } from '../../data-access'
import type { IAdminPanelCommandResult } from '../../models/AdminPanel'

export async function deleteAllowedDomainAction(
  domainId: number
): Promise<IAdminPanelCommandResult> {
  try {
    const source = await createServerAdminPanelSource()
    const result = await source.deleteAllowedDomain(domainId)

    console.log({
      endpoint: `/api/super-administrador/dominios-permitidos/${domainId}`,
      action: 'deleteAllowedDomainAction',
      METHOD: 'DELETE',
      REQUEST: {
        id: domainId
      },
      RESPONSE: {
        success: result.success,
        status: result.status,
        code: result.code,
        error: result.error,
        data: null
      }
    })

    if (result.success) {
      revalidatePath(ADMIN_PANEL_ROUTES.settings)
    }

    return result
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No fue posible eliminar el dominio.'

    console.log({
      endpoint: `/api/super-administrador/dominios-permitidos/${domainId}`,
      action: 'deleteAllowedDomainAction',
      METHOD: 'DELETE',
      REQUEST: {
        id: domainId
      },
      RESPONSE: {
        success: false,
        status: 500,
        code: 'super_administrador.dominios_permitidos.eliminar.error_interno',
        error: message,
        data: null
      }
    })

    return {
      success: false,
      error: message,
      code: 'super_administrador.dominios_permitidos.eliminar.error_interno',
      status: 500
    }
  }
}
