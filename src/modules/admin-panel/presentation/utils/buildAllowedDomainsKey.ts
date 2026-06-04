import type { IAdminAllowedDomains } from '../../data/models/AdminPanel'

export function buildAllowedDomainsKey(allowedDomains: IAdminAllowedDomains) {
  return allowedDomains
    .map((domain) => `${domain.id}:${domain.domain}`)
    .join('|')
}
