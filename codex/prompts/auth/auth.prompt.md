# Auth Implementation Prompt

## Objetivo

Implementar la feature de autenticación respetando:

- `codex/specs/auth.spec.md`
- `codex/constraints/auth.rule.md`
- `codex/constraints/global.rule.md`
- la arquitectura definida por `create-frontend-architecture`

La implementación debe construir una base reusable de auth para el proyecto y dejarla lista para proteger rutas privadas y consumir APIs autenticadas.

## Contexto Actual del Proyecto

- El proyecto usa `Next.js 16` con `App Router`.
- `app/layout.tsx` ya monta `src/components/core/providers.tsx`.
- `src/components/core/providers.tsx` actualmente solo envuelve la app con `MantineProvider`.
- `src/lib/api-client.ts` ya soporta `token` en `ApiClientConfig`.
- El módulo `auth` ya existe bajo `src/modules/auth`.
- La protección de rutas ya usa `proxy.ts`.
- El ejemplo de arquitectura vigente es `src/modules/catalog-showcase`.

## Suposiciones Operativas

Para esta implementación se debe asumir:

- la ruta pública de login será `app/(auth)/login/page.tsx`
- existirá un grupo de rutas privadas como `app/(private)/...`
- la redirección por defecto después de login irá al área privada principal o a `/`
- los tokens IAM se persistirán en cookies de Next desde el servidor

Si durante la implementación aparece una contradicción con el spec o con el árbol real de rutas, primero debe alinearse el contrato documental y luego el código.

## Resultado Esperado

Al finalizar, el proyecto debe contar con:

- proxy de protección de rutas privadas
- login funcional con `correo` y `contrasena`
- persistencia de sesión en cookies
- renovación de sesión con `refrescarToken`
- logout con limpieza local y cierre remoto cuando aplique
- helpers reutilizables de sesión server-side
- módulo `src/modules/auth`
- página de login en App Router
- ruta especial placeholder para administración en `app/(private)/admin`
- integración básica para que otros módulos puedan consumir el token autenticado

## Estructura Objetivo

### App Router

```text
app/
├── (auth)/
│   └── login/
│       └── page.tsx
├── (private)/
│   └── layout.tsx
└── ...
```

### Auth Library and Module

```text
src/lib/auth/
├── constants.ts
├── cookies.ts
├── get-server-session.ts
├── require-session.ts
├── refresh-session.ts
└── session-mapper.ts

src/modules/auth/
├── index.tsx
├── types.ts
├── data/
│   ├── data-access.ts
│   ├── interfaces/
│   │   └── AuthSource.ts
│   ├── models/
│   │   └── Auth.ts
│   ├── actions/
│   │   ├── index.ts
│   │   ├── queries/
│   │   │   └── getAuthSessionAction.ts
│   │   └── commands/
│   │       ├── signInAction.ts
│   │       ├── signOutAction.ts
│   │       └── refreshAuthSessionAction.ts
│   └── sources/
│       ├── rest/
│       │   ├── cache/
│       │   │   └── cacheConfig.ts
│       │   ├── dtos/
│       │   ├── mappers/
│       │   └── RestAuthSource.ts
│       └── mock/
│           └── MockAuthSource.ts
└── presentation/
    ├── index.ts
    ├── hooks/
    │   ├── index.ts
    │   ├── queries/
    │   │   └── useAuthSession.ts
    │   └── mutations/
    │       ├── useSignIn.ts
    │       └── useSignOut.ts
    └── components/
        ├── LoginForm/
        │   ├── index.tsx
        │   └── useLoginForm.ts
        └── UserSessionMenu/
            └── index.tsx
```

## Reglas de Implementación

1. No usar `localStorage` ni `sessionStorage` para persistir auth.
2. No llamar endpoints IAM directamente desde componentes de UI.
3. No exponer tokens IAM crudos a presentation si no es necesario.
4. Mantener en inglés todos los nombres de archivos, funciones, tipos y componentes fuera de `codex/`.
5. Usar Mantine para la UI de login y cualquier control de sesión.
6. Mantener la lógica de auth del lado servidor siempre que Next lo permita.
7. Mapear los contratos IAM externos a modelos internos antes de llegar a hooks o componentes.

## Contratos a Implementar

### Contratos Externos IAM

Implementar soporte para:

- `POST /api/iam/autenticacion/inicio-sesion`
- `POST /api/iam/autenticacion/renovar-sesion`
- `POST /api/iam/autenticacion/cerrar-sesion`

### Contratos Internos de Dominio

Definir como mínimo en `src/modules/auth/data/models/Auth.ts`:

- `IAuthUser`
- `IAuthSession`
- `IIamSignInRequest`
- `IIamSessionResponse`
- `IIamRefreshSessionRequest`
- `ICommandResult`
- `IModuleQueryResult<T>`

La forma interna debe derivarse del contrato IAM, pero no copiarse directamente en presentation.

## Implementación por Etapas

### Etapa 1. Base server-side de sesión

Crear en `src/lib/auth/`:

- constantes de nombres de cookies
- helpers para leer cookies
- helper para escribir cookies de sesión
- helper para limpiar cookies
- helper para resolver la sesión actual
- helper para determinar si una sesión sigue válida

Objetivo:

- centralizar la persistencia y lectura de sesión
- evitar que la lógica de cookies quede dispersa en actions y proxy

### Etapa 2. Modelos, interfaces y mappers

Crear:

