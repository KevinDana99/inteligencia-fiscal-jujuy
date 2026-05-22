'use client';

import { useMemo, useState } from 'react';
import { unifiedRegisterItemsFixture } from '../../data/sources/mock/fixtures/unifiedRegisterItems';

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

export function useUnifiedRegister() {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(search);

    if (!normalizedSearch) {
      return unifiedRegisterItemsFixture;
    }

    return unifiedRegisterItemsFixture.filter((item) => {
      const normalizedCuit = item.cuit.toLowerCase();
      const normalizedBusinessName = item.businessName.toLowerCase();

      return (
        normalizedCuit.includes(normalizedSearch) ||
        normalizedBusinessName.includes(normalizedSearch)
      );
    });
  }, [search]);

  return {
    search,
    setSearch,
    filteredItems
  };
}
