import { Box, Typography } from '@mui/material';
import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import PromoBanner from '@/components/product/PromoBanner';
import ProductGrid from '@/components/product/ProductGrid';
import { productService } from '@/services';
import { useAsync } from '@/hooks';

/** Curated "just landed" list. */
export default function NewArrivalsPage() {
  const { data, loading } = useAsync(() => productService.getNewArrivals(24), []);

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'New arrivals' }]} />
      <PromoBanner
        eyebrow="Fresh drops"
        title="New arrivals"
        body="The latest across every department, updated through the week. Get in before it sells out."
        image="https://picsum.photos/seed/shopnest-new-hero/1600/500"
        tone="secondary"
        height={{ xs: 200, md: 240 }}
        sx={{ mb: 4 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {loading ? 'Loading…' : `${data?.length ?? 0} new products`}
      </Typography>
      <ProductGrid products={data ?? []} loading={loading} skeletonCount={12} />
    </PageContainer>
  );
}
