import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import { calculateTotals } from '@/utils/helpers';
import { userService } from '@/services';

const CartContext = createContext(null);

/**
 * A cart line is identified by product id *plus* the chosen variant, so the
 * same shirt in two sizes occupies two lines.
 */
const lineKey = (productId, size, color) => `${productId}::${size ?? ''}::${color ?? ''}`;

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.cart, []);
  const [savedForLater, setSavedForLater] = useLocalStorage(STORAGE_KEYS.savedForLater, []);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /**
   * Adds a product, merging with an existing line when the variant matches.
   * @param {object} product
   * @param {{quantity?:number, size?:string, color?:string}} [options]
   */
  const addItem = useCallback((product, options = {}) => {
    const { quantity = 1, size = null, color = null } = options;
    const key = lineKey(product.id, size, color);

    setItems((prev) => {
      const index = prev.findIndex((i) => i.key === key);
      if (index > -1) {
        const next = [...prev];
        // Never let a line exceed available stock.
        const merged = Math.min(next[index].quantity + quantity, product.stock || 99);
        next[index] = { ...next[index], quantity: merged };
        return next;
      }
      return [...prev, {
        key,
        productId: product.id,
        title: product.title,
        brand: product.brand,
        slug: product.slug,
        thumbnail: product.thumbnail,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        stock: product.stock,
        size, color,
        quantity: Math.min(quantity, product.stock || 99),
        addedAt: new Date().toISOString(),
      }];
    });
  }, [setItems]);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, [setItems]);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((prev) => prev
      .map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock || 99)) } : i))
      .filter((i) => i.quantity > 0));
  }, [setItems]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
    setCouponError('');
  }, [setItems]);

  /** Moves a line out of the cart into "saved for later". */
  const saveForLater = useCallback((key) => {
    setItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item) setSavedForLater((saved) => (saved.some((s) => s.key === key) ? saved : [...saved, item]));
      return prev.filter((i) => i.key !== key);
    });
  }, [setItems, setSavedForLater]);

  const moveToCart = useCallback((key) => {
    setSavedForLater((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item) setItems((cart) => (cart.some((c) => c.key === key) ? cart : [...cart, item]));
      return prev.filter((i) => i.key !== key);
    });
  }, [setItems, setSavedForLater]);

  const removeSaved = useCallback((key) => {
    setSavedForLater((prev) => prev.filter((i) => i.key !== key));
  }, [setSavedForLater]);

  const isInCart = useCallback(
    (productId) => items.some((i) => i.productId === productId),
    [items],
  );

  const getLine = useCallback(
    (productId, size = null, color = null) => items.find((i) => i.key === lineKey(productId, size, color)) ?? null,
    [items],
  );

  /** Validates and applies a coupon against the current cart contents. */
  const applyCoupon = useCallback(async (code) => {
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const categories = [...new Set(items.map((i) => i.category))];
      const validated = await userService.validateCoupon(code, { subtotal, categories });
      setCoupon(validated);
      return validated;
    } catch (error) {
      setCouponError(error.message);
      setCoupon(null);
      throw error;
    } finally {
      setApplyingCoupon(false);
    }
  }, [items]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError('');
  }, []);

  const itemCount = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
  const totals = useMemo(() => calculateTotals(items, { coupon }), [items, coupon]);

  const value = useMemo(() => ({
    items, savedForLater, itemCount, totals,
    coupon, couponError, applyingCoupon,
    drawerOpen, openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false),
    addItem, removeItem, updateQuantity, clearCart,
    saveForLater, moveToCart, removeSaved,
    isInCart, getLine, applyCoupon, removeCoupon,
  }), [
    items, savedForLater, itemCount, totals, coupon, couponError, applyingCoupon, drawerOpen,
    addItem, removeItem, updateQuantity, clearCart, saveForLater, moveToCart, removeSaved,
    isInCart, getLine, applyCoupon, removeCoupon,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
