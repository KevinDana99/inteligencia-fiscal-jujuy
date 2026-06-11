## 2026-06-04 Dashboard layout loading fallbacks

- Se agregó `app/(private)/PrivateLayoutFallback.tsx` para que el dashboard privado renderice un shell consistente mientras `PrivateLayoutGate` resuelve la sesión.
- El `Suspense` de `app/(private)/layout.tsx` ya no usa `null`; ahora muestra sidebar, navbar y loader central con la misma lógica visual que el admin.
- Se creó `DashboardPageLoader` y se conectó desde `app/(private)/loading.tsx` para que las pantallas privadas reutilicen el mismo loader dentro del layout.

### Validation

- `bun x tsc --noEmit`
- `bun x eslint 'app/(private)/layout.tsx' 'app/(private)/PrivateLayoutFallback.tsx' 'app/(private)/loading.tsx' 'src/modules/dashboard-layout/presentation/components/DashboardPageLoader/index.tsx'`

## 2026-06-06 Dashboard navbar and sidebar cleanup

- Se quitaron los skeletons de acciones del navbar en `PrivateLayoutFallback`.
- Se movieron secciones, grupos, rutas, labels e iconos del dashboard a constantes reutilizables.
- Se reemplazaron comparaciones contra strings literales por constantes de `dashboard-layout/constants`.
- Se dividió `DashboardSidebar` en subcomponentes de marca, navegación, grupo, item y footer.
- Se ajustaron props inline del módulo a interfaces explícitas.
- Se cambió la navegación mobile a un drawer lateral con botón menú, overlay, cierre con Escape/click externo y contenido principal atenuado detrás.

### Validation

- `bun x tsc --noEmit --incremental false`
- `bun x eslint 'app/(private)/PrivateLayoutFallback.tsx' 'src/modules/dashboard-layout/constants/dashboardLayout.ts' 'src/modules/dashboard-layout/constants/index.ts' 'src/modules/dashboard-layout/data/models/DashboardLayout.ts' 'src/modules/dashboard-layout/presentation/hooks/useDashboardLayoutShell.ts' 'src/modules/dashboard-layout/presentation/components/DashboardLayoutShell/index.tsx' 'src/modules/dashboard-layout/presentation/components/DashboardNavbar/index.tsx' 'src/modules/dashboard-layout/presentation/components/DashboardSidebar/index.tsx' 'src/modules/dashboard-layout/presentation/components/DashboardTemplate/index.tsx' 'src/modules/dashboard-layout/presentation/components/DashboardPagePlaceholder/index.tsx' 'src/modules/dashboard-layout/presentation/contexts/DashboardNavbarActionContext.tsx'`
- `bun run lint` queda sin errores; reporta warnings existentes en `unified-register`.
- `bun run build` queda bloqueado por errores existentes de prerender con `cookies()` en `/reproceso` y `/admin`.
