import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      screens: {
        '3xl': '2000px',
        'h-xl': { raw: '(min-height: 1000px)' },
        'h-2xl': { raw: '(min-height: 1200px)' },
      },
    },
  },
}
export default config
