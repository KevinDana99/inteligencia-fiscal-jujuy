export function getInitials(name: string): string {
  const [firstName = '', lastName = ''] = name.trim().split(/\s+/, 2)

  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
