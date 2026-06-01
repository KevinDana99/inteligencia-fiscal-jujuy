'use server'

import { createServerAdminPanelSource } from '../../data-access'
import type { IAdminPanelCommandResult } from '../../models/AdminPanel'

export async function addAllowedDomainAction(
  domain: string
): Promise<IAdminPanelCommandResult> {
  const source = await createServerAdminPanelSource()
  return source.addAllowedDomain(domain)
}
