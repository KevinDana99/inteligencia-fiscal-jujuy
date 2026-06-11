Implement the `Modal Generacion Exportables` described in `codex/specs/dashboard/intimation-modal.spec.md` and constrained by `codex/constraints/dashboard/intimation-modal.rule.md`.

Requirements:

1. Build the second modal in the `cross-management` flow opened from the `Siguiente` CTA of the intimation configuration modal.
2. Do not close the first modal when opening this modal.
3. Keep the intimation configuration state intact and reuse it as the temporary source of truth.
4. Use Mantine UI for structure and interaction. Use CSS Modules only for precise styling not covered by Mantine props.
5. Prepare the preview area around `embedpdf` headless integration, but for this stage use a mock/placeholder implementation because contracts are still pending.
6. Treat PDF and DOCX as backend-generated artifacts:
   - frontend does not generate documents
   - frontend only previews PDF and triggers downloads
7. Show a paginated preview by active contributor inside the lot.
8. `Descargar PDF` and `Descargar Word` must represent lot-level actions.
9. Include loading/error-ready state structure so the mock can later be replaced by real server actions without rewriting the modal.

Implementation notes:

- Keep the implementation scoped to `cross-management` for now.
- Do not introduce the exportables config provider yet.
- Do not install or integrate a frontend DOCX generation library.
- Prefer a reusable component boundary so the future provider/contracts can be wired in one place.
