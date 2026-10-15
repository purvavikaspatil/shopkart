import { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Grid, Card, Typography, Button, Stack, Divider, Chip, Alert,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import DownloadIcon from '@mui/icons-material/Download';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import OrderStatusChip from '@/components/order/OrderStatusChip';
import OrderSummary from '@/components/order/OrderSummary';
import { orderService } from '@/services';
import { useAsync, useToast } from '@/hooks';
import { formatPrice, formatDate } from '@/utils/format';
import { ORDER_STATUS } from '@/utils/constants';

export default function OrderDetailPage() {
  const { id } = useParams();
  const toast = useToast();
  const { data: order, loading, error, refetch } = useAsync(() => orderService.getOrderById(id), [id]);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (loading) return <PageContainer><LoadingSkeleton variant="profile" /></PageContainer>;
  if (error || !order) return <PageContainer><ErrorState variant="notFound" onRetry={refetch} /></PageContainer>;

  const canCancel = ![ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.RETURNED].includes(order.status);
  const canTrack = canCancel;
  const delivered = order.status === ORDER_STATUS.DELIVERED;

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await orderService.cancelOrder(order.id);
      toast.success('Order cancelled. Any payment will be refunded.');
      setCancelOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders', to: '/orders' }, { label: order.id }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'monospace' }}>{order.id}</Typography>
          <Typography variant="body2" color="text.secondary">Placed on {formatDate(order.createdAt)}</Typography>
        </Box>
        <OrderStatusChip status={order.status} size="medium" />
      </Stack>

      {order.status === ORDER_STATUS.CANCELLED && (
        <Alert severity="error" sx={{ mb: 3 }}>
          This order was cancelled{order.cancelledAt ? ` on ${formatDate(order.cancelledAt)}` : ''}.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Items */}
          <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Items ({order.totals.itemCount})</Typography>
            <Stack divider={<Divider />} spacing={2}>
              {order.items.map((item) => (
                <Stack key={item.key ?? item.productId} direction="row" spacing={2} alignItems="center">
                  <Box component={RouterLink} to={`/product/${item.productId}`}>
                    <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: 64, height: 64, borderRadius: 1.5, objectFit: 'cover', display: 'block' }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      component={RouterLink}
                      to={`/product/${item.productId}`}
                      variant="body2"
                      sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Qty {item.quantity}{item.size ? ` · ${item.size}` : ''}{item.color ? ` · ${item.color}` : ''}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2">{formatPrice(item.price * item.quantity)}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>

          {/* Shipping address */}
          <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Shipping address</Typography>
            <Typography variant="subtitle2">{order.address?.fullName} · {order.address?.label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {order.address?.line1}, {order.address?.line2}, {order.address?.city}, {order.address?.state} {order.address?.pincode}
            </Typography>
            <Typography variant="body2" color="text.secondary">Phone: {order.address?.phone}</Typography>
          </Card>

          {/* Delivery / payment meta */}
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Delivery</Typography>
                <Typography variant="body2">{order.delivery?.label}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Payment</Typography>
                <Typography variant="body2">{order.payment?.label}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Courier</Typography>
                <Typography variant="body2">{order.partner}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Tracking no.</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{order.trackingNumber}</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Summary + actions */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: 96 }}>
            <OrderSummary totals={order.totals} coupon={order.coupon} title="Payment summary" />

            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {canTrack && (
                <Button component={RouterLink} to={`/orders/${order.id}/track`} variant="contained" fullWidth startIcon={<LocalShippingOutlinedIcon />}>
                  Track order
                </Button>
              )}
              {delivered && (
                <Button component={RouterLink} to="/returns" variant="outlined" fullWidth startIcon={<ReplayIcon />}>
                  Return or replace
                </Button>
              )}
              <Button variant="outlined" fullWidth startIcon={<DownloadIcon />} onClick={() => toast.info('Invoice download is not available in this demo.')}>
                Download invoice
              </Button>
              {canCancel && (
                <Button color="error" fullWidth startIcon={<CancelOutlinedIcon />} onClick={() => setCancelOpen(true)}>
                  Cancel order
                </Button>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={confirmCancel}
        loading={cancelling}
        title="Cancel this order?"
        message="This cannot be undone. If you have already paid, the amount will be refunded to your original payment method within 5–7 business days."
        confirmLabel="Yes, cancel order"
        cancelLabel="Keep order"
      />
    </PageContainer>
  );
}
