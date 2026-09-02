export const BRAND = {
  primary: '#0077B5',
  primaryDark: '#004182',
  accent: '#FF6B35',
  accentYellow: '#FFC107',
  white: '#FFFFFF',
  offWhite: '#F3F2EF',
  dark: '#191919',
  gray: '#666666',
  success: '#057642',
  red: '#D9381E',
  gradient: 'linear-gradient(135deg, #004182 0%, #0077B5 50%, #0A66C2 100%)',
  sparkleGradient: 'linear-gradient(135deg, #FFC107 0%, #FF6B35 100%)',
} as const;

export const FONTS = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
  accent: 'Georgia, serif',
} as const;

export const FPS = 30;
export const DURATION_SECONDS = 30;
export const DURATION_FRAMES = FPS * DURATION_SECONDS;
