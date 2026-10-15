import { Card, Stack, Typography, Divider, Box, Chip } from '@mui/material';
import { formatPrice } from '@/utils/format';

/** One label/value line. `strong` renders the grand total. */
function Line({ label, value, color, strong = false, free = false }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant={strong ? 'subtitle1' : 'body2'} color={strong ? 'text.primary' : 'text.secondary'}>
        {label}
      </Typography>
      {free ? (
        <Chip size="small" color="success" label="FREE" />
      ) : (
        <Typography variant={strong ? 'h6' : 'body2'} color={color} sx={{ fontWeight: strong ? 700 : 500 }}>
          {value}
        </Typography>
      )}
    </Stack>
  );
}

/**
 * Price breakdown shared by the cart and checkout.
 * @param {{totals:object, coupon?:object|null, title?:string}} props
 */
export default function OrderSummary({ totals, coupon = null, title = 'Order summary' }) {
  return (
    <Card sx={{ p: 2.5 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>

      <Stack spacing={1.25}>
        <Line label={`Items (${totals.itemCount})`} value={formatPrice(totals.mrpTotal)} />

        {totals.productDiscount > 0 && (
          <Line label="Product discount" value={`− ${formatPrice(totals.productDiscount)}`} color="success.main" />
        )}

        {totals.couponDiscount > 0 && (
          <Line
            label={coupon ? `Coupon (${coupon.code})` : 'Coupon'}
            value={`− ${formatPrice(totals.couponDiscount)}`}
            color="success.main"
          />
        )}

        <Line
          label="Shipping"
          value={formatPrice(totals.shipping)}
          free={totals.shipping === 0}
        />

        <Line label="Tax (5% GST)" value={formatPrice(totals.tax)} />

        {totals.codFee > 0 && (
          <Line label="Cash on delivery fee" value={formatPrice(totals.codFee)} />
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Line label="Total" value={formatPrice(totals.total)} strong />

      {totals.savings > 0 && (
        <Box sx={{ mt: 1.5, p: 1, borderRadius: 1.5, bgcolor: 'success.main', color: 'success.contrastText', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            You are saving {formatPrice(totals.savings)} on this order
          </Typography>
        </Box>
      )}
    </Card>
  );
}
