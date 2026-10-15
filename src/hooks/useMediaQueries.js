import { useTheme, useMediaQuery } from '@mui/material';

/**
 * One place to ask "are we on mobile / tablet / desktop".
 * Keeps breakpoint strings out of individual components.
 */
export function useBreakpoints() {
  const theme = useTheme();
  return {
    isMobile: useMediaQuery(theme.breakpoints.down('sm')),      // < 600px
    isTablet: useMediaQuery(theme.breakpoints.between('sm', 'md')), // 600-900px
    isBelowDesktop: useMediaQuery(theme.breakpoints.down('md')), // < 900px
    isDesktop: useMediaQuery(theme.breakpoints.up('md')),
    isWide: useMediaQuery(theme.breakpoints.up('lg')),
  };
}

export default useBreakpoints;
