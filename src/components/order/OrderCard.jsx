import { Card, Box, Typography, Stack, Button, Divider, AvatarGroup, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OrderStatusChip from './OrderStatusChip';
import { formatPrice, formatDate } from '@/utils/format';
import { ORDER_STATUS } from '@/utils/constants';

/** Summary card for one order in the orders list. */
export default function OrderCard({ order }) {
  const canTrack = ![ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.RETURNED].includes(order.status);
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ p: 2, bgcolor: 'action.hover' }}
      >
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography variant="caption" color="text.secondary">Order</Typography>
            <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>{order.id}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Placed</Typography>
            <Typography variant="subtitle2">{formatDate(order.createdAt)}</Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="caption" color="text.secondary">Total</Typography>
            <Typography variant="subtitle2">{formatPrice(order.totals.total)}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <OrderStatusChip status={order.status} />
        </Stack>
      </Stack>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 52, height: 52, borderRadius: 2 } }}>
            {order.items.map((item) => (
              <Avatar key={item.key ?? item.productId} variant="rounded" src={item.thumbnail} alt={item.title} />
            ))}
          </AvatarGroup>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {order.items[0].title}
              {order.items.length > 1 ? ` and ${order.items.length - 1} more` : ''}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} · {formatPrice(order.totals.total)}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          <Button
            component={RouterLink}
            to={`/orders/${order.id}`}
            variant="outlined"
            size="small"
            endIcon={<ChevronRightIcon />}
          >
            View details
          </Button>
          {canTrack && (
            <Button component={RouterLink} to={`/orders/${order.id}/track`} variant="contained" size="small">
              Track order
            </Button>
          )}
          {order.status === ORDER_STATUS.DELIVERED && (
            <Button component={RouterLink} to="/returns" size="small" color="inherit">
              Return or replace
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
