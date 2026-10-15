import { Box, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

import PageContainer from '@/components/common/PageContainer';

/** Friendly 404 shown for any unmatched route. */
export default function NotFoundPage() {
  return (
    <PageContainer>
      <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, maxWidth: 520, mx: 'auto' }}>
        <Typography
          sx={{
            fontSize: { xs: '6rem', md: '9rem' }, fontWeight: 800, lineHeight: 1,
            background: (t) => `linear-gradient(120deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          404
        </Typography>

        <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>This page went shopping elsewhere</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you are looking for does not exist, moved, or the link was mistyped. Let us get you back on track.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button component={RouterLink} to="/" variant="contained" size="large" startIcon={<HomeOutlinedIcon />}>
            Back to home
          </Button>
          <Button component={RouterLink} to="/shop" variant="outlined" size="large" startIcon={<StorefrontOutlinedIcon />}>
            Continue shopping
          </Button>
        </Stack>
      </Box>
    </PageContainer>
  );
}
