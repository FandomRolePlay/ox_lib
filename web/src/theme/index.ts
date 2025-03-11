import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Helvetica',
  shadows: { sm: '1px 1px 3px rgba(0, 0, 0, 0.5)' },
  colors: {
    basicBg: ['radial-gradient(circle, #19212E, #141B25)',
      'radial-gradient(circle, #0A0C11, #141B25)',
      '#0A0C11',
      '#222D3D',
    ],
    darkerBg: ['#19212E'],
    mainColor: ['#CD2E36'],
  },
  components: {
    Button: {
      styles: {
        root: {
          border: 'none',
        },
      },
    },
  },
};
