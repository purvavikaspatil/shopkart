import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, Typography, Button, Stack, Divider, Grid, Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import PageContainer from '@/components/common/PageContainer';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';
import { orderService } from '@/services';
import { useAsync } from '@/hooks';
import { formatPrice, formatDate } from '@/utils/format';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { data: order, loading, error, refetch } = useAsync(() => orderService.getOrderById(id), [id]);

  // Nudge the shopper back to the top when the confirmation loads.
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  if (loading) return <PageContainer><LoadingSkeleton variant="profile" /></PageContainer>;
  if (error || !order) return <PageContainer><ErrorState variant="notFound" onRetry={refetch} /></PageContainer>;

  return (
    <PageContainer>
      <Box sx={{ textAlign: 'center', py: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            width: 84, height: 84, mx: 'auto', mb: 2,
            borderRadius: '50%', display: 'grid', placeItems: 'center',
            bgcolor: 'success.main', color: 'success.contrastText',
            animation: 'pop 400ms ease',
            '@keyframes pop': { '0%': { transform: 'scale(0.6)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h3" sx={{ mb: 1 }}>Order confirmed</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>
          Thanks for shopping with us. We have emailed a receipt to your inbox and will let you know when your
          order ships.
        </Typography>
      </Box>

      <Card sx={{ p: { xs: 2, md: 3 }, maxWidth: 720, mx: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">Order number</Typography>
            <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>{order.id}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">Placed on</Typography>
            <Typography variant="subtitle2">{formatDate(order.createdAt)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">Total paid</Typography>
            <Typography variant="subtitle2">{formatPrice(order.totals.total)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">Payment</Typography>
            <Typography variant="subtitle2">{order.payment?.label}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <LocalShippingOutlinedIcon color="primary" />
          <Box>
            <Typography variant="subtitle2">
              Estimated delivery by {formatDate(order.estimatedDelivery)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Shipping to {order.address?.city}, {order.address?.state} {order.address?.pincode} · {order.partner}
            </Typography>
          </Box>
        </Stack>

        <Stack divider={<Divider />} spacing={1.5}>
          {order.items.map((item) => (
            <Stack key={item.key ?? item.productId} direction="row" spacing={2} alignItems="center">
              <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: 52, height: 52, borderRadius: 1.5, objectFit: 'cover' }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{item.title}</Typography>
                <Typography variant="caption" color="text.secondary">Qty {item.quantity}</Typography>
              </Box>
              <Typography variant="subtitle2">{formatPrice(item.price * item.quantity)}</Typography>
            </Stack>
          ))}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
          <Button component={RouterLink} to={`/orders/${order.id}/track`} variant="contained" fullWidth startIcon={<LocalShippingOutlinedIcon />}>
            Track order
          </Button>
          <Button component={RouterLink} to={`/orders/${order.id}`} variant="outlined" fullWidth startIcon={<ReceiptLongIcon />}>
            View order details
          </Button>
          <Button component={RouterLink} to="/shop" fullWidth color="inherit">
            Continue shopping
          </Button>
        </Stack>
      </Card>
    </PageContainer>
  );
}
