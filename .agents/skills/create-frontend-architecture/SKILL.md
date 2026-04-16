---
name: create-frontend-architecture
description: Core guide for develop kamakia frontend development apps based on Next.js 16+, Server Components, Cache Components, routes, data fetching and React hooks logic and code.
---

# Basic Guide

Basic rules for frontend development of KamakIA apps.

## When to Use This Skill

- Building new React Modules
- Building new React Components to implement inside a module
- Implementing Server Components and streaming
- Optimizing data fetching and caching with cache components

## Core concepts

- **Required package manager / runtime**: Bun
  - Use `bun install`, `bun add`, `bun run`
  - Do NOT use npm, yarn, or pnpm

- **Framework**: Next.js 16+ (App Router)

- **Required UI library**: Mantine
  - Use components from `@mantine/core` for all UI
  - Avoid unnecessary custom CSS or external UI libraries
  - Prefer:
    - `Card`, `Stack`, `Group` → layout
    - `Text`, `Title` → typography
    - `Button`, `Input` → interaction

- **Providers**:
  - The app must be wrapped with `MantineProvider` in `app/layout.tsx`

- **Rules**:
  - Do not build UI without Mantine
  - Do not mix multiple UI libraries
  - Maintain visual consistency using Mantine

### Basic folder convention

### 1. Basic folder convention

Inside src/components/modules

```
src/modules/<module-name>/
├── index.tsx                    # Entry: async server component + withSuspense
├── types.ts                     # Re-exports of models + component props
├── data/
│   ├── data-access.ts           # createServerExampleSource(), mock vs REST by env
│   ├── interfaces/              # Ports (query + command)
│   ├── models/                  # Domain DTOs (I*)
│   ├── actions/
│   │   ├── index.ts             # export queries + commands
│   │   ├── queries/             # getXxxAction (unstable_cache, tags)
│   │   └── commands/            # updateExampleAction (revalidateTag)
│   └── sources/
│       ├── rest/
│       │   ├── cache/cacheConfig.ts
│       │   ├── dtos/            # Api* (API format)
│       │   ├── mappers/         # Api* → models
│       │   └── RestXxxSource.ts
│       └── mock/
│           ├── fixtures/
│           └── MockXxxSource.ts
└── presentation/
    ├── index.ts                 # export * from './hooks'
    ├── contexts/                # createContext + useExampleContext
    ├── hooks/                   # the hooks can never return a JSX, is only funcionality
    │   ├── index.ts             # queries, mutations, utils
    │   ├── mutations/           # useServerAction + action from data layer
    │   ├── queries/
    │   └── utils/
    ├── components/              # By component: index.tsx, styled.ts, useExample.ts - Any functional logic must go in a hook, except logic related to render a component
    └── utils/
```

### 2. Entry module config

1. Create the module structure
2. **Define domain models** in `data/models/`
3. **Create the source interface** in `data/interfaces/`
4. **Implement REST source** in `data/sources/rest/`
5. **Create server actions** in `data/actions/`
6. **Build presentation components** in `presentation/components/`
7. **Create custom hooks** in `presentation/hooks/`

### 3. Naming Conventions

| Type           | Convention               | Example                                   |
| -------------- | ------------------------ | ----------------------------------------- |
| Domain Models  | `I` prefix               | `IOptionalItem`                           |
| Array Types    | Extend `Array<T>`        | `IOptionals extends Array<IOptionalItem>` |
| DTOs           | `Api` prefix             | `ApiOptionalDto`                          |
| Mappers        | `map` prefix             | `mapOptionalDto`                          |
| Server Actions | `Action` suffix          | `getOptionalsModuleAction`                |
| Hooks          | `use` prefix             | `useOptionalGroup`                        |
| Contexts       | `Context` suffix         | `OptionalCardContext`                     |
| Context Hooks  | `use` + `Context` suffix | `useOptionalCardContext`                  |
| Cache Tags     | Upper case constants     | `CACHE_TAGS.MODULE_DATA`                  |

## Key Patterns

### Port/Adapter Pattern

Define interface in `data/interfaces/`:

```typescript
interface IModuleSource extends IModuleQueryPort, IModuleCommandPort {}

interface IModuleQueryPort {
  getModuleData(params): Promise<IModuleDto>
}

interface IModuleCommandPort {
  updateData(params): Promise<ICommandResult>
}
```

