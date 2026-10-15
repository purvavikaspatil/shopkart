import { useState } from 'react';
import {
  Box, Grid, Card, Typography, Button, Stack, Divider, Chip, MenuItem,
  TextField, Checkbox, FormControlLabel, Radio, RadioGroup, Alert, Stepper,
  Step, StepLabel,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { orderService } from '@/services';
import { useOrders, useAsync, useToast } from '@/hooks';
import { formatPrice, formatDate, addDays } from '@/utils/format';
import { RETURN_REASONS } from '@/utils/constants';

export default function ReturnsPage() {
  const toast = useToast();
  const { delivered, loading: ordersLoading } = useOrders();
  const returns = useAsync(() => orderService.getReturns(), []);

  const [activeOrder, setActiveOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [comments, setComments] = useState('');
  const [refundMethod, setRefundMethod] = useState('Original payment method');
  const [submitting, setSubmitting] = useState(false);

  const startReturn = (order) => {
    setActiveOrder(order);
    // Pre-select every line by default.
    setSelectedItems(Object.fromEntries(order.items.map((i) => [i.key ?? i.productId, true])));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    const items = activeOrder.items.filter((i) => selectedItems[i.key ?? i.productId]);
    if (items.length === 0) { toast.error('Select at least one item to return.'); return; }

    setSubmitting(true);
    try {
      await orderService.createReturn({
        orderId: activeOrder.id,
        items,
        reason,
        comments,
        refundMethod,
        pickupDate: addDays(new Date(), 2),
      });
      toast.success('Return requested. We will pick it up within 2 days.');
      setActiveOrder(null);
      returns.refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Return request form ---
  if (activeOrder) {
    const items = activeOrder.items.filter((i) => selectedItems[i.key ?? i.productId]);
    const refundAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
      <PageContainer>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Returns', to: '/returns' }, { label: activeOrder.id }]} />
        <Typography variant="h4" sx={{ mb: 3 }}>Return items from {activeOrder.id}</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>Which items?</Typography>
              <Stack divider={<Divider />}>
                {activeOrder.items.map((item) => {
                  const key = item.key ?? item.productId;
                  return (
                    <FormControlLabel
                      key={key}
                      sx={{ py: 1, mx: 0, alignItems: 'center' }}
                      control={
                        <Checkbox
                          checked={Boolean(selectedItems[key])}
                          onChange={(e) => setSelectedItems({ ...selectedItems, [key]: e.target.checked })}
                        />
                      }
                      label={
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 1 }}>
                          <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                            <Typography variant="caption" color="text.secondary">Qty {item.quantity} · {formatPrice(item.price * item.quantity)}</Typography>
                          </Box>
                        </Stack>
                      }
                    />
                  );
                })}
              </Stack>
            </Card>

            <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>Reason</Typography>
              <TextField select fullWidth value={reason} onChange={(e) => setReason(e.target.value)} sx={{ mb: 2 }}>
                {RETURN_REASONS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
              <TextField
                fullWidth multiline rows={3}
                label="Additional comments (optional)"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Card>

            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>Refund to</Typography>
              <RadioGroup value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)}>
                <FormControlLabel value="Original payment method" control={<Radio />} label="Original payment method" />
                <FormControlLabel value="ShopNest wallet (instant)" control={<Radio />} label="ShopNest wallet — credited instantly" />
              </RadioGroup>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, position: { md: 'sticky' }, top: 96 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>Summary</Typography>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Items selected</Typography>
                <Typography variant="body2">{items.length}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Refund amount</Typography>
                <Typography variant="h6">{formatPrice(refundAmount)}</Typography>
              </Stack>
              <Alert severity="info" sx={{ mb: 2 }}>
                Free pickup will be scheduled within 2 days. Keep the item in its original packaging.
              </Alert>
              <Stack spacing={1}>
                <Button variant="contained" fullWidth onClick={submit} disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Confirm return'}
                </Button>
                <Button color="inherit" fullWidth onClick={() => setActiveOrder(null)}>Cancel</Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </PageContainer>
    );
  }

  // --- Landing: eligible orders + existing returns ---
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Returns' }]} />
      <Typography variant="h3" sx={{ mb: 1 }}>Returns</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Delivered orders can be returned within their return window. Pickups are free.
      </Typography>

      {/* Existing returns */}
      {(returns.data?.length ?? 0) > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>In progress</Typography>
          <Stack spacing={1.5}>
            {returns.data.map((ret) => (
              <Card key={ret.id} sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2">{ret.id} · from {ret.orderId}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ret.items.length} item(s) · {formatPrice(ret.amount)} · requested {formatDate(ret.createdAt)}
                    </Typography>
                  </Box>
                  <Chip size="small" color="info" label={ret.status} />
                </Stack>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      <Typography variant="h6" sx={{ mb: 1.5 }}>Eligible orders</Typography>
      {ordersLoading ? (
        <LoadingSkeleton variant="orderList" count={2} />
      ) : delivered.length === 0 ? (
        <EmptyState
          icon={<ReplayIcon />}
          title="No orders to return"
          description="Only delivered orders can be returned. Once something arrives, you can start a return here."
          primaryLabel="View your orders"
          primaryTo="/orders"
        />
      ) : (
        <Stack spacing={1.5}>
          {delivered.map((order) => (
            <Card key={order.id} sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box component="img" src={order.items[0].thumbnail} alt="" sx={{ width: 52, height: 52, borderRadius: 1.5, objectFit: 'cover' }} />
                  <Box>
                    <Typography variant="subtitle2">{order.id}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Delivered · {order.items.length} item(s) · {formatPrice(order.totals.total)}
                    </Typography>
                  </Box>
                </Stack>
                <Button variant="outlined" startIcon={<ReplayIcon />} onClick={() => startReturn(order)}>
                  Return items
                </Button>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </PageContainer>
  );
}
