import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Grid, Card, Typography, Button, Stack, Divider, Chip,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';
import OrderTracker from '@/components/order/OrderTracker';
import OrderStatusChip from '@/components/order/OrderStatusChip';
import { orderService } from '@/services';
import { useAsync } from '@/hooks';
import { formatDate, formatDateTime } from '@/utils/format';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { data: tracking, loading, error, refetch } = useAsync(() => orderService.getTracking(id), [id]);

  if (loading) return <PageContainer><LoadingSkeleton variant="profile" /></PageContainer>;
  if (error || !tracking) return <PageContainer><ErrorState variant="notFound" onRetry={refetch} /></PageContainer>;

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders', to: '/orders' }, { label: id, to: `/orders/${id}` }, { label: 'Track' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Track your order</Typography>
          <Typography variant="body2" color="text.secondary">
            {tracking.partner} · Tracking no. <Box component="span" sx={{ fontFamily: 'monospace' }}>{tracking.trackingNumber}</Box>
          </Typography>
        </Box>
        <OrderStatusChip status={tracking.status} size="medium" />
      </Stack>

      {/* Progress */}
      <Card sx={{ p: { xs: 2, md: 4 }, mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <LocalShippingOutlinedIcon color="primary" />
          <Box>
            <Typography variant="subtitle1">
              Estimated delivery by {formatDate(tracking.estimatedDelivery)}
            </Typography>
            {tracking.currentLocation && (
              <Typography variant="caption" color="text.secondary">
                Currently near {tracking.currentLocation}
              </Typography>
            )}
          </Box>
        </Stack>
        <OrderTracker timeline={tracking.timeline} />
      </Card>

      <Grid container spacing={3}>
        {/* Event log */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Shipment updates</Typography>
            <Stack spacing={0}>
              {tracking.events.map((event, i) => (
                <Stack key={event.stage} direction="row" spacing={2}>
                  {/* Timeline rail */}
                  <Stack alignItems="center">
                    <FiberManualRecordIcon
                      sx={{ fontSize: 14, color: i === 0 ? 'primary.main' : 'text.disabled', mt: 0.4 }}
                    />
                    {i < tracking.events.length - 1 && (
                      <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', minHeight: 32 }} />
                    )}
                  </Stack>
                  <Box sx={{ pb: 2.5 }}>
                    <Typography variant="subtitle2">{event.stage}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {event.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(event.at)}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Help */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Need help with this order?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              If something looks wrong or your parcel is delayed, our team can look into it.
            </Typography>
            <Stack spacing={1}>
              <Button component={RouterLink} to={`/orders/${id}`} variant="outlined" fullWidth>
                View order details
              </Button>
              <Button component={RouterLink} to="/contact" fullWidth color="inherit">
                Contact support
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