Implement in `data/sources/rest/RestModuleSource.ts` and `data/sources/mock/MockModuleSource.ts`.

### Server Actions with Caching

**Query with cache** (`data/actions/queries/`):

```typescript
'use server';

import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function getModuleAction(params) {
  const getCachedData = unstable_cache(
    () => fetchData(params),
    [CACHE_TAGS.MODULE_DATA(params.id)],
    { tags: [CACHE_TAGS.MODULE_DATA(params.id)], revalidate: ... }
  );
  return await getCachedData();
}
```

**Command with cache invalidation** (`data/actions/commands/`):

```typescript
'use server'

export async function updateDataAction(params) {
  const result = await source.updateData(params)
  if (result.success) {
    revalidateTag(CACHE_TAGS.MODULE_DATA(params.id))
  }
  return result
}
```

### Custom Hooks Pattern

**Query hook** (`presentation/hooks/queries/`):

```typescript
export function useModuleData(id: string) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getModuleAction({ id })
      setData(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}
```

**Mutation hook** (`presentation/hooks/mutations/`):

```typescript
export function useUpdateData(options) {
  const { execute, isPending, error } = useServerAction(action, options)
  return { updateData: execute, isPending, error }
}
```

### Component with Hook Pattern

```typescript
// Component
const ModuleCard = ({ props }) => {
  const { state, handlers } = useModuleCard(props);
  return <JSX />;
};

// Hook
const useModuleCard = (props) => {
  // Logic here
  return { state, handlers };
};
```

## Cache Configuration

Define cache tags in `data/sources/rest/cache/cacheConfig.ts`:

```typescript
export const CACHE_TAGS = {
  MODULE_DATA: (id: string) => `module-${id}`,
  ITEM_DATA: (id: string, itemId: number) => `module-${id}-item-${itemId}`
}

export const CACHE_REVALIDATE = {
  MODULE_DATA: '1h',
  ITEM_DATA: '30m'
}
```

## Data Access Factory

Create `data/data-access.ts`:

```typescript
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { ApiClientConfig } from '@/lib/api-client'

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_MODULE === 'true'
}

export async function createServerModuleSource(): Promise<IModuleSource> {
  if (isMockEnabled()) {
    return new MockModuleSource()
  }

  const session = await getServerSession(authOptions)
  const token = session?.user?.token

  if (!token) {
    throw new Error('No authentication token available')
  }

  const cookiesStore = cookies()
  const config: ApiClientConfig = { token, cookiesStore }

  return new RestModuleSource(config)
}
```

## Module Entry Point

Create `index.tsx`:

```typescript
import withSuspense from '@components/core/with-suspense';
import ModuleCard from './presentation/components/ModuleCard';
import { ModuleProps } from './types';
import { getModuleAction } from './data/actions';

async function Module({ id }: ModuleProps) {
  const { data, error } = await getModuleAction({ id });

  if (error) {
    return <ErrorComponent error={new Error(error)} />;
  }

  if (!data) {
    return <ErrorComponent error={new Error('No data received')} />;
  }

  return <ModuleCard data={data} id={id} />;
}

const Loading = () => <div>Loading...</div>;

const ErrorComponent = ({ error }: { error: Error }) => (
  <div>Error: {error?.message}</div>
);

export default withSuspense(Module, <Loading />);
```

## Error Handling

- **Server Actions**: Return `{ data, error }` or `ICommandResult`
- **Hooks**: Expose `error` state to components
- **Components**: Display error messages or retry options

## Testing Guidelines

- Use `MockModuleSource` for unit tests
- Create fixtures in `fixtures/` for different scenarios
- Mock delay configurable via constructor

## When Adding New Features

1. Add domain model in `data/models/`
2. Add DTO in `data/sources/rest/dtos/`
3. Add mapper in `data/sources/rest/mappers/`
4. Update interface in `data/interfaces/`
5. Implement in REST source
6. Implement in Mock source
7. Create server action in `data/actions/`
8. Create custom hook in `presentation/hooks/`
9. Add/update component in `presentation/components/`
10. Update types in `types.ts` if needed
11. Add cache tags in `cacheConfig.ts` if needed
