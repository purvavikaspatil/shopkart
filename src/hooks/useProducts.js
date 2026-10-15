import { useState, useMemo, useCallback } from 'react';
import { productService } from '@/services';
import useAsync from './useAsync';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';

/** Filter shape used by the shop, search and category pages. */
export const emptyFilters = {
  query: '',
  categories: [],
  subcategories: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
  minRating: 0,
  minDiscount: 0,
  inStockOnly: false,
  colors: [],
  sizes: [],
  materials: [],
  tags: [],
};

/**
 * Drives every product listing page: filters, sorting and pagination in one hook.
 *
 * @param {{ initialFilters?: object, initialSort?: string, perPage?: number }} [options]
 */
export function useProducts(options = {}) {
  const {
    initialFilters = {},
    initialSort = 'featured',
    perPage = PRODUCTS_PER_PAGE,
  } = options;

  const [filters, setFilters] = useState({ ...emptyFilters, ...initialFilters });
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);

  // A stable key means the async effect only re-runs when something real changed.
  const key = useMemo(() => JSON.stringify({ filters, sort, page, perPage }), [filters, sort, page, perPage]);

  const { data, loading, error, refetch } = useAsync(
    () => productService.getProducts({ filters, sort, page, perPage }),
    [key],
  );

  /** Merges a partial filter update and resets to page 1. */
  const updateFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }, []);

  /** Adds or removes one value from an array-type facet. */
  const toggleFilterValue = useCallback((field, value) => {
    setFilters((prev) => {
      const list = prev[field] ?? [];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [field]: next };
    });
    setPage(1);
  }, []);

  const resetFilters = useCallback((overrides = {}) => {
    setFilters({ ...emptyFilters, ...overrides });
    setPage(1);
  }, []);

  const changeSort = useCallback((value) => {
    setSort(value);
    setPage(1);
  }, []);

  /** Number of facets currently narrowing the results - shown on the filter button. */
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length) count += filters.categories.length;
    if (filters.subcategories.length) count += filters.subcategories.length;
    if (filters.brands.length) count += filters.brands.length;
    if (filters.colors.length) count += filters.colors.length;
    if (filters.sizes.length) count += filters.sizes.length;
    if (filters.materials.length) count += filters.materials.length;
    if (filters.minRating) count += 1;
    if (filters.minDiscount) count += 1;
    if (filters.inStockOnly) count += 1;
    if (filters.minPrice != null || filters.maxPrice != null) count += 1;
    return count;
  }, [filters]);

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    pageCount: data?.pageCount ?? 1,
    facets: data?.facets ?? { brands: [], categories: [] },
    loading,
    error,
    refetch,
    filters,
    setFilters,
    updateFilters,
    toggleFilterValue,
    resetFilters,
    activeFilterCount,
    sort,
    changeSort,
    page,
    setPage,
    perPage,
  };
}

export default useProducts;
