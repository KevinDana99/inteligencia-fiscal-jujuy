import { EXPLORER_REGISTER_TEXTS } from '../../../constants';
import type { ExplorerRegisterController } from '../types';
import { ExplorerRegisterFallbackCard } from './ExplorerRegisterFallbackCard';
import { ExplorerRegisterResultsTable } from './ExplorerRegisterResultsTable';

export function ExplorerRegisterResultsSection({
  controller
}: {
  controller: ExplorerRegisterController;
}) {
  if (
    controller.hasSearched &&
    controller.result &&
    controller.result.rows.length > 0
  ) {
    return <ExplorerRegisterResultsTable controller={controller} />;
  }

  if (controller.hasSearched) {
    return (
      <ExplorerRegisterFallbackCard
        message={EXPLORER_REGISTER_TEXTS.emptyFallback}
      />
    );
  }

  return (
    <ExplorerRegisterFallbackCard
      message={
        controller.hasCatalog
          ? EXPLORER_REGISTER_TEXTS.initialFallback
          : EXPLORER_REGISTER_TEXTS.catalogFallback
      }
    />
  );
}
