'use server'

import { createServerAdminPanelSource } from '../../data-access'
import type { IAdminPanelCommandResult } from '../../models/AdminPanel'

export async function deleteAllowedDomainAction(
  domainId: number
): Promise<IAdminPanelCommandResult> {
  const source = await createServerAdminPanelSource()
  return source.deleteAllowedDomain(domainId)
}
