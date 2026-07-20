import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        asphalt: '#1C1D22',
        chalk: '#F5F3ED',
        signal: '#F3C511',
        meterGreen: '#1E9E5A',
        roadCoral: '#FF5A36',
        surface: '#FAF9F9',
        borderDark: '#1C1D22',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderWidth: {
        '1': '1px',
      },
      boxShadow: {
        brutalist: '4px 4px 0px 0px rgba(28, 29, 34, 0.1)',
      }
    },
  },
  plugins: [],
}
export default config