- `src/modules/auth/data/models/Auth.ts`
- `src/modules/auth/data/interfaces/AuthSource.ts`
- DTOs IAM en `src/modules/auth/data/sources/rest/dtos/`
- mappers en `src/modules/auth/data/sources/rest/mappers/`

Objetivo:

- desacoplar el contrato del backend del resto de la app
- dejar el dominio de auth explícito antes de implementar el source REST

### Etapa 3. Fuente REST y data-access

Implementar:

- `RestAuthSource`
- `MockAuthSource`
- `data/data-access.ts`

`RestAuthSource` debe:

- iniciar sesión
- renovar sesión
- cerrar sesión
- resolver el usuario autenticado desde cookies o estado server-side cuando corresponda

`data-access.ts` debe:

- decidir si usar mock o REST
- exponer una única entrada server-side para obtener `IAuthSource`
- exponer un entorno mock con al menos:
  - un usuario normal
  - un usuario `admin`

### Etapa 4. Server actions

Crear:

- `getAuthSessionAction`
- `signInAction`
- `signOutAction`
- `refreshAuthSessionAction`

Reglas:

- las query actions devuelven `{ data, error }`
- las command actions devuelven `ICommandResult` o un result específico
- el login debe persistir cookies
- el logout debe limpiar cookies
- el refresh debe reemplazar los tokens previos

### Etapa 5. Proxy

Crear `proxy.ts`.

Responsabilidades:

- identificar si la ruta solicitada es pública o privada
- permitir acceso libre a `app/(auth)/login`
- redirigir a login si la ruta es privada y no hay sesión válida
- si existe sesión expirada pero `refrescarToken` aún es renovable, intentar refresh según la estrategia definida
- evitar loops de redirección

Importante:

- si el refresh automático en proxy complica demasiado el primer corte, se puede dejar como estrategia controlada por helpers server-side, pero el comportamiento final debe seguir el spec

### Etapa 6. UI y hooks

Crear:

- `LoginForm`
- `useLoginForm`
- `useSignIn`
- `useSignOut`
- `useAuthSession`

La UI debe usar Mantine:

- `Card`
- `Stack`
- `TextInput`
- `PasswordInput`
- `Button`
- `Alert`
- `Text`
- `Title`

Requisitos de UX:

- `correo` requerido
- `contrasena` requerida
- submit deshabilitado mientras el request está pendiente
- mensaje claro para credenciales inválidas
- mensaje genérico para error técnico

Credenciales mock mínimas esperadas:

- normal user:
  - `correo`: `user@plantilla.local`
  - `contrasena`: `ChangeMe123!`
- admin:
  - `correo`: `admin@plantilla.local`
  - `contrasena`: `ChangeMe123!`

### Etapa 7. Rutas App Router

Crear:

- `app/(auth)/login/page.tsx`
- `app/(private)/layout.tsx`
- `app/(private)/admin/page.tsx`

`app/(auth)/login/page.tsx` debe:

- renderizar la UI de login
- redirigir al área privada si ya existe sesión válida

`app/(private)/layout.tsx` debe:

- validar la sesión para todo el segmento privado
- evitar renderizar hijos si no hay sesión válida

`app/(private)/admin/page.tsx` debe:

- existir como placeholder de la futura administración de usuarios
- requerir rol `admin`
- redirigir a `app/(auth)/login` si el usuario autenticado no tiene el rol requerido
- mantener la sesión activa cuando la redirección sea por falta de rol y no por falta de autenticación
- resolver la intención de elevación a `admin` sin ensuciar la URL de login con query params visibles

### Etapa 8. Integración con otros módulos

Actualizar gradualmente los módulos que hoy dependan de tokens fijos por env para que puedan usar el token de la sesión autenticada.

La primera referencia a revisar es:

- `src/modules/catalog-showcase/data/data-access.ts`

Objetivo:

- permitir que los módulos de negocio consuman APIs protegidas con la sesión activa del usuario

## Orden de Ejecución

Implementar en este orden:

1. `src/lib/auth/*`
2. `src/modules/auth/data/models/*`
3. `src/modules/auth/data/interfaces/*`
4. DTOs y mappers REST
5. `RestAuthSource` y `MockAuthSource`
6. `data-access.ts`
7. server actions
8. `proxy.ts`
9. hooks y componentes de presentation
10. `app/(auth)/login/page.tsx`
11. `app/(private)/layout.tsx`
12. integración mínima con un módulo existente

## Verificación

Validar como mínimo:

1. usuario anónimo puede entrar a `app/(auth)/login`
2. login exitoso crea cookies válidas
3. login inválido no crea sesión
4. usuario autenticado no queda atrapado en login
5. ruta privada redirige al login cuando no hay sesión válida
6. logout limpia sesión y corta acceso privado
7. refresh exitoso mantiene acceso
8. refresh fallido deriva en estado `unauthenticated`
9. usuario normal no puede entrar a `/admin`
10. `admin` sí puede entrar a `/admin`
11. usuario autenticado sin rol `admin` es redirigido a `/login` sin logout
12. la redirección a `/login` desde `/admin` ocurre con URL limpia

## Entregables

La implementación debe dejar como mínimo:

- proxy operativo
- módulo `src/modules/auth`
- helpers server-side de sesión
- página de login
- layout privado protegido
- integración básica con `api-client`

## Cierre

Una vez terminada la implementación:

- registrar los cambios en `codex/history/auth.feature.story.md`
