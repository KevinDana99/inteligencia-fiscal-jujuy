import type { CSSProperties } from 'react';

export const AVATAR_COLOR_TOKENS = [
  'gray',
  'red',
  'green',
  'yellow',
  'cyan',
  'blue'
] as const;

export type AvatarColorTone = (typeof AVATAR_COLOR_TOKENS)[number];

export function getAvatarColorStyles(
  colorName: AvatarColorTone,
  shade: 5 | 6 = 6
): CSSProperties {
  return {
    '--avatar-bg': `var(--mantine-color-${colorName}-${shade})`,
    '--avatar-color': 'var(--mantine-color-white)'
  } as CSSProperties;
}
