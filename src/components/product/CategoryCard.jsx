import { Card, Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Category tile.
 * `variant="circle"` is the compact rail used on mobile and the homepage;
 * `variant="tile"` is the larger card used on /categories.
 */
export default function CategoryCard({
  label, image, to, count, description, variant = 'tile', sx = {},
}) {
  if (variant === 'circle') {
    return (
      <Box
        component={RouterLink}
        to={to}
        sx={{
          display: 'block', textAlign: 'center', textDecoration: 'none',
          width: { xs: 88, sm: 104 }, flexShrink: 0,
          '&:hover .cat-image': { transform: 'scale(1.06)', borderColor: 'primary.main' },
          ...sx,
        }}
      >
        <Box
          className="cat-image"
          sx={{
            width: { xs: 76, sm: 88 }, height: { xs: 76, sm: 88 }, mx: 'auto',
            borderRadius: '50%', overflow: 'hidden',
            border: 2, borderColor: 'divider',
            transition: 'transform 200ms ease, border-color 200ms ease',
          }}
        >
          <Box
            component="img"
            src={image}
            alt=""
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}
        >
          {label}
        </Typography>
      </Box>
    );
  }

  return (
    <Card
      component={RouterLink}
      to={to}
      sx={{
        display: 'block', position: 'relative', textDecoration: 'none',
        height: '100%', overflow: 'hidden',
        '&:hover img': { transform: 'scale(1.06)' },
        '&:hover': { borderColor: 'primary.main' },
        ...sx,
      }}
    >
      <Box sx={{ position: 'relative', pt: '72%', overflow: 'hidden', bgcolor: 'action.hover' }}>
        <Box
          component="img"
          src={image}
          alt=""
          loading="lazy"
          sx={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', transition: 'transform 400ms ease',
          }}
        />
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {label}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        )}
        {count != null && (
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, display: 'block', mt: 1 }}>
            {count} products
          </Typography>
        )}
      </Box>
    </Card>
  );
}
