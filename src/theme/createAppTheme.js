import { createTheme, alpha } from '@mui/material/styles';
import { palettes, radii, shadows, fonts, neutral } from './tokens';

/**
 * Builds the MUI theme for a given colour mode.
 * All component defaults live here so pages stay free of one-off `sx` styling.
 *
 * @param {'light'|'dark'} mode
 * @returns {import('@mui/material/styles').Theme}
 */
export function createAppTheme(mode = 'light') {
  const isDark = mode === 'dark';
  const p = palettes[mode];
  const sh = shadows[mode];

  const base = createTheme({
    palette: { mode, ...p, neutral: { main: neutral[500], ...neutral } },
    shape: { borderRadius: radii.md },
    spacing: 8,
    typography: {
      fontFamily: fonts.body,
      // A tight, deliberate scale. Display sizes use the heavier Jakarta face.
      h1: { fontFamily: fonts.display, fontWeight: 800, fontSize: '3rem', lineHeight: 1.1, letterSpacing: '-0.03em' },
      h2: { fontFamily: fonts.display, fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.15, letterSpacing: '-0.025em' },
      h3: { fontFamily: fonts.display, fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2, letterSpacing: '-0.02em' },
      h4: { fontFamily: fonts.display, fontWeight: 700, fontSize: '1.375rem', lineHeight: 1.25, letterSpacing: '-0.015em' },
      h5: { fontFamily: fonts.display, fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.3 },
      h6: { fontFamily: fonts.display, fontWeight: 700, fontSize: '1rem', lineHeight: 1.35 },
      subtitle1: { fontWeight: 600, fontSize: '0.975rem' },
      subtitle2: { fontWeight: 600, fontSize: '0.85rem' },
      body1: { fontSize: '0.95rem', lineHeight: 1.6 },
      body2: { fontSize: '0.86rem', lineHeight: 1.6 },
      caption: { fontSize: '0.75rem', lineHeight: 1.5 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
      overline: { fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em' },
    },
    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    },
  });

  return createTheme(base, {
    // Custom slot kept alongside the theme so components can reach shared shadows.
    appShadows: sh,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': { boxSizing: 'border-box' },
          html: { WebkitFontSmoothing: 'antialiased', scrollBehavior: 'smooth' },
          body: { overflowX: 'hidden' },
          // Respect users who ask the OS to reduce motion.
          '@media (prefers-reduced-motion: reduce)': {
            '*': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
            html: { scrollBehavior: 'auto' },
          },
          '::-webkit-scrollbar': { width: 10, height: 10 },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(base.palette.text.primary, 0.2),
            borderRadius: 999,
            border: `2px solid ${base.palette.background.default}`,
          },
          '::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          // Utility used by horizontal carousels on touch devices.
          '.no-scrollbar::-webkit-scrollbar': { display: 'none' },
          '.no-scrollbar': { scrollbarWidth: 'none', msOverflowStyle: 'none' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: radii.sm, paddingInline: 18, minHeight: 40 },
          sizeSmall: { minHeight: 32, paddingInline: 12, fontSize: '0.8rem' },
          sizeLarge: { minHeight: 48, paddingInline: 26, fontSize: '1rem' },
          containedPrimary: {
            boxShadow: `0 6px 16px ${alpha(p.primary.main, isDark ? 0.28 : 0.24)}`,
            '&:hover': { boxShadow: `0 8px 22px ${alpha(p.primary.main, isDark ? 0.36 : 0.3)}` },
          },
          outlined: { borderColor: base.palette.divider },
        },
      },
      MuiIconButton: { styleOverrides: { root: { borderRadius: radii.sm } } },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: radii.md,
            border: `1px solid ${base.palette.divider}`,
            backgroundImage: 'none',
            boxShadow: sh.xs,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          rounded: { borderRadius: radii.md },
          outlined: { borderColor: base.palette.divider },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: radii.xs, fontWeight: 600 },
          sizeSmall: { height: 22, fontSize: '0.7rem' },
          label: { paddingInline: 8 },
        },
      },
      MuiTextField: { defaultProps: { size: 'small', variant: 'outlined' } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radii.sm,
            backgroundColor: isDark ? alpha('#FFFFFF', 0.03) : alpha('#FFFFFF', 1),
          },
          notchedOutline: { borderColor: base.palette.divider },
        },
      },
      MuiSelect: { defaultProps: { size: 'small' } },
      MuiTooltip: {
        defaultProps: { arrow: true },
        styleOverrides: {
          tooltip: { borderRadius: radii.xs, fontSize: '0.75rem', paddingBlock: 6, paddingInline: 10 },
        },
      },
      MuiDialog: { styleOverrides: { paper: { borderRadius: radii.lg, boxShadow: sh.lg } } },
      MuiDrawer: { styleOverrides: { paper: { backgroundImage: 'none', borderColor: base.palette.divider } } },
      MuiMenu: { styleOverrides: { paper: { borderRadius: radii.md, boxShadow: sh.md, border: `1px solid ${base.palette.divider}` } } },
      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 44 },
          indicator: { height: 3, borderRadius: 3 },
        },
      },
      MuiTab: { styleOverrides: { root: { minHeight: 44, fontWeight: 600, textTransform: 'none' } } },
      MuiAccordion: {
        defaultProps: { disableGutters: true, elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${base.palette.divider}`,
            borderRadius: radii.sm,
            '&:before': { display: 'none' },
            '& + &': { marginTop: 8 },
          },
        },
      },
      MuiAlert: { styleOverrides: { root: { borderRadius: radii.sm, alignItems: 'center' } } },
      MuiLinearProgress: { styleOverrides: { root: { borderRadius: 999, height: 6 } } },
      MuiSkeleton: { defaultProps: { animation: 'wave' } },
      MuiAvatar: { styleOverrides: { root: { fontWeight: 700, fontFamily: fonts.display } } },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: base.palette.divider },
          head: { fontWeight: 700, backgroundColor: isDark ? alpha('#FFFFFF', 0.03) : neutral[50] },
        },
      },
      MuiBadge: { styleOverrides: { badge: { fontWeight: 700, fontSize: '0.66rem' } } },
      MuiLink: { defaultProps: { underline: 'hover' } },
      MuiListItemButton: { styleOverrides: { root: { borderRadius: radii.sm } } },
      MuiSlider: { styleOverrides: { valueLabel: { borderRadius: radii.xs, fontWeight: 600 } } },
      MuiStepLabel: { styleOverrides: { label: { fontWeight: 600 } } },
      MuiSnackbarContent: { styleOverrides: { root: { borderRadius: radii.sm } } },
    },
  });
}
