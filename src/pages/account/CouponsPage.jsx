import { Box, Grid, Typography, Stack, Divider } from '@mui/material';
import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import CouponCard from '@/components/product/CouponCard';
import { userService } from '@/services';
import { useAsync } from '@/hooks';

/** All coupons, split into active and expired sections. */
export default function CouponsPage() {
  const { data, loading } = useAsync(() => userService.getCoupons(), []);

  const active = (data ?? []).filter((c) => !c.isExpired);
  const expired = (data ?? []).filter((c) => c.isExpired);

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Coupons' }]} />
      <Typography variant="h3" sx={{ mb: 1 }}>Coupons & offers</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Copy a code and paste it at checkout. Discounts apply automatically once the order qualifies.
      </Typography>

      {loading ? (
        <LoadingSkeleton variant="orderList" count={4} />
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>Available now ({active.length})</Typography>
          <Grid container spacing={2}>
            {active.map((coupon) => (
              <Grid item xs={12} md={6} key={coupon.code}>
                <CouponCard coupon={coupon} />
              </Grid>
            ))}
          </Grid>

          {expired.length > 0 && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>Expired</Typography>
              <Grid container spacing={2}>
                {expired.map((coupon) => (
                  <Grid item xs={12} md={6} key={coupon.code}>
                    <CouponCard coupon={coupon} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
