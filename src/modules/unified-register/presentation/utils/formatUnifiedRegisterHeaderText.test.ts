import {
  formatUnifiedRegisterHeaderText,
  UNIFIED_REGISTER_HEADER_EMPTY_VALUE
} from './formatUnifiedRegisterHeaderText';

describe('formatUnifiedRegisterHeaderText', () => {
  it('marks empty header values with a dash', () => {
    expect(formatUnifiedRegisterHeaderText(null)).toBe(
      UNIFIED_REGISTER_HEADER_EMPTY_VALUE
    );
    expect(formatUnifiedRegisterHeaderText(undefined)).toBe(
      UNIFIED_REGISTER_HEADER_EMPTY_VALUE
    );
    expect(formatUnifiedRegisterHeaderText('')).toBe(
      UNIFIED_REGISTER_HEADER_EMPTY_VALUE
    );
    expect(formatUnifiedRegisterHeaderText('   ')).toBe(
      UNIFIED_REGISTER_HEADER_EMPTY_VALUE
    );
  });

  it('keeps non-empty header values readable', () => {
    expect(formatUnifiedRegisterHeaderText('  Jujuy (J.910)  ')).toBe(
      'Jujuy (J.910)'
    );
  });
});
