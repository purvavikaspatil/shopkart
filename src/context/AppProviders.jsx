import { ColorModeProvider } from './ColorModeContext';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { CompareProvider } from './CompareContext';
import { RecentlyViewedProvider } from './RecentlyViewedContext';
import { NotificationsProvider } from './NotificationsContext';
import { SettingsProvider } from './SettingsContext';

/**
 * Composes every provider in one place so App.jsx stays readable.
 * Order matters: theme first (everything below renders inside it), then toast
 * (other providers may want to notify), then data providers.
 */
export function AppProviders({ children }) {
  return (
    <ColorModeProvider>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            <NotificationsProvider>
              <RecentlyViewedProvider>
                <WishlistProvider>
                  <CompareProvider>
                    <CartProvider>
                      {children}
                    </CartProvider>
                  </CompareProvider>
                </WishlistProvider>
              </RecentlyViewedProvider>
            </NotificationsProvider>
          </AuthProvider>
        </SettingsProvider>
      </ToastProvider>
    </ColorModeProvider>
  );
}

export default AppProviders;
