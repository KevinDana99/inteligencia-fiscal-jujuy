import type { IBatchLoadedCuitRow } from '@/modules/batch-management/data/models/BatchManagement';
import type { IExplorerRegisterRow } from '../../data/models/ExplorerRegister';

function normalizeExplorerRegisterBatchCuit(value: string) {
  return value.replace(/\D/g, '');
}

export function buildExplorerRegisterBatchRows(
  rows: IExplorerRegisterRow[],
  createdAt = Date.now()
): IBatchLoadedCuitRow[] {
  const normalizedCuits = new Set<string>();

  return rows.reduce<IBatchLoadedCuitRow[]>((accumulator, row, index) => {
    const normalizedCuit = normalizeExplorerRegisterBatchCuit(row.cuit);

    if (!normalizedCuit || normalizedCuits.has(normalizedCuit)) {
      return accumulator;
    }

    normalizedCuits.add(normalizedCuit);
    accumulator.push({
      id: `explorer-register-${createdAt}-${index}-${normalizedCuit}`,
      cuit: row.cuit,
      businessName: row.businessName || null,
      source: 'manual'
    });

    return accumulator;
  }, []);
}
