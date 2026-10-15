import { useRef } from 'react';
import { Box, Typography, Stack, Card } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductGrid from '@/components/product/ProductGrid';
import CountdownTimer from '@/components/common/CountdownTimer';
import { productService } from '@/services';
import { useAsync } from '@/hooks';

/** Discounted products, highest discount first, with a running countdown. */
export default function DealsPage() {
  const { data, loading } = useAsync(() => productService.getDeals(24), []);
  const saleEnd = useRef(new Date(Date.now() + 8 * 3600 * 1000).toISOString());

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Deals' }]} />

      <Card
        sx={{
          p: { xs: 2.5, md: 4 }, mb: 4,
          color: '#fff',
          background: 'linear-gradient(120deg, #3D48D6, #B4456F)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <BoltIcon />
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>Limited time</Typography>
            </Stack>
            <Typography variant="h3" sx={{ color: '#fff' }}>Today's best deals</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', mt: 1, maxWidth: 480 }}>
              The steepest discounts across the store, refreshed daily. Prices climb back once the timer hits zero.
            </Typography>
          </Box>
          <Box sx={{ '& *': { color: '#fff !important' } }}>
            <CountdownTimer target={saleEnd.current} label="Sale ends in" />
          </Box>
        </Stack>
      </Card>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {loading ? 'Loading…' : `${data?.length ?? 0} products on offer`}
      </Typography>
      <ProductGrid products={data ?? []} loading={loading} skeletonCount={12} />
    </PageContainer>
  );
}
