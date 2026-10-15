import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Box, Grid, Stack, Typography, Button, Drawer, IconButton, Pagination,
  Chip, Divider,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import FilterSidebar from '@/components/product/FilterSidebar';
import SortMenu from '@/components/product/SortMenu';
import { useProducts } from '@/hooks';
import { getCategoryBySlug } from '@/data/categories';

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const products = useProducts({
    initialFilters: { categories: category ? [category.name] : [] },
  });
  const {
    items, total, pageCount, page, setPage, loading,
    filters, updateFilters, toggleFilterValue, resetFilters, activeFilterCount,
    sort, changeSort,
  } = products;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // Unknown slug — hand off to the 404 route.
  if (!category) return <Navigate to="/404" replace />;

  const subcategoryOptions = category.subcategories.map((s) => s.name);

  const sidebar = (
    <FilterSidebar
      filters={filters}
      onToggle={toggleFilterValue}
      onUpdate={updateFilters}
      onReset={() => resetFilters({ categories: [category.name] })}
      hideCategory
      subcategoryOptions={subcategoryOptions}
      activeCount={activeFilterCount}
    />
  );

  return (
    <Box>
      {/* Category banner */}
      <Box sx={{ position: 'relative', height: { xs: 180, md: 260 }, overflow: 'hidden' }}>
        <Box component="img" src={category.banner} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${category.color}E6, ${category.color}77)` }} />
        <PageContainer py={0} sx={{ position: 'relative', height: '100%' }}>
          <Stack justifyContent="center" sx={{ height: '100%', color: '#fff' }}>
            <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: '1.8rem', md: '2.6rem' } }}>
              {category.name}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', mt: 1, maxWidth: 560 }}>
              {category.tagline}
            </Typography>
          </Stack>
        </PageContainer>
      </Box>

      <PageContainer>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/categories' }, { label: category.name }]} />

        {/* Subcategory quick filters */}
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          <Chip
            label="All"
            color={filters.subcategories.length === 0 ? 'primary' : 'default'}
            variant={filters.subcategories.length === 0 ? 'filled' : 'outlined'}
            onClick={() => updateFilters({ subcategories: [] })}
          />
          {subcategoryOptions.map((name) => (
            <Chip
              key={name}
              label={name}
              color={filters.subcategories.includes(name) ? 'primary' : 'default'}
              variant={filters.subcategories.includes(name) ? 'filled' : 'outlined'}
              onClick={() => toggleFilterValue('subcategories', name)}
            />
          ))}
        </Stack>

        <Grid container spacing={3}>
          <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 96 }}>{sidebar}</Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {loading ? 'Loading…' : `${total} products`}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<TuneIcon />} onClick={() => setDrawerOpen(true)} sx={{ display: { md: 'none' } }}>
                  Filters
                </Button>
                <SortMenu value={sort} onChange={changeSort} />
              </Stack>
            </Stack>

            {!loading && items.length === 0 ? (
              <EmptyState
                title="Nothing here with those filters"
                description="Loosen a filter to see more of this category."
                primaryLabel="Clear filters"
                onPrimary={() => resetFilters({ categories: [category.name] })}
              />
            ) : (
              <>
                <ProductGrid products={items} loading={loading} skeletonCount={9} />
                {pageCount > 1 && (
                  <Stack alignItems="center" sx={{ mt: 4 }}>
                    <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} color="primary" shape="rounded" />
                  </Stack>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </PageContainer>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: '86%', maxWidth: 360, p: 2 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close filters"><CloseIcon /></IconButton>
        </Stack>
        <Divider sx={{ mb: 1 }} />
        {sidebar}
        <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', pt: 2, mt: 2 }}>
          <Button fullWidth variant="contained" size="large" onClick={() => setDrawerOpen(false)}>Show {total} results</Button>
        </Box>
      </Drawer>
    </Box>
  );
}
