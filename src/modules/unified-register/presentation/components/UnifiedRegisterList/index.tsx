'use client';

import type { IUnifiedRegisterItems } from '../../../data/models/UnifiedRegister';
import { UnifiedRegisterCard } from '../UnifiedRegisterCard';
import classes from '../UnifiedRegisterPage/UnifiedRegisterPage.module.css';

interface UnifiedRegisterListProps {
  items: IUnifiedRegisterItems;
  onAddToBatch: (item: IUnifiedRegisterItems[number]) => void;
  onMarkReprocessing: (item: IUnifiedRegisterItems[number]) => void;
}

export function UnifiedRegisterList({
  items,
  onAddToBatch,
  onMarkReprocessing
}: UnifiedRegisterListProps) {
  return (
    <div className={classes.cards}>
      {items.map((item) => (
        <UnifiedRegisterCard
          key={item.contribuyenteId}
          item={item}
          onAddToBatch={onAddToBatch}
          onMarkReprocessing={onMarkReprocessing}
        />
      ))}
    </div>
  );
}
