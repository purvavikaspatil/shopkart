import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { APP_NAME } from '@/utils/constants';

/**
 * Wordmark with an inline SVG basket.
 * SVG rather than an image file so it inherits the theme colour in both modes.
 */
export default function Logo({ compact = false, onClick }) {
  return (
    <Box
      component={RouterLink}
      to="/"
      onClick={onClick}
      aria-label={`${APP_NAME} home`}
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexShrink: 0 }}
    >
      <Box
        component="svg"
        viewBox="0 0 64 64"
        sx={{ width: 32, height: 32, flexShrink: 0 }}
        aria-hidden="true"
      >
        <rect width="64" height="64" rx="16" fill="currentColor" style={{ color: 'var(--logo-bg, #3D48D6)' }} />
        <path
          d="M20 24h24l-3 20a4 4 0 0 1-4 3.5H27a4 4 0 0 1-4-3.5L20 24Z"
          fill="none" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round"
        />
        <path
          d="M26 24v-3a6 6 0 0 1 12 0v3"
          fill="none" stroke="#4FD1C5" strokeWidth="3.5" strokeLinecap="round"
        />
      </Box>

      {!compact && (
        <Typography
          variant="h5"
          component="span"
          sx={{
            color: 'text.primary',
            letterSpacing: '-0.03em',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {APP_NAME}
        </Typography>
      )}
    </Box>
  );
}
