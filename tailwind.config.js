/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'beer-amber': 'var(--beer-amber)',
        'beer-foam': 'var(--beer-foam)',
        'beer-dark-brown': 'var(--beer-dark-brown)',
        'beer-golden': 'var(--beer-golden)',
        'beer-red-cup': 'var(--beer-red-cup)',
      },
      fontSize: {
        'caption': 'var(--font-size-caption)',
        'body': 'var(--font-size-body)',
        'subheadline': 'var(--font-size-subheadline)',
        'headline': 'var(--font-size-headline)',
        'title3': 'var(--font-size-title3)',
        'title2': 'var(--font-size-title2)',
        'title': 'var(--font-size-title)',
        'large-title': 'var(--font-size-large-title)',
      },
      fontWeight: {
        regular: 'var(--font-weight-regular)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
        black: 'var(--font-weight-black)',
      },
      spacing: {
        'xxs': 'var(--spacing-xxs)',
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        'xxl': 'var(--spacing-xxl)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
      backgroundImage: {
        'lager-gradient': 'var(--lager-gradient)',
        'ipa-gradient': 'var(--ipa-gradient)',
        'stout-gradient': 'var(--stout-gradient)',
      },
      borderRadius: {
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
} 