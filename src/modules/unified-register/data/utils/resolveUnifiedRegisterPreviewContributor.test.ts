import {
  findContributorByCuit,
  isSameCuit,
  resolvePreviewContribuyenteId
} from './resolveUnifiedRegisterPreviewContributor';

describe('resolveUnifiedRegisterPreviewContributor', () => {
  it('matches CUIT values with or without formatting', () => {
    expect(isSameCuit('27-10000958-2', '27100009582')).toBe(true);
  });

  it('finds the contributor that belongs to the visible CUIT', () => {
    const contributors = [
      {
        contribuyenteId: 'old-contributor-id',
        cuit: '27100009582'
      },
      {
        contribuyenteId: 'new-contributor-id',
        cuit: '30-20000000-1'
      }
    ];

    expect(findContributorByCuit(contributors, '30200000001')).toEqual(
      contributors[1]
    );
  });

  it('prefers the CUIT-matched contributor over a stale route id', () => {
    expect(
      resolvePreviewContribuyenteId({
        cuitMatchedContribuyenteId: 'new-contributor-id',
        routeContribuyenteId: 'old-contributor-id'
      })
    ).toBe('new-contributor-id');
  });
});
