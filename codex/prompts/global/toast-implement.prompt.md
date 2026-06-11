# Toast Implement Prompt

Implementar las toast del proyecto de forma incremental, una historia de usuario por vez, siguiendo:

- `codex/specs/global/toast-implement.spec.md`
- `codex/constraints/global/toast-implement.rule.md`
- `codex/constraints/global.rule.md`

## Objetivo

Conectar cada historia de usuario a una toast real del sistema global, usando el catálogo central de mensajes y el helper `toast.show(...)`.

## Forma de trabajo

1. Tomar una sola historia de usuario activa.
2. Identificar el flujo real donde debe dispararse la toast.
3. Reutilizar el mensaje existente del catálogo o agregarlo si falta.
4. Conectar el flujo del módulo a:

```ts
toast.show(MESSAGE, vars?)
```

5. Mantener el cambio acotado a la historia activa.
6. Al terminar, informar:
   - historia implementada
   - archivos tocados
   - punto exacto del flujo donde se dispara
7. Detenerse para revisión del usuario antes de continuar con la siguiente historia.

## Reglas de implementación

- No hardcodear títulos ni descripciones en módulos consumidores.
- Consumir mensajes desde:
  - `src/components/core/toasts/constants/AdminPanel/ToastMessages.ts`
  - `src/components/core/toasts/constants/Dashboard/ToastMessages.ts`
- Si el mensaje requiere variables dinámicas, usar:
  - `toast.show(message, vars)`
- No llamar `notifications.show(...)` directamente desde features.
- No modificar la UI del sistema global de toast salvo que la historia activa lo requiera explícitamente.

## Convenciones de uso

### Mensaje sin variables

```ts
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts'

toast.show(TOAST_DASHBOARD_MESSAGES.UPDATE_CONFIGURATION_SUCCESS)
```

### Mensaje con variables

```ts
import { TOAST_ADMIN_MESSAGES, toast } from '@/components/core/toasts'

toast.show(TOAST_ADMIN_MESSAGES.ADD_DOMAIN_SUCCESS, {
  domain: '@pepit.com'
})
```

## Criterio de alcance

- Tocar solo el módulo y el flujo que correspondan a la historia activa.
- Si una historia depende de una action, hook o handler compartido, editar lo mínimo necesario para inyectar la toast sin reestructurar otras features.

## Orden sugerido

Seguir las historias en el orden del spec, salvo que el usuario pida una puntual:

- `T-01` a `T-19` para `Dashboard`
- `T-20` a `T-28` para `Admin-panel`

## Resultado esperado por iteración

Cada iteración debe dejar:

- una historia conectada a una toast real
- sin strings hardcodeados en el módulo
- usando el catálogo y el sistema global actual
- lista para revisión manual antes de pasar a la siguiente
