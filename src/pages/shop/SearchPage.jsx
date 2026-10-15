import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Grid, Stack, Typography, Button, Drawer, IconButton, Pagination,
  Chip, Divider,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useState } from 'react';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import FilterSidebar from '@/components/product/FilterSidebar';
import SortMenu from '@/components/product/SortMenu';
import { useProducts } from '@/hooks';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [drawerOpen, setDrawerOpen] = useState(false);

  const products = useProducts({ initialFilters: { query } });
  const {
    items, total, pageCount, page, setPage, loading,
    filters, updateFilters, toggleFilterValue, resetFilters, activeFilterCount,
    sort, changeSort, setFilters,
  } = products;

  // When the query in the URL changes, push it into the filter state.
  useEffect(() => {
    setFilters((prev) => ({ ...prev, query }));
    setPage(1);
  }, [query, setFilters, setPage]);

  const sidebar = (
    <FilterSidebar
      filters={filters}
      onToggle={toggleFilterValue}
      onUpdate={updateFilters}
      onReset={() => resetFilters({ query })}
      activeCount={activeFilterCount}
    />
  );

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h3">
          {query ? `Results for “${query}”` : 'Search'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {loading ? 'Searching…' : `${total} ${total === 1 ? 'match' : 'matches'} found`}
        </Typography>
      </Box>

      {!loading && items.length === 0 ? (
        <EmptyState
          icon={<SearchOffIcon />}
          title={query ? `Nothing matched “${query}”` : 'Type something to search'}
          description="Check the spelling, try a more general word, or browse the full shop instead."
          primaryLabel="Browse all products"
          primaryTo="/shop"
          secondaryLabel="Clear filters"
          onSecondary={() => resetFilters({ query })}
        />
      ) : (
        <Grid container spacing={3}>
          <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 96 }}>{sidebar}</Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={() => setDrawerOpen(true)}
                sx={{ display: { md: 'none' } }}
              >
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Button>
              <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }} />
              <SortMenu value={sort} onChange={changeSort} />
            </Stack>

            <ProductGrid products={items} loading={loading} skeletonCount={9} />

            {pageCount > 1 && (
              <Stack alignItems="center" sx={{ mt: 4 }}>
                <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} color="primary" shape="rounded" />
              </Stack>
            )}
          </Grid>
        </Grid>
      )}

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
    </PageContainer>
  );
}
