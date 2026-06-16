import {
  matchesCrossSearch,
  normalizeCrossSearchRequest
} from './crossSearch'

describe('cross search helpers', () => {
  it('matches formatted CUIT searches against raw CUIT values', () => {
    expect(
      matchesCrossSearch(['20100009448', 'Contribuyente DEV 00034'], '20-10000944-8')
    ).toBe(true)
  })

  it('keeps text searches intact for names and batch references', () => {
    expect(
      matchesCrossSearch(['LOTEEEEEEE', 'Control de desvio'], 'lote')
    ).toBe(true)
    expect(normalizeCrossSearchRequest('DEV 00034')).toBe('DEV 00034')
  })

  it('normalizes CUIT-like request searches before sending them to the API', () => {
    expect(normalizeCrossSearchRequest('20-10000944-8')).toBe('20100009448')
    expect(normalizeCrossSearchRequest('30 50401884 5')).toBe('30504018845')
  })
})
