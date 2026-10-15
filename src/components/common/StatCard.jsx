import { Card, CardContent, Box, Typography, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

/**
 * Metric tile used on the admin dashboard and the profile summary.
 * `delta` is a signed percentage; positive renders green, negative red.
 */
export default function StatCard({ label, value, delta, icon, color = 'primary', caption, sx = {} }) {
  const positive = delta != null && delta >= 0;

  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" noWrap>{label}</Typography>
            <Typography variant="h4" sx={{ mt: 0.5, fontVariantNumeric: 'tabular-nums' }}>
              {value}
            </Typography>
          </Box>

          {icon && (
            <Box
              sx={{
                width: 42, height: 42, flexShrink: 0, borderRadius: 2,
                display: 'grid', placeItems: 'center',
                bgcolor: `${color}.main`, color: `${color}.contrastText`,
                '& svg': { fontSize: 22 },
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>

        {(delta != null || caption) && (
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1.5 }}>
            {delta != null && (
              <>
                {positive
                  ? <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  : <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />}
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: positive ? 'success.main' : 'error.main' }}
                >
                  {positive ? '+' : ''}{delta}%
                </Typography>
              </>
            )}
            {caption && (
              <Typography variant="caption" color="text.secondary">{caption}</Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
