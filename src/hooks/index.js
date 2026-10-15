/**
 * Hook barrel.
 * Context hooks are re-exported here so components have a single import path:
 * `import { useCart, useWishlist, useAuth } from '@/hooks';`
 */
export { useCart } from '@/context/CartContext';
export { useWishlist } from '@/context/WishlistContext';
export { useAuth } from '@/context/AuthContext';
export { useCompare } from '@/context/CompareContext';
export { useRecentlyViewed } from '@/context/RecentlyViewedContext';
export { useNotifications } from '@/context/NotificationsContext';
export { useSettings } from '@/context/SettingsContext';
export { useToast } from '@/context/ToastContext';
export { useColorMode } from '@/context/ColorModeContext';
// Alias kept because the brief asks for a `useTheme()` hook; MUI's own
// useTheme is still available from '@mui/material' where the theme object
// itself is needed.
export { useColorMode as useThemeMode } from '@/context/ColorModeContext';

export { useProducts, emptyFilters } from './useProducts';
export { useOrders } from './useOrders';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useAsync } from './useAsync';
export { useCountdown } from './useCountdown';
export { useBreakpoints } from './useMediaQueries';
