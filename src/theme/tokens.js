/**
 * Design tokens.
 *
 * Single source of truth for colour, radius, type and elevation. The MUI theme
 * is derived entirely from this file, so re-branding the store means editing
 * one module instead of hunting through components.
 */

export const palettes = {
  light: {
    primary: { main: '#3D48D6', light: '#6C74E8', dark: '#2A32A8', contrastText: '#FFFFFF' },
    secondary: { main: '#0E9F97', light: '#4FD1C5', dark: '#07726C', contrastText: '#FFFFFF' },
    success: { main: '#2E9E5B', light: '#5CBE84', dark: '#1F7343', contrastText: '#FFFFFF' },
    warning: { main: '#E17A15', light: '#F0A44F', dark: '#A9560A', contrastText: '#FFFFFF' },
    error: { main: '#D8412F', light: '#E97567', dark: '#A32C1E', contrastText: '#FFFFFF' },
    info: { main: '#2A72CE', light: '#5F9CE4', dark: '#1B5099', contrastText: '#FFFFFF' },
    background: { default: '#F5F6FB', paper: '#FFFFFF' },
    text: { primary: '#141828', secondary: '#5A6178', disabled: '#9AA0B4' },
    divider: 'rgba(20, 24, 40, 0.10)',
  },
  dark: {
    // Dark mode is a re-tuned palette, not an inversion: hues are desaturated
    // and lightened so they stay legible on a near-black surface.
    primary: { main: '#8E96FF', light: '#B0B6FF', dark: '#5C66E0', contrastText: '#0B0E1A' },
    secondary: { main: '#4FD1C5', light: '#7FE1D8', dark: '#1E9A8F', contrastText: '#08201E' },
    success: { main: '#57C88A', light: '#83DBAB', dark: '#2F8F5B', contrastText: '#08201E' },
    warning: { main: '#F2A754', light: '#F7C287', dark: '#B87421', contrastText: '#1B1206' },
    error: { main: '#F0715F', light: '#F79A8D', dark: '#B2483A', contrastText: '#1B0B08' },
    info: { main: '#74A9F0', light: '#9DC4F6', dark: '#3F76BE', contrastText: '#06121F' },
    background: { default: '#0D1017', paper: '#161A24' },
    text: { primary: '#EDEFF7', secondary: '#A2A9BE', disabled: '#6C7386' },
    divider: 'rgba(237, 239, 247, 0.12)',
  },
};

/** Neutral ramp used for subtle surfaces, chips and skeletons. */
export const neutral = {
  50: '#F7F8FC',
  100: '#EFF1F7',
  200: '#E1E4EE',
  300: '#CBD0DF',
  400: '#9AA0B4',
  500: '#6E748A',
  600: '#4C5268',
  700: '#343A4C',
  800: '#22262F',
  900: '#141828',
};

export const radii = { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

/** Soft layered shadows - deliberately gentler than MUI defaults. */
export const shadows = {
  light: {
    xs: '0 1px 2px rgba(20,24,40,0.06)',
    sm: '0 2px 8px rgba(20,24,40,0.07)',
    md: '0 8px 24px rgba(20,24,40,0.09)',
    lg: '0 18px 44px rgba(20,24,40,0.13)',
  },
  dark: {
    xs: '0 1px 2px rgba(0,0,0,0.5)',
    sm: '0 2px 10px rgba(0,0,0,0.55)',
    md: '0 10px 28px rgba(0,0,0,0.6)',
    lg: '0 22px 50px rgba(0,0,0,0.68)',
  },
};

export const fonts = {
  display: '"Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif',
  body: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
};

/** Layout constants reused across the app shell. */
export const layout = {
  maxWidth: 1400,
  navHeight: 68,
  announcementHeight: 36,
  categoryBarHeight: 46,
  bottomNavHeight: 62,
};
