import { Container, Box } from '@mui/material';
import { layout } from '@/theme/tokens';

/**
 * Standard page wrapper: max width, responsive gutters and vertical rhythm.
 * `disableGutters` is useful for full-bleed hero sections.
 */
export default function PageContainer({
  children, maxWidth = layout.maxWidth, py = { xs: 3, md: 5 }, disableGutters = false, sx = {},
}) {
  return (
    <Container
      maxWidth={false}
      disableGutters={disableGutters}
      sx={{ maxWidth, px: disableGutters ? 0 : { xs: 2, sm: 3, md: 4 }, mx: 'auto', ...sx }}
    >
      <Box sx={{ py }}>{children}</Box>
    </Container>
  );
}
