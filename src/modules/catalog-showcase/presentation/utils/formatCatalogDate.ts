export function formatCatalogDate(value: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'long'
  }).format(new Date(value));
}
