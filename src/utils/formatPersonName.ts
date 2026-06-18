export function formatPersonName(value?: string | null) {
  return value
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ') ?? ''
}

