import { Box, Card, Typography, Stack, Chip, Divider } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { orderService } from '@/services';
import { useAsync } from '@/hooks';
import { formatPrice, formatDate } from '@/utils/format';

/** Colour per refund status. */
const STATUS_COLOR = { Credited: 'success', Processing: 'warning', Failed: 'error' };

export default function RefundsPage() {
  const { data, loading } = useAsync(() => orderService.getRefunds(), []);

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Refunds' }]} />
      <Typography variant="h3" sx={{ mb: 1 }}>Refunds</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Refunds from cancellations and returns show up here. Bank credits usually take 5–7 business days.
      </Typography>

      {loading ? (
        <LoadingSkeleton variant="orderList" count={3} />
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<CurrencyRupeeIcon />}
          title="No refunds yet"
          description="When you cancel a prepaid order or return an item, the refund will be tracked here."
          primaryLabel="View your orders"
          primaryTo="/orders"
        />
      ) : (
        <Stack spacing={1.5}>
          {data.map((refund) => (
            <Card key={refund.id} sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1}>
                <Box>
                  <Typography variant="subtitle2">{refund.id}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    From {refund.orderId} · {refund.method}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ textAlign: { sm: 'right' } }}>
                    <Typography variant="subtitle1">{formatPrice(refund.amount)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {refund.status === 'Credited' ? 'Credited' : 'Expected'} by {formatDate(refund.expectedBy)}
                    </Typography>
                  </Box>
                  <Chip size="small" color={STATUS_COLOR[refund.status] ?? 'default'} label={refund.status} />
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </PageContainer>
  );
}
