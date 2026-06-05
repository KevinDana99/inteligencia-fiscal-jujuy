export function parseCrossManagementDate(dateLabel: string) {
  const [day, month, year] = dateLabel.split('/').map(Number)

  return new Date(year, month - 1, day).getTime()
}
