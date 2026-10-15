import { Box, Typography } from '@mui/material';
import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import PromoBanner from '@/components/product/PromoBanner';
import ProductGrid from '@/components/product/ProductGrid';
import { productService } from '@/services';
import { useAsync } from '@/hooks';

/** Products flagged as best sellers, most-reviewed first. */
export default function BestSellersPage() {
  const { data, loading } = useAsync(() => productService.getBestSellers(24), []);

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Best sellers' }]} />
      <PromoBanner
        eyebrow="Loved by thousands"
        title="Best sellers"
        body="The products our shoppers keep coming back to, ranked by ratings and repeat purchases."
        image="https://picsum.photos/seed/shopnest-best-hero/1600/500"
        tone="primary"
        height={{ xs: 200, md: 240 }}
        sx={{ mb: 4 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {loading ? 'Loading…' : `Top ${data?.length ?? 0} products`}
      </Typography>
      <ProductGrid products={data ?? []} loading={loading} skeletonCount={12} />
    </PageContainer>
  );
}
