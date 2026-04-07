# Module Template

Plantilla reusable para crear un módulo con la arquitectura de KamakIA y la convención de caché de Next 16.

## Regla operativa

- Toda lectura server estable debe usar `use cache`
- Después de `use cache`, llamar `applyServerCache(...)`
- Toda mutación que afecte datos cacheados debe invalidar con `revalidateServerCache(...)`
- `data-access.ts` no debe cachearse si lee cookies, headers, tokens de sesión o request state

## Tokens a reemplazar

- `__MODULE_NAME__`
- `__MODULE_NAME_PASCAL__`
- `__ENTITY_NAME__`
- `__ENTITY_NAME_PASCAL__`
- `__CACHE_TAG_PREFIX__`

## Copiar

Copiá esta carpeta a `src/modules/<module-name>/` y luego reemplazá los tokens.
