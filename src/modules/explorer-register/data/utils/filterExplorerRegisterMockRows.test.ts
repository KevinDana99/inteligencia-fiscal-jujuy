import type { IExplorerRegisterRow } from '../models/ExplorerRegister';
import { filterExplorerRegisterMockRows } from './filterExplorerRegisterMockRows';

const rows: IExplorerRegisterRow[] = [
  {
    cuit: '30-50168521-2',
    businessName: 'Cerámica del Norte S.A.',
    values: {
      rubro: 'Construccion'
    }
  },
  {
    cuit: '30-50401884-5',
    businessName: 'Volkswagen Argentina S.A.',
    values: {
      rubro: 'Automotor'
    }
  }
];

describe('filterExplorerRegisterMockRows', () => {
  it('applies filters together with global search', () => {
    const result = filterExplorerRegisterMockRows(
      rows,
      [
        {
          code: 'rubro',
          values: ['auto']
        }
      ],
      ' volkswagen '
    );

    expect(result).toEqual([rows[1]]);
  });

  it('matches CUIT searches with or without separators', () => {
    expect(filterExplorerRegisterMockRows(rows, [], '30501685212')).toEqual([
      rows[0]
    ]);
  });

  it('matches business names ignoring case and accents', () => {
    expect(filterExplorerRegisterMockRows(rows, [], 'ceramica')).toEqual([
      rows[0]
    ]);
  });
});
