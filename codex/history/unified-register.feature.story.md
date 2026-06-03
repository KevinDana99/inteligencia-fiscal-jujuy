# Unified Register Feature Story

## Summary

Refactored the main `Padrón Unificado` presentation logic so the listing page delegates search and page state to hooks instead of keeping handler logic inline.

## Main Changes

- Converted the previous generic register hook into a search-focused hook, `useUnifiedRegisterSearch`.
- Added `useUnifiedRegisterPage` to compose the mock data source, search fields, filtered results, change handler, and result state for the page.
- Updated `UnifiedRegisterPage` to consume the page hook and keep the component focused on rendering Mantine UI.
- Added the supplied visual token values to the Mantine theme and wired a custom `Pagination` treatment through component configuration and Mantine variables.
- Configured the selected page item to match the supplied active button weight and shadow, and rendered previous/next controls as textual arrows instead of Mantine's default scaled SVG icon box.
- Rendered the Mantine `Pagination` control below the unified register cards with the requested `‹`, `›`, and `…` controls.

## Rules Followed

- Preserved local reactive filtering over mock data.
- Kept search constrained to `CUIT` and `razón social`.
- Maintained the empty state text required by the feature spec.
- Kept data and presentation responsibilities separated inside `src/modules/unified-register/`.
- Kept the pagination visual work on Mantine `Pagination` instead of custom button markup.

## Validation

- `bun x eslint src/modules/unified-register/presentation/hooks/useUnifiedRegister.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage.ts src/modules/unified-register/presentation/components/UnifiedRegisterPage/index.tsx`
- `bun x eslint src/theme.ts src/modules/unified-register/presentation/hooks/useUnifiedRegister.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage.ts src/modules/unified-register/presentation/components/UnifiedRegisterPage/index.tsx`
- `git diff --check`
- SSR verification on `http://localhost:3001/`: authenticated HTML includes active item `font-weight:700`, `box-shadow:0 1px 4px rgba(0,0,0,.12)`, textual `‹/›`, and no `if-pagination` classes.

## Notes

- `bun run lint` and `bun x tsc --noEmit --pretty false` still fail globally due to existing issues in other modules and in `useUnifiedRegisterPreview`.
- CSS files are ignored by the current ESLint configuration when passed directly.
