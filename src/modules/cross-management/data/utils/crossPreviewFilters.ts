import type {
  ICrossColumnFilters,
  ICrossResumenColumnFilter
} from '../models/CrossManagement'

export function mapCrossColumnFiltersToResumenRequest(
  filters: ICrossColumnFilters
): ICrossResumenColumnFilter[] {
  return Object.entries(filters).flatMap(([field, filter]) => {
    if (!filter) {
      return []
    }

    const conditions = [filter.primary, filter.secondary].flatMap((condition) =>
      condition.operator && condition.value.trim()
        ? [
            {
              operator: condition.operator,
              value: condition.value.trim()
            }
          ]
        : []
    )

    if (!conditions.length) {
      return []
    }

    return [
      {
        field,
        connector: filter.connector,
        conditions
      }
    ]
  })
}
