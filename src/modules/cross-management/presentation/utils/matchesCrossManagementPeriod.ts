interface MatchesCrossManagementPeriodParams {
  itemPeriod: string
  selectedPeriod: string
}

export function matchesCrossManagementPeriod({
  itemPeriod,
  selectedPeriod
}: MatchesCrossManagementPeriodParams) {
  if (!selectedPeriod) {
    return true
  }

  return itemPeriod.includes(selectedPeriod)
}
