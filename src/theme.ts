import { createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'terra',
  fontFamily: "var(--font-dm-sans), var(--font-body), 'Segoe UI', sans-serif",
  fontFamilyMonospace:
    "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  headings: {
    fontFamily:
      "var(--font-dm-sans), var(--font-display), 'Segoe UI', sans-serif"
  },
  colors: {
    blue: [
      '#EBF0FE',
      '#D0DCFD',
      '#A8BEF9',
      '#7B9EF5',
      '#6B94F5',
      '#4375EE',
      '#2F5FD4',
      '#2348B0',
      '#1D4ED8',
      '#153AAA'
    ],
    gray: [
      '#F8F9FA',
      '#F1F3F5',
      '#E9ECEF',
      '#DEE2E6',
      '#CED4DA',
      '#ADB5BD',
      '#868E96',
      '#495057',
      '#343A40',
      '#212529'
    ],
    red: [
      '#FFF5F5',
      '#FFE3E3',
      '#FFC9C9',
      '#FFA8A8',
      '#FF8787',
      '#FA5252',
      '#F03E3E',
      '#E03131',
      '#C92A2A',
      '#A61E1E'
    ],
    green: [
      '#EBFBEE',
      '#D7F5DD',
      '#B0EBBB',
      '#84D996',
      '#5FC47A',
      '#3FAE5C',
      '#2F9E44',
      '#2B8A3E',
      '#237032',
      '#1B5727'
    ],
    yellow: [
      '#FFF9DB',
      '#FFF3BF',
      '#FFEC99',
      '#FFE066',
      '#FFD43B',
      '#FAB005',
      '#E67700',
      '#D9480F',
      '#B45309',
      '#8F3F07'
    ],
    cyan: [
      '#ECFEFF',
      '#CFFAFE',
      '#A5F3FC',
      '#67E8F9',
      '#22D3EE',
      '#06B6D4',
      '#0891B2',
      '#0E7490',
      '#155E75',
      '#164E63'
    ],
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
})
