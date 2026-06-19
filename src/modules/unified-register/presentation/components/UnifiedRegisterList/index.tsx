'use client';

import type { IUnifiedRegisterBatchOption } from '../../../data/models/UnifiedRegister';
import type { IUnifiedRegisterItems } from '../../../data/models/UnifiedRegister';
import { UnifiedRegisterCard } from '../UnifiedRegisterCard';
import classes from '../UnifiedRegisterPage/UnifiedRegisterPage.module.css';

interface UnifiedRegisterListProps {
  items: IUnifiedRegisterItems;
  selectedBatchItemId: string | null;
  batchSearch: string;
  filteredLotOptions: IUnifiedRegisterBatchOption[];
  batchOptionsError: string | null;
  isBatchOptionsPending: boolean;
  onCloseBatchDropdown: () => void;
  onBatchSearchChange: (value: string) => void;
  onSelectLotOption: (lot: IUnifiedRegisterBatchOption) => void;
  onAddToBatch: (item: IUnifiedRegisterItems[number]) => void;
  onMarkReprocessing: (item: IUnifiedRegisterItems[number]) => void;
}

export function UnifiedRegisterList({
  items,
  selectedBatchItemId,
  batchSearch,
  filteredLotOptions,
  batchOptionsError,
  isBatchOptionsPending,
  onCloseBatchDropdown,
  onBatchSearchChange,
  onSelectLotOption,
  onAddToBatch,
  onMarkReprocessing
}: UnifiedRegisterListProps) {
  return (
    <div className={classes.cards}>
      {items.map((item) => (
        <UnifiedRegisterCard
          key={item.contribuyenteId}
          item={item}
          isBatchDropdownOpen={selectedBatchItemId === item.contribuyenteId}
          batchSearch={batchSearch}
          filteredLotOptions={filteredLotOptions}
          batchOptionsError={batchOptionsError}
          isBatchOptionsPending={isBatchOptionsPending}
          onCloseBatchDropdown={onCloseBatchDropdown}
          onBatchSearchChange={onBatchSearchChange}
          onSelectLotOption={onSelectLotOption}
          onAddToBatch={onAddToBatch}
          onMarkReprocessing={onMarkReprocessing}
        />
      ))}
    </div>
  );
}
