import { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';

const WishlistContext = createContext(null);

/**
 * Wishlist. Stores a snapshot of the price at save time so the wishlist page
 * can show "price dropped since you saved this".
 */
export function WishlistProvider({ children }) {
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.wishlist, []);

  const isWishlisted = useCallback(
    (productId) => items.some((i) => i.productId === productId),
    [items],
  );

  const add = useCallback((product) => {
    setItems((prev) => (
      prev.some((i) => i.productId === product.id)
        ? prev
        : [{
          productId: product.id,
          title: product.title,
          brand: product.brand,
          thumbnail: product.thumbnail,
          price: product.price,
          originalPrice: product.originalPrice,
          savedAtPrice: product.price,
          stock: product.stock,
          category: product.category,
          addedAt: new Date().toISOString(),
        }, ...prev]
    ));
  }, [setItems]);

  const remove = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, [setItems]);

  /** @returns {boolean} true if the product ended up in the wishlist */
  const toggle = useCallback((product) => {
    const willAdd = !items.some((i) => i.productId === product.id);
    if (willAdd) add(product); else remove(product.id);
    return willAdd;
  }, [items, add, remove]);

  const clear = useCallback(() => setItems([]), [setItems]);

  const value = useMemo(() => ({
    items, count: items.length, isWishlisted, add, remove, toggle, clear,
  }), [items, isWishlisted, add, remove, toggle, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
