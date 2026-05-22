'use client';

import { useMemo, useState, useTransition } from 'react';
import { markReprocessingAction } from '@/modules/reprocessing/data/actions';
import type { IUnifiedRegisterItems } from '../../data/models/UnifiedRegister';

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

export function useUnifiedRegister(initialItems: IUnifiedRegisterItems) {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<IUnifiedRegisterItems>(initialItems);
  const [markedForReprocessingIds, setMarkedForReprocessingIds] = useState<Set<string>>(
    () => new Set(initialItems.filter((item) => item.isInReprocessing).map((item) => item.contribuyenteId))
  );
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [isMarkPending, startMarkTransition] = useTransition();

  const filteredItems = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(search);

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((item) => {
      const normalizedCuit = item.cuit.toLowerCase();
      const normalizedBusinessName = item.businessName.toLowerCase();

      return (
        normalizedCuit.includes(normalizedSearch) ||
        normalizedBusinessName.includes(normalizedSearch)
      );
    });
  }, [items, search]);

  const markForReprocessing = (contribuyenteId: string) => {
    if (markedForReprocessingIds.has(contribuyenteId)) {
      return;
    }

    setMarkingId(contribuyenteId);

    startMarkTransition(() => {
      void (async () => {
        const result = await markReprocessingAction({ contribuyenteId });

        if (result.success) {
          setMarkedForReprocessingIds((current) => {
            const next = new Set(current);
            next.add(contribuyenteId);
            return next;
          });

          setItems((current) =>
            current.map((item) =>
              item.contribuyenteId === contribuyenteId
                ? { ...item, isInReprocessing: true }
                : item
            )
          );
        }

        setMarkingId((current) => (current === contribuyenteId ? null : current));
      })();
    });
  };

  return {
    search,
    setSearch,
    filteredItems,
    isMarkPending,
    markingId,
    markForReprocessing
  };
}
