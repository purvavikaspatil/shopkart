import { Box, Typography, Rating, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { formatNumber } from '@/utils/format';

/**
 * Compact rating display.
 * `variant="chip"` gives the dense green pill used on product cards;
 * `variant="stars"` gives the full star row used on detail pages.
 */
export default function RatingBadge({
  value = 0, count, variant = 'chip', size = 'small', showCount = true, sx = {},
}) {
  if (variant === 'stars') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', ...sx }}>
        <Rating value={value} precision={0.1} readOnly size={size} />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{value.toFixed(1)}</Typography>
        {showCount && count != null && (
          <Typography variant="body2" color="text.secondary">
            ({formatNumber(count)} {count === 1 ? 'review' : 'reviews'})
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, ...sx }}>
      <Chip
        size="small"
        color={value >= 4 ? 'success' : value >= 3 ? 'warning' : 'error'}
        icon={<StarIcon sx={{ fontSize: 13, color: 'inherit !important' }} />}
        label={value.toFixed(1)}
        sx={{ height: 21, '& .MuiChip-label': { px: 0.6, fontSize: '0.7rem' } }}
      />
      {showCount && count != null && (
        <Typography variant="caption" color="text.secondary">
          {formatNumber(count)}
        </Typography>
      )}
    </Box>
  );
}
