import type { IExplorerRegisterRow } from '../../data/models/ExplorerRegister';
import { buildExplorerRegisterBatchRows } from './buildExplorerRegisterBatchRows';

describe('buildExplorerRegisterBatchRows', () => {
  it('maps visible explorer rows to batch loaded CUIT rows', () => {
    const rows: IExplorerRegisterRow[] = [
      {
        cuit: '30-12345678-9',
        businessName: 'ACME SA',
        values: {}
      },
      {
        cuit: '27-87654321-0',
        businessName: '',
        values: {}
      }
    ];

    expect(buildExplorerRegisterBatchRows(rows, 123)).toEqual([
      {
        id: 'explorer-register-123-0-30123456789',
        cuit: '30-12345678-9',
        businessName: 'ACME SA',
        source: 'manual'
      },
      {
        id: 'explorer-register-123-1-27876543210',
        cuit: '27-87654321-0',
        businessName: null,
        source: 'manual'
      }
    ]);
  });

  it('deduplicates rows by normalized CUIT and skips empty CUITs', () => {
    const rows: IExplorerRegisterRow[] = [
      {
        cuit: '30-12345678-9',
        businessName: 'ACME SA',
        values: {}
      },
      {
        cuit: '30123456789',
        businessName: 'ACME DUP',
        values: {}
      },
      {
        cuit: '---',
        businessName: 'EMPTY',
        values: {}
      }
    ];

    expect(buildExplorerRegisterBatchRows(rows, 456)).toEqual([
      {
        id: 'explorer-register-456-0-30123456789',
        cuit: '30-12345678-9',
        businessName: 'ACME SA',
        source: 'manual'
      }
    ]);
  });
});
