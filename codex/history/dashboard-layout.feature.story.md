## 2026-06-04 Dashboard layout loading fallbacks

- Se agregó `app/(private)/PrivateLayoutFallback.tsx` para que el dashboard privado renderice un shell consistente mientras `PrivateLayoutGate` resuelve la sesión.
- El `Suspense` de `app/(private)/layout.tsx` ya no usa `null`; ahora muestra sidebar, navbar y loader central con la misma lógica visual que el admin.
- Se creó `DashboardPageLoader` y se conectó desde `app/(private)/loading.tsx` para que las pantallas privadas reutilicen el mismo loader dentro del layout.

### Validation

- `bun x tsc --noEmit`
- `bun x eslint 'app/(private)/layout.tsx' 'app/(private)/PrivateLayoutFallback.tsx' 'app/(private)/loading.tsx' 'src/modules/dashboard-layout/presentation/components/DashboardPageLoader/index.tsx'`
