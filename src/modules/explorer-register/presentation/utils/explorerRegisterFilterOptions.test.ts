import { filterExplorerRegisterOptionData } from './explorerRegisterFilterOptions';

const contributorTypeOptions = [
  {
    value: 'LOCAL',
    label: 'LOCAL'
  },
  {
    value: 'CONVENIO',
    label: 'CONVENIO'
  },
  {
    value: 'NO INSCRIPTO',
    label: 'NO INSCRIPTO'
  }
];

describe('filterExplorerRegisterOptionData', () => {
  it('filters closed contributor type options with partial typed text', () => {
    expect(
      filterExplorerRegisterOptionData(contributorTypeOptions, [], 'con')
    ).toEqual([
      {
        value: 'CONVENIO',
        label: 'CONVENIO'
      }
    ]);
  });

  it('omits already selected options from partial search results', () => {
    expect(
      filterExplorerRegisterOptionData(
        contributorTypeOptions,
        ['CONVENIO'],
        'con'
      )
    ).toEqual([]);
  });

  it('filters system control style options with partial typed text', () => {
    expect(
      filterExplorerRegisterOptionData(
        [
          { value: 'CONVENIO MULTILATERAL', label: 'CONVENIO MULTILATERAL' },
          { value: 'SITI', label: 'SITI' },
          { value: 'SIR', label: 'SIR' },
          { value: 'NO CATEGORIZADO', label: 'NO CATEGORIZADO' }
        ],
        [],
        'categ'
      )
    ).toEqual([
      {
        value: 'NO CATEGORIZADO',
        label: 'NO CATEGORIZADO'
      }
    ]);
  });

  it('filters regimen and debt style options with partial typed text', () => {
    expect(
      filterExplorerRegisterOptionData(
        [
          { value: 'REGIMEN GENERAL', label: 'REGIMEN GENERAL' },
          { value: 'REGIMEN CM', label: 'REGIMEN CM' }
        ],
        [],
        'cm'
      )
    ).toEqual([
      {
        value: 'REGIMEN CM',
        label: 'REGIMEN CM'
      }
    ]);

    expect(
      filterExplorerRegisterOptionData(
        [
          { value: 'CON DEUDA', label: 'CON DEUDA' },
          { value: 'SIN DEUDA', label: 'SIN DEUDA' }
        ],
        [],
        'sin'
      )
    ).toEqual([
      {
        value: 'SIN DEUDA',
        label: 'SIN DEUDA'
      }
    ]);
  });
});
