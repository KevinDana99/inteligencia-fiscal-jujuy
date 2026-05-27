import { IAuthSession } from '@/modules/auth/types'

function getRoleLabel(role: IAuthSession['user']['role']) {
  return role === 'admin' ? 'Administrador' : 'Analista Fiscal'
}

export default getRoleLabel
