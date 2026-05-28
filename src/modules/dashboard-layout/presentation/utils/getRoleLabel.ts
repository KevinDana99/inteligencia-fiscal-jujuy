import { IAuthSession } from '@/modules/auth/types'

function getRoleLabel(userType: IAuthSession['user']['tipoUsuario']) {
  if (userType === 'SUPER_ADMIN') {
    return 'Super Administrador'
  }

  if (userType === 'ANALISTA_FISCAL') {
    return 'Analista Fiscal'
  }

  return 'Usuario'
}

export default getRoleLabel
