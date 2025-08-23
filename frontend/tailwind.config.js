/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Sistema de espaciado personalizado para SGC Pro
      spacing: {
        // Separación de 1cm (aproximadamente 38px)
        'sgc-sep': '38px',
        // Separación de 2cm (aproximadamente 76px)
        'sgc-sep-2': '76px',
        // Espaciado interno consistente
        'sgc-p': '24px',
        'sgc-p-sm': '16px',
        'sgc-p-lg': '32px',
        // Margen entre elementos
        'sgc-m': '24px',
        'sgc-m-sm': '16px',
        'sgc-m-lg': '32px',
        // Gap entre elementos
        'sgc-gap': '24px',
        'sgc-gap-sm': '16px',
        'sgc-gap-lg': '32px',
      },
      // Bordes redondeados mejorados
      borderRadius: {
        'sgc': '12px',
        'sgc-lg': '16px',
        'sgc-xl': '20px',
        'sgc-2xl': '24px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Sombras mejoradas
      boxShadow: {
        'sgc': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'sgc-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'sgc-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      // Colores corporativos personalizados para ISO 9001
      colors: {
        // Colores base del sistema
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Colores corporativos ISO 9001
        'iso': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        
        // Colores de estado para SGC
        'sgc': {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          pending: '#6b7280',
        },
        
        // Colores de procesos ISO
        'process': {
          planning: '#8b5cf6',
          implementation: '#06b6d4',
          monitoring: '#f97316',
          improvement: '#84cc16',
        },
        
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      // Tipografía personalizada
      fontFamily: {
        'sgc': ['Inter', 'system-ui', 'sans-serif'],
        'sgc-display': ['Poppins', 'system-ui', 'sans-serif'],
        'sgc-mono': ['JetBrains Mono', 'monospace'],
      },
      // Tamaños de fuente personalizados
      fontSize: {
        'sgc-xs': ['0.75rem', { lineHeight: '1rem' }],
        'sgc-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'sgc-base': ['1rem', { lineHeight: '1.5rem' }],
        'sgc-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'sgc-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'sgc-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'sgc-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'sgc-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        // Animaciones personalizadas para SGC
        'sgc-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'sgc-slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'sgc-pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        // Animaciones personalizadas
        'sgc-fade-in': 'sgc-fade-in 0.3s ease-out',
        'sgc-slide-in': 'sgc-slide-in 0.3s ease-out',
        'sgc-pulse-gentle': 'sgc-pulse-gentle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
