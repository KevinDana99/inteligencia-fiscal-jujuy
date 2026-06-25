import type {
  ICrossColumnFilters,
  ICrossFilterOperator,
  ICrossResumenColumnFilter
} from '../models/CrossManagement'

const VALUELESS_FILTER_OPERATORS = new Set<ICrossFilterOperator>([
  'esNulo',
  'noEsNulo'
])

export function mapCrossColumnFiltersToResumenRequest(
  filters: ICrossColumnFilters
): ICrossResumenColumnFilter[] {
  return Object.entries(filters).flatMap(([field, filter]) => {
    if (!filter) {
      return []
    }

    const conditions = [filter.primary, filter.secondary].flatMap((condition) =>
      condition.operator &&
      (condition.value.trim() || VALUELESS_FILTER_OPERATORS.has(condition.operator))
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
