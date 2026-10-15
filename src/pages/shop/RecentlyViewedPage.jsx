import { Box, Typography, Button, Stack } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import { useRecentlyViewed } from '@/hooks';
import { productById } from '@/data/products';

/** Products the shopper has opened, newest first, from local history. */
export default function RecentlyViewedPage() {
  const { ids, clear } = useRecentlyViewed();
  const products = ids.map((id) => productById.get(id)).filter(Boolean);

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Recently viewed' }]} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h3">Recently viewed</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Kept on this device so you can pick up where you left off.
          </Typography>
        </Box>
        {products.length > 0 && (
          <Button color="inherit" onClick={clear}>Clear history</Button>
        )}
      </Stack>

      {products.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon />}
          title="No history yet"
          description="Products you open will show up here, so you can compare them later without hunting through the shop."
          primaryLabel="Start browsing"
          primaryTo="/shop"
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </PageContainer>
  );
}
