# Cache Convention

Para lecturas server:

```ts
async function getCachedThing(params: Params) {
  'use cache'
  applyServerCache(CACHE_REVALIDATE.THING, CACHE_TAGS.THING(params.id))
  return source.getThing(params)
}
```

Para mutaciones:

```ts
if (result.success) {
  revalidateServerCache(CACHE_TAGS.THING(params.id))
}
```
