export function splitAdminPanelUserFullName(fullName?: string | null) {
  const [firstName = '', ...lastNameParts] = fullName?.split(' ') ?? []

  return {
    firstName,
    lastName: lastNameParts.join(' ')
  }
}
