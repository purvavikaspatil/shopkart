import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Grid, Stack, Typography, Button, Drawer, IconButton, Pagination,
  ToggleButtonGroup, ToggleButton, Chip, Divider, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TuneIcon from '@mui/icons-material/Tune';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import FilterSidebar from '@/components/product/FilterSidebar';
import SortMenu from '@/components/product/SortMenu';
import { useProducts } from '@/hooks';
import { categoryNames } from '@/data/categories';

/** Reads the category / subcategory hints the navbar links pass in. */
function initialFiltersFromParams(params) {
  const category = params.get('category');
  const subcategory = params.get('subcategory');
  return {
    categories: category && categoryNames.includes(category) ? [category] : [],
    subcategories: subcategory ? [subcategory] : [],
  };
}

export default function ShopPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [searchParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const products = useProducts({ initialFilters: initialFiltersFromParams(searchParams) });
  const {
    items, total, pageCount, page, setPage, loading,
    filters, updateFilters, toggleFilterValue, resetFilters, activeFilterCount,
    sort, changeSort,
  } = products;

  // Keep the window scrolled to the top of the grid on page change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const sidebar = (
    <FilterSidebar
      filters={filters}
      onToggle={toggleFilterValue}
      onUpdate={updateFilters}
      onReset={() => resetFilters()}
      activeCount={activeFilterCount}
    />
  );

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />

      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h3">All products</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {loading ? 'Loading products…' : `${total} ${total === 1 ? 'product' : 'products'}`}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* Desktop sidebar */}
        <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ position: 'sticky', top: 96 }}>{sidebar}</Box>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={9}>
          {/* Toolbar */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Button>

            <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }} />

            <Stack direction="row" spacing={1} alignItems="center">
              <SortMenu value={sort} onChange={changeSort} />
              <ToggleButtonGroup
                exclusive
                size="small"
                value={view}
                onChange={(_, next) => next && setView(next)}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <ToggleButton value="grid" aria-label="Grid view"><GridViewIcon fontSize="small" /></ToggleButton>
                <ToggleButton value="list" aria-label="List view"><ViewListIcon fontSize="small" /></ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2 }} alignItems="center">
              {filters.categories.map((c) => (
                <Chip key={c} label={c} size="small" onDelete={() => toggleFilterValue('categories', c)} />
              ))}
              {filters.brands.map((b) => (
                <Chip key={b} label={b} size="small" onDelete={() => toggleFilterValue('brands', b)} />
              ))}
              {filters.colors.map((c) => (
                <Chip key={c} label={c} size="small" onDelete={() => toggleFilterValue('colors', c)} />
              ))}
              {filters.minRating > 0 && (
                <Chip label={`${filters.minRating}★ & up`} size="small" onDelete={() => updateFilters({ minRating: 0 })} />
              )}
              {filters.inStockOnly && (
                <Chip label="In stock" size="small" onDelete={() => updateFilters({ inStockOnly: false })} />
              )}
              <Button size="small" onClick={() => resetFilters()}>Clear all</Button>
            </Stack>
          )}

          {!loading && items.length === 0 ? (
            <EmptyState
              title="No products match those filters"
              description="Try removing a filter or two — you might be narrowing things down more than you meant to."
              primaryLabel="Clear all filters"
              onPrimary={() => resetFilters()}
            />
          ) : (
            <>
              <ProductGrid
                products={items}
                loading={loading}
                layout={view === 'list' ? 'list' : 'standard'}
                skeletonCount={9}
              />

              {pageCount > 1 && (
                <Stack alignItems="center" sx={{ mt: 4 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                </Stack>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile filter drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: '86%', maxWidth: 360, p: 2 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close filters">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 1 }} />
        {sidebar}
        <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', pt: 2, mt: 2 }}>
          <Button fullWidth variant="contained" size="large" onClick={() => setDrawerOpen(false)}>
            Show {total} results
          </Button>
        </Box>
      </Drawer>
    </PageContainer>
  );
}
