import { Skeleton, Box, Grid, Card, CardContent, Stack, Divider } from '@mui/material';

/**
 * Skeleton placeholders that mirror the real layouts closely enough that
 * nothing jumps when data arrives.
 *
 * @param {{variant:'productGrid'|'productCard'|'productDetail'|'orderList'|'profile'|'categoryGrid'|'table'|'list',
 *          count?:number, columns?:object}} props
 */
export default function LoadingSkeleton({ variant = 'productGrid', count = 8, columns, sx = {} }) {
  const gridColumns = columns ?? { xs: 6, sm: 4, md: 3 };

  if (variant === 'productCard') {
    return (
      <Card sx={sx}>
        <Skeleton variant="rectangular" sx={{ pt: '100%' }} />
        <CardContent sx={{ p: 1.5 }}>
          <Skeleton width="45%" height={14} />
          <Skeleton width="90%" height={20} sx={{ mt: 0.5 }} />
          <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'productGrid') {
    return (
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={sx}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid item {...gridColumns} key={i}>
            <LoadingSkeleton variant="productCard" />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (variant === 'categoryGrid') {
    return (
      <Grid container spacing={2} sx={sx}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
            <Skeleton variant="rounded" sx={{ pt: '100%', borderRadius: 3 }} />
            <Skeleton width="70%" height={18} sx={{ mt: 1, mx: 'auto' }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (variant === 'productDetail') {
    return (
      <Grid container spacing={{ xs: 3, md: 5 }} sx={sx}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rounded" sx={{ pt: '100%', borderRadius: 3 }} />
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" width={72} height={72} />
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton width="30%" height={18} />
          <Skeleton width="85%" height={38} sx={{ mt: 1 }} />
          <Skeleton width="45%" height={24} sx={{ mt: 1 }} />
          <Skeleton width="60%" height={44} sx={{ mt: 3 }} />
          <Divider sx={{ my: 3 }} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="92%" height={20} sx={{ mt: 0.5 }} />
          <Skeleton width="70%" height={20} sx={{ mt: 0.5 }} />
          <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
            <Skeleton variant="rounded" width={180} height={48} />
            <Skeleton variant="rounded" width={180} height={48} />
          </Stack>
        </Grid>
      </Grid>
    );
  }

  if (variant === 'orderList') {
    return (
      <Stack spacing={2} sx={sx}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Skeleton width={160} height={20} />
                <Skeleton width={90} height={24} />
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="rounded" width={72} height={72} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="35%" height={18} sx={{ mt: 0.5 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  if (variant === 'profile') {
    return (
      <Box sx={sx}>
        <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
          <Skeleton variant="circular" width={88} height={88} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="40%" height={30} />
            <Skeleton width="55%" height={20} sx={{ mt: 0.5 }} />
          </Box>
        </Stack>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={6} sm={4} md={2} key={i}>
              <Skeleton variant="rounded" height={104} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (variant === 'table') {
    return (
      <Stack spacing={1} sx={sx}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={52} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5} sx={sx}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={64} />
      ))}
    </Stack>
  );
}
