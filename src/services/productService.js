import {
  products as mockProducts, productById, productBySlug, brands as mockBrands,
  allColors, allSizes, allMaterials, priceBounds, brandShowcase,
} from '@/data/products';
import { reviewsByProduct, getRatingBreakdown } from '@/data/mockContent';
import { categories as localCategories, getCategoryBySlug as getLocalCategoryBySlug } from '@/data/categories';
import { apiRequest, fail } from './apiClient';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';

export const productService = {
  /**
   * Paged, filtered, sorted product list from backend API.
   */
  async getProducts({ filters = {}, sort = 'featured', page = 1, perPage = PRODUCTS_PER_PAGE } = {}) {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('perPage', String(perPage));
    if (sort) params.set('sort', sort);

    if (filters.query) params.set('search', filters.query);
    if (filters.categories?.length) params.set('category', filters.categories[0]);
    if (filters.subcategories?.length) params.set('subcategory', filters.subcategories[0]);
    if (filters.brands?.length) params.set('brand', filters.brands.join(','));
    if (filters.colors?.length) params.set('colors', filters.colors.join(','));
    if (filters.sizes?.length) params.set('sizes', filters.sizes.join(','));
    if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
    if (filters.minRating) params.set('minRating', String(filters.minRating));

    return apiRequest(`/products?${params.toString()}`, {
      fallback: () => {
        const q = (filters.query || '').trim().toLowerCase();
        let list = [...mockProducts];
        if (q) list = list.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
        if (filters.categories?.length) list = list.filter((p) => filters.categories.includes(p.category));
        const start = (page - 1) * perPage;
        return {
          items: list.slice(start, start + perPage),
          total: list.length,
          page,
          pageCount: Math.ceil(list.length / perPage) || 1,
          facets: {
            brands: localCategories.map((c) => ({ value: c.name, count: list.filter((p) => p.category === c.name).length })),
            categories: localCategories.map((c) => ({ value: c.name, count: list.filter((p) => p.category === c.name).length })),
          },
        };
      },
    }).then((data) => ({
      items: (data.items || []).map((p) => ({ ...p, id: p._id || p.id })),
      total: data.total || 0,
      page: data.page || page,
      pageCount: data.totalPages || Math.ceil((data.total || 1) / perPage) || 1,
      facets: data.facets || {
        brands: localCategories.map((c) => ({ value: c.name, count: (data.items || []).filter((p) => p.category === c.name).length })),
        categories: localCategories.map((c) => ({ value: c.name, count: (data.items || []).filter((p) => p.category === c.name).length })),
      },
    }));
  },

  /** Full catalogue without pagination. */
  async getAllProducts() {
    return apiRequest('/products/all', {
      fallback: () => mockProducts,
    }).then((items) => (items || []).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getProductById(id) {
    return apiRequest(`/products/${id}`, {
      fallback: () => {
        const prod = productById.get(Number(id)) || mockProducts.find((p) => p.id === id);
        if (!prod) fail('Product not found', 404, 'PRODUCT_NOT_FOUND');
        return prod;
      },
    }).then((p) => ({ ...p, id: p._id || p.id }));
  },

  async getProductBySlug(slug) {
    return apiRequest(`/products/slug/${slug}`, {
      fallback: () => {
        const prod = productBySlug.get(slug) || mockProducts.find((p) => p.slug === slug);
        if (!prod) fail('Product not found', 404, 'PRODUCT_NOT_FOUND');
        return prod;
      },
    }).then((p) => ({ ...p, id: p._id || p.id }));
  },

  /** Batch fetch, used by wishlist, cart hydration and recently viewed. */
  async getProductsByIds(ids = []) {
    if (!ids.length) return [];
    return apiRequest('/products/batch', {
      method: 'POST',
      body: { ids },
      fallback: () => ids.map((id) => mockProducts.find((p) => p.id === id || p._id === id)).filter(Boolean),
    }).then((items) => (items || []).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getFeatured(limit = 8) {
    return apiRequest('/products/featured', {
      fallback: () => mockProducts.filter((p) => p.isFeatured).slice(0, limit),
    }).then((items) => (items || []).slice(0, limit).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getBestSellers(limit = 12) {
    return apiRequest('/products/best-sellers', {
      fallback: () => mockProducts.filter((p) => p.isBestSeller).slice(0, limit),
    }).then((items) => (items || []).slice(0, limit).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getNewArrivals(limit = 12) {
    return apiRequest('/products/new-arrivals', {
      fallback: () => mockProducts.slice(0, limit),
    }).then((items) => (items || []).slice(0, limit).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getDeals(limit = 12) {
    return apiRequest('/products/deals', {
      fallback: () => [...mockProducts].sort((a, b) => b.discount - a.discount).slice(0, limit),
    }).then((items) => (items || []).slice(0, limit).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getTrending(limit = 10) {
    return apiRequest('/products/trending', {
      fallback: () => [...mockProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, limit),
    }).then((items) => (items || []).slice(0, limit).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getRecommendations(recentIds = [], limit = 10) {
    return apiRequest('/products/recommendations', {
      fallback: () => [...mockProducts].sort((a, b) => b.rating - a.rating).slice(0, limit),
    }).then((items) => (items || []).slice(0, limit).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getRelated(productId, limit = 8) {
    return apiRequest(`/products/${productId}/related`, {
      fallback: () => mockProducts.slice(0, limit),
    }).then((items) => (items || []).slice(0, limit).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getFrequentlyBoughtTogether(productId) {
    return apiRequest(`/products/${productId}/frequently-bought-together`, {
      fallback: () => mockProducts.slice(0, 2),
    }).then((items) => (items || []).map((p) => ({ ...p, id: p._id || p.id })));
  },

  async getReviews(productId, { rating = null, withPhotos = false, sort = 'recent' } = {}) {
    return apiRequest(`/products/${productId}/reviews`, {
      fallback: () => ({
        items: reviewsByProduct[productId] ?? [],
        breakdown: getRatingBreakdown(productId),
      }),
    }).then((res) => {
      const items = Array.isArray(res) ? res : (res.items || []);
      return {
        items,
        breakdown: res.breakdown || getRatingBreakdown(productId),
      };
    });
  },

  async getSuggestions(query, limit = 8) {
    if (!query?.trim()) return [];
    return apiRequest(`/products/suggestions?q=${encodeURIComponent(query)}`, {
      fallback: () => {
        const q = query.trim().toLowerCase();
        return mockProducts
          .filter((p) => p.title.toLowerCase().includes(q))
          .slice(0, limit)
          .map((p) => ({ type: 'product', label: p.title, id: p.id, thumbnail: p.thumbnail, price: p.price }));
      },
    });
  },

  async getCategories() {
    return apiRequest('/categories', {
      fallback: () => localCategories,
    }).then((cats) => {
      if (!Array.isArray(cats) || !cats.length) return localCategories;
      return cats.map((c, i) => ({
        ...c,
        id: c._id || c.id || i + 1,
        image: c.image || `https://picsum.photos/seed/shopnest-cat-${c.slug}/800/600`,
        banner: c.banner || `https://picsum.photos/seed/shopnest-banner-${c.slug}/1600/500`,
        subcategories: (c.subcategories || []).map((s) => (typeof s === 'string' ? { name: s, slug: s.toLowerCase().replace(/\s+/g, '-') } : s)),
      }));
    });
  },

  async getCategory(slug) {
    return apiRequest(`/categories/${slug}`, {
      fallback: () => getLocalCategoryBySlug(slug),
    }).then(async (category) => {
      if (!category) fail('Category not found', 404, 'CATEGORY_NOT_FOUND');
      const categoryName = category.name;
      const prodsData = await apiRequest(`/products?category=${encodeURIComponent(categoryName)}&perPage=50`, {
        fallback: () => ({ items: mockProducts.filter((p) => p.category === categoryName) }),
      });
      const items = (prodsData.items || []).map((p) => ({ ...p, id: p._id || p.id }));
      return {
        category,
        products: items,
        bestSellers: items.filter((p) => p.isBestSeller).slice(0, 8),
        deals: [...items].sort((a, b) => b.discount - a.discount).slice(0, 8),
        featured: items.filter((p) => p.isFeatured).slice(0, 4),
      };
    });
  },

  async getFilterOptions() {
    return apiRequest('/products/filter-options', {
      fallback: () => ({
        brands: mockBrands,
        colors: allColors,
        sizes: allSizes,
        materials: allMaterials,
        priceBounds,
        categories: localCategories.map((c) => ({ name: c.name, subcategories: c.subcategories.map((s) => s.name) })),
      }),
    });
  },

  async getBrands() {
    return apiRequest('/products/brands', {
      fallback: () => brandShowcase,
    });
  },

  async checkDelivery(pincode, productId) {
    return apiRequest(`/products/${productId}/check-delivery`, {
      method: 'POST',
      body: { pincode },
      fallback: () => {
        const eta = new Date(Date.now() + 3 * 86400000);
        return {
          serviceable: true,
          days: 3,
          eta: eta.toISOString(),
          codAvailable: true,
          sameDay: false,
          message: `Delivers by ${eta.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}`,
        };
      },
    }).then((res) => ({
      serviceable: res.deliverable ?? true,
      days: res.days || 3,
      eta: res.estimatedDelivery || new Date(Date.now() + 3 * 86400000).toISOString(),
      codAvailable: true,
      sameDay: false,
      message: `Delivers by ${new Date(res.estimatedDelivery || Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}`,
    }));
  },
};

export default productService;
