import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'terra',
  fontFamily: "var(--font-dm-sans), var(--font-body), 'Segoe UI', sans-serif",
  fontFamilyMonospace:
    "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  headings: {
    fontFamily: "var(--font-dm-sans), var(--font-display), 'Segoe UI', sans-serif"
  },
  colors: {
    terra: [
      '#fff3eb',
      '#fbe1d1',
      '#f5c0a2',
      '#ef9d71',
      '#ea8048',
      '#e86d2d',
      '#e7611d',
      '#cd5111',
      '#b6480c',
      '#9f3c05'
    ],
    moss: [
      '#edf8f2',
      '#dcefe4',
      '#b9dec8',
      '#93cca9',
      '#74bd90',
      '#5eb47e',
      '#53af74',
      '#449963',
      '#3a8857',
      '#2c7548'
    ]
  },
  radius: {
    xl: '1.5rem',
    xxl: '2rem'
  },
  defaultRadius: 'xl'
});
