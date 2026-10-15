import { Grid, Box } from '@mui/material';
import ProductCard from './ProductCard';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

/**
 * Responsive product grid.
 *
 * `layout` presets cover the density options the shop page exposes and the
 * different looks used across the homepage:
 *   standard  - 4 columns on desktop
 *   compact   - 5-6 columns, denser cards
 *   premium   - 3 wide columns with featured cards
 *   list      - single column of horizontal cards
 *
 * @param {{products:Array, layout?:string, loading?:boolean, skeletonCount?:number}} props
 */
const LAYOUTS = {
  standard: { cols: { xs: 6, sm: 4, md: 3 }, variant: 'standard', spacing: { xs: 1.5, sm: 2, md: 2.5 } },
  compact: { cols: { xs: 6, sm: 4, md: 3, lg: 2 }, variant: 'compact', spacing: { xs: 1, sm: 1.5, md: 2 } },
  premium: { cols: { xs: 12, sm: 6, md: 4 }, variant: 'featured', spacing: { xs: 2, md: 3 } },
  list: { cols: { xs: 12 }, variant: 'horizontal', spacing: 2 },
};

export default function ProductGrid({
  products = [],
  layout = 'standard',
  loading = false,
  skeletonCount = 8,
  showCompare = true,
  showQuickAdd = true,
  sx = {},
}) {
  const config = LAYOUTS[layout] ?? LAYOUTS.standard;

  if (loading) {
    return (
      <LoadingSkeleton
        variant={layout === 'list' ? 'list' : 'productGrid'}
        count={skeletonCount}
        columns={config.cols}
        sx={sx}
      />
    );
  }

  return (
    <Box sx={sx}>
      <Grid container spacing={config.spacing}>
        {products.map((product) => (
          <Grid item {...config.cols} key={product.id}>
            <ProductCard
              product={product}
              variant={config.variant}
              showCompare={showCompare && layout !== 'list'}
              showQuickAdd={showQuickAdd}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
