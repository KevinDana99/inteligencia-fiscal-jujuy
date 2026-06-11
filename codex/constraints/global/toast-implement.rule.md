# Toast Implement Rules

## Alcance

- Estas reglas aplican a la implementación incremental de las toast definidas en:
  - `codex/specs/global/toast-implement.spec.md`
- Estas reglas complementan:
  - `codex/constraints/global.rule.md`
- Si hubiera conflicto, para esta feature mandan estas reglas específicas.

## Objetivo

- Implementar las toast una por una siguiendo las historias de usuario.
- Cada iteración debe cubrir una sola historia de usuario por vez.
- Después de cada implementación se debe detener el avance para permitir revisión manual antes de continuar con la siguiente toast.

## Base técnica obligatoria

- Todas las toast deben implementarse usando:
  - `src/components/core/toasts/ToastShell/toast.tsx`
- El consumo desde módulos debe realizarse con:
  - `toast.show(message, vars?, options?)`
- No se debe llamar `@mantine/notifications` directamente desde módulos consumidores.

## Catálogo de mensajes

- Los mensajes deben salir del catálogo central de toast en:
  - `src/components/core/toasts/constants/AdminPanel/ToastMessages.ts`
  - `src/components/core/toasts/constants/Dashboard/ToastMessages.ts`
- Los mensajes individuales deben definirse en:
  - `ToastMessagesList.ts`
- Cada mensaje individual debe cumplir esta forma:

```ts
type ToastMessageType = {
  id: string
  status: 'Success' | 'Danger' | 'Info'
  title: string
  description: string
}
```

- `ToastMessages.ts` debe exportar catálogos por sistema.
- Los catálogos deben exponerse mediante named exports.

## Uso desde módulos

- La implementación de cada historia debe consumir la toast desde el catálogo.
- Si el mensaje tiene placeholders, se debe usar el flujo soportado por `toast.show(message, vars)`.
- No se deben hardcodear `title` o `description` dentro de hooks o componentes de los módulos.

## Variables dinámicas

- Los placeholders dinámicos deben resolverse usando el sistema actual de toast.
- No se debe crear una solución ad hoc por módulo para interpolar variables.
- Las keys de variables deben ser consistentes con los placeholders definidos en los mensajes.

## Estado visual y semántico

- El ícono y la semántica visual deben derivarse del `status` del mensaje.
- Los módulos consumidores no deben decidir manualmente el ícono de la toast.
- Los módulos consumidores no deben forzar una variante visual por fuera del catálogo salvo requerimiento explícito.

## Flujo incremental obligatorio

- Implementar solo una historia de usuario por vez.
- Al terminar una historia:
  - informar qué historia quedó implementada
  - qué archivo o flujo fue tocado
  - detenerse para revisión
- No encadenar varias historias en una misma pasada salvo pedido explícito del usuario.

## Historias objetivo

- Dashboard:
  - `T-01` a `T-19`
- Admin-panel:
  - `T-20` a `T-28`

## Restricciones

- No refactorizar módulos no involucrados en la historia activa salvo que sea estrictamente necesario para conectar la toast.
- No rediseñar el sistema global de toast mientras se implementan historias individuales.
- No cambiar naming o estructura del catálogo sin necesidad funcional concreta.
- No avanzar a la siguiente historia sin revisión del usuario.
