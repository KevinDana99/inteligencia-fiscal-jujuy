import { USER_ROLES } from '@/lib/auth/constants'
import { IAuthSession } from '@/modules/auth/types'

function getRoleLabel(userType: IAuthSession['user']['tipoUsuario']) {
  if (userType === USER_ROLES.ADMIN) {
    return 'Super Administrador'
  }

  if (userType === USER_ROLES.FISCAL_ANALYST) {
    return 'Analista Fiscal'
  }

  return 'Usuario'
}

export default getRoleLabel
