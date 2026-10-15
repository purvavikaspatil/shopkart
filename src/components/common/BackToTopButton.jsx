import { useState, useEffect } from 'react';
import { Fab, Zoom, useTheme, useMediaQuery } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { scrollToTop } from '@/utils/helpers';

/** Floating "back to top" control, revealed after a screen of scrolling. */
export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Zoom in={visible}>
      <Fab
        size="small"
        color="primary"
        onClick={() => scrollToTop()}
        aria-label="Back to top"
        sx={{
          position: 'fixed',
          right: { xs: 14, md: 24 },
          // Clear the mobile bottom navigation.
          bottom: { xs: 78, md: 28 },
          zIndex: (t) => t.zIndex.speedDial,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
}
