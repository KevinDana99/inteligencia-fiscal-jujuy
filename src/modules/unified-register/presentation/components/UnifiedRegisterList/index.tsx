'use client';

import type { IUnifiedRegisterItems } from '../../../data/models/UnifiedRegister';
import { UnifiedRegisterCard } from '../UnifiedRegisterCard';
import classes from '../UnifiedRegisterPage/UnifiedRegisterPage.module.css';

interface UnifiedRegisterListProps {
  items: IUnifiedRegisterItems;
}

export function UnifiedRegisterList({ items }: UnifiedRegisterListProps) {
  return (
    <div className={classes.cards}>
      {items.map((item) => (
        <UnifiedRegisterCard key={item.contribuyenteId} item={item} />
      ))}
    </div>
  );
}
