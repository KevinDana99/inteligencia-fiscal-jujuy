import type { IExplorerRegisterRow } from '../../data/models/ExplorerRegister';
import { filterExplorerRegisterRowsByLocalSearch } from './filterExplorerRegisterRowsByLocalSearch';

const rows: IExplorerRegisterRow[] = [
  {
    cuit: '30-50401884-5',
    businessName: 'VOLKSWAGEN ARGENTINA S.A.',
    values: {}
  },
  {
    cuit: '30-50168521-2',
    businessName: 'CERÁMICA DEL NORTE S.A.',
    values: {}
  },
  {
    cuit: '27-32178654-3',
    businessName: 'MINERA ALTIPLANO JUJUY S.A.',
    values: {}
  }
];

describe('filterExplorerRegisterRowsByLocalSearch', () => {
  it('returns every row when the local search is empty', () => {
    expect(filterExplorerRegisterRowsByLocalSearch(rows, '   ')).toEqual(rows);
  });

  it('matches CUITs with or without separators', () => {
    expect(filterExplorerRegisterRowsByLocalSearch(rows, '30501685212')).toEqual([
      rows[1]
    ]);
  });

  it('matches business names ignoring accents and case', () => {
    expect(filterExplorerRegisterRowsByLocalSearch(rows, 'ceramica')).toEqual([
      rows[1]
    ]);
  });
});
