import type { ICrossManagementItems } from '../../data/models/CrossManagement';
import { filterCrossManagementItems } from './filterCrossManagementItems';

const items: ICrossManagementItems = [
  {
    id: 'cross-1',
    name: 'Control de Desvio de BI - Regimen General',
    source: 'Lote',
    sourceRef: '623',
    period: '2022-2025',
    cuitCount: 3,
    date: '27/04/2026',
    status: 'completada'
  },
  {
    id: 'cross-2',
    name: 'Control de desvio de BI - Regimen CM',
    source: 'Padrón',
    sourceRef: '30-50401884-5',
    period: '2024-2025',
    cuitCount: 1,
    date: '26/04/2026',
    status: 'completada'
  }
];

describe('filterCrossManagementItems', () => {
  it('filters by cross name, lote reference or formatted CUIT', () => {
    expect(
      filterCrossManagementItems({
        dayRangeValue: '',
        items,
        periodValue: '',
        searchValue: 'general'
      }).map((item) => item.id)
    ).toEqual(['cross-1']);

    expect(
      filterCrossManagementItems({
        dayRangeValue: '',
        items,
        periodValue: '',
        searchValue: '623'
      }).map((item) => item.id)
    ).toEqual(['cross-1']);

    expect(
      filterCrossManagementItems({
        dayRangeValue: '',
        items,
        periodValue: '',
        searchValue: '30504018845'
      }).map((item) => item.id)
    ).toEqual(['cross-2']);
  });
});
