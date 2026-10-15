import { Box, Container, Paper, Typography, Stack, IconButton } from '@mui/material';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from './Logo';

/** Highlights shown on the marketing panel of the auth split screen. */
const HIGHLIGHTS = [
  'Track orders from cart to doorstep',
  'Save addresses, cards and wishlists',
  'Early access to flash sales and coupons',
];

/**
 * Split-screen layout for login / signup / password flows.
 * The left panel is decorative and hidden on small screens.
 */
export default function AuthLayout() {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex' }}>
      {/* Marketing panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '46%',
          p: 6,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(150deg, #3D48D6 0%, #5A46C8 45%, #0E9F97 100%)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, '--logo-bg': '#ffffff22' }}>
          <Box sx={{ color: '#fff' }}><Logo /></Box>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" sx={{ color: '#fff', mb: 2, maxWidth: 420 }}>
            Everyday essentials, premium picks.
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 4 }}>
            {HIGHLIGHTS.map((line) => (
              <Stack key={line} direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4FD1C5' }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{line}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', position: 'relative', zIndex: 1 }}>
          A demonstration storefront. No real payments are processed.
        </Typography>

        {/* Soft decorative orbs */}
        <Box sx={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)', top: -80, right: -80 }} />
        <Box sx={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', bottom: 40, right: 120 }} />
      </Box>

      {/* Form panel */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Box sx={{ p: 2 }}>
          <IconButton component={RouterLink} to="/" aria-label="Back to store">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Logo />
          </Box>
          <Paper
            elevation={0}
            sx={{ p: { xs: 3, sm: 4 }, border: 1, borderColor: 'divider', borderRadius: 3 }}
          >
            <Outlet />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
