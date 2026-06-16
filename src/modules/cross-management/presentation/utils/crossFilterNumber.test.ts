import { normalizeCrossFilterNumberValue } from './crossFilterNumber'

describe('cross filter number formatting', () => {
  it('normalizes visual local numbers to canonical decimal values', () => {
    expect(normalizeCrossFilterNumberValue('900.000,42')).toBe('900000.42')
    expect(normalizeCrossFilterNumberValue('-1.234.567,89')).toBe('-1234567.89')
  })

  it('keeps previous decimal inputs compatible', () => {
    expect(normalizeCrossFilterNumberValue('25.5')).toBe('25.5')
    expect(normalizeCrossFilterNumberValue('900000.42')).toBe('900000.42')
  })

  it('normalizes thousand-only visual values', () => {
    expect(normalizeCrossFilterNumberValue('650.000')).toBe('650000')
    expect(normalizeCrossFilterNumberValue('1.234.567')).toBe('1234567')
  })
})
