import { Box, Typography, Button, Stack, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * Promotional panel used between homepage sections and on category pages.
 *
 * @param {{eyebrow?:string, title:string, body?:string, ctaLabel?:string,
 *          ctaTo?:string, image?:string, tone?:'primary'|'secondary'|'dark',
 *          height?:object, align?:'left'|'center'}} props
 */
const TONES = {
  primary: { bg: 'primary.main', fg: 'primary.contrastText' },
  secondary: { bg: 'secondary.main', fg: 'secondary.contrastText' },
  dark: { bg: 'text.primary', fg: 'background.paper' },
};

export default function PromoBanner({
  eyebrow, title, body, ctaLabel, ctaTo, image, tone = 'primary',
  height = { xs: 200, md: 260 }, align = 'left', sx = {},
}) {
  const palette = TONES[tone] ?? TONES.primary;

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        minHeight: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        bgcolor: palette.bg,
        color: palette.fg,
        ...sx,
      }}
    >
      {image && (
        <>
          <Box
            component="img"
            src={image}
            alt=""
            loading="lazy"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute', inset: 0,
              background: align === 'center'
                ? 'rgba(8,10,18,0.55)'
                : 'linear-gradient(90deg, rgba(8,10,18,0.86) 0%, rgba(8,10,18,0.55) 55%, rgba(8,10,18,0.15) 100%)',
            }}
          />
        </>
      )}

      <Box
        sx={{
          position: 'relative',
          p: { xs: 3, md: 5 },
          maxWidth: align === 'center' ? 620 : 520,
          textAlign: align,
          color: image ? '#fff' : 'inherit',
        }}
      >
        {eyebrow && (
          <Chip
            size="small"
            label={eyebrow}
            sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.18)', color: 'inherit', fontWeight: 700 }}
          />
        )}

        <Typography variant="h3" sx={{ mb: body ? 1.5 : 2.5 }}>{title}</Typography>

        {body && (
          <Typography sx={{ mb: 2.5, opacity: 0.9, maxWidth: 460, mx: align === 'center' ? 'auto' : 0 }}>
            {body}
          </Typography>
        )}

        {ctaLabel && ctaTo && (
          <Stack direction="row" justifyContent={align === 'center' ? 'center' : 'flex-start'}>
            <Button
              component={RouterLink}
              to={ctaTo}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#fff', color: 'text.primary',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
            >
              {ctaLabel}
              {/* Parth */}
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
