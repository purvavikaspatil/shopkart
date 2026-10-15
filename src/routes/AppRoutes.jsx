import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';

import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

/*
 * Every page is code-split with React.lazy so the initial bundle only carries
 * the shell. Grouping the imports by area keeps this readable.
 */

// Storefront
const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/shop/ShopPage'));
const SearchPage = lazy(() => import('@/pages/shop/SearchPage'));
const CategoriesPage = lazy(() => import('@/pages/shop/CategoriesPage'));
const CategoryPage = lazy(() => import('@/pages/shop/CategoryPage'));
const ProductPage = lazy(() => import('@/pages/shop/ProductPage'));
const NewArrivalsPage = lazy(() => import('@/pages/shop/NewArrivalsPage'));
const BestSellersPage = lazy(() => import('@/pages/shop/BestSellersPage'));
const DealsPage = lazy(() => import('@/pages/shop/DealsPage'));
const ComparePage = lazy(() => import('@/pages/shop/ComparePage'));
const RecentlyViewedPage = lazy(() => import('@/pages/shop/RecentlyViewedPage'));

// Cart & checkout
const CartPage = lazy(() => import('@/pages/CartPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));

// Orders & post-purchase
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/account/OrderDetailPage'));
const OrderTrackingPage = lazy(() => import('@/pages/account/OrderTrackingPage'));
const ReturnsPage = lazy(() => import('@/pages/account/ReturnsPage'));
const RefundsPage = lazy(() => import('@/pages/account/RefundsPage'));

// Account
const ProfilePage = lazy(() => import('@/pages/account/ProfilePage'));
const ProfileEditPage = lazy(() => import('@/pages/account/ProfileEditPage'));
const AddressesPage = lazy(() => import('@/pages/account/AddressesPage'));
const PaymentsPage = lazy(() => import('@/pages/account/PaymentsPage'));
const MyReviewsPage = lazy(() => import('@/pages/account/MyReviewsPage'));
const NotificationsPage = lazy(() => import('@/pages/account/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/account/SettingsPage'));
const CouponsPage = lazy(() => import('@/pages/account/CouponsPage'));

// Content
const AboutPage = lazy(() => import('@/pages/content/AboutPage'));
const ContactPage = lazy(() => import('@/pages/content/ContactPage'));
const HelpPage = lazy(() => import('@/pages/content/HelpPage'));
const BlogPage = lazy(() => import('@/pages/content/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/content/BlogPostPage'));

// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));

// Admin
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('@/pages/admin/AdminCustomers'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));

// Fallback
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/** Thin top-loading bar shown while a lazy chunk is fetched. */
function RouteFallback() {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }}>
      <LinearProgress />
    </Box>
  );
}

/** Wraps an element in Suspense so each route shows the loader independently. */
const withSuspense = (element) => <Suspense fallback={<RouteFallback />}>{element}</Suspense>;

/** Shorthand for a route that requires authentication. */
const guarded = (element) => withSuspense(<ProtectedRoute>{element}</ProtectedRoute>);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Storefront shell */}
      <Route element={<MainLayout />}>
        <Route index element={withSuspense(<HomePage />)} />
        <Route path="shop" element={withSuspense(<ShopPage />)} />
        <Route path="search" element={withSuspense(<SearchPage />)} />
        <Route path="categories" element={withSuspense(<CategoriesPage />)} />
        <Route path="category/:slug" element={withSuspense(<CategoryPage />)} />
        <Route path="product/:id" element={withSuspense(<ProductPage />)} />
        <Route path="new-arrivals" element={withSuspense(<NewArrivalsPage />)} />
        <Route path="best-sellers" element={withSuspense(<BestSellersPage />)} />
        <Route path="deals" element={withSuspense(<DealsPage />)} />
        <Route path="compare" element={withSuspense(<ComparePage />)} />
        <Route path="recently-viewed" element={withSuspense(<RecentlyViewedPage />)} />

        <Route path="cart" element={withSuspense(<CartPage />)} />
        <Route path="wishlist" element={guarded(<WishlistPage />)} />
        <Route path="checkout" element={guarded(<CheckoutPage />)} />
        <Route path="order-success/:id" element={guarded(<OrderSuccessPage />)} />

        <Route path="orders" element={guarded(<OrdersPage />)} />
        <Route path="orders/:id" element={guarded(<OrderDetailPage />)} />
        <Route path="orders/:id/track" element={guarded(<OrderTrackingPage />)} />
        <Route path="returns" element={guarded(<ReturnsPage />)} />
        <Route path="refunds" element={guarded(<RefundsPage />)} />

        <Route path="profile" element={guarded(<ProfilePage />)} />
        <Route path="profile/edit" element={guarded(<ProfileEditPage />)} />
        <Route path="profile/addresses" element={guarded(<AddressesPage />)} />
        <Route path="profile/payments" element={guarded(<PaymentsPage />)} />
        <Route path="profile/reviews" element={guarded(<MyReviewsPage />)} />
        <Route path="notifications" element={guarded(<NotificationsPage />)} />
        <Route path="settings" element={withSuspense(<SettingsPage />)} />
        <Route path="coupons" element={withSuspense(<CouponsPage />)} />

        <Route path="about" element={withSuspense(<AboutPage />)} />
        <Route path="contact" element={withSuspense(<ContactPage />)} />
        <Route path="help" element={withSuspense(<HelpPage />)} />
        <Route path="blog" element={withSuspense(<BlogPage />)} />
        <Route path="blog/:slug" element={withSuspense(<BlogPostPage />)} />
      </Route>

      {/* Auth shell */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={withSuspense(<LoginPage />)} />
        <Route path="signup" element={withSuspense(<SignupPage />)} />
        <Route path="forgot-password" element={withSuspense(<ForgotPasswordPage />)} />
        <Route path="reset-password" element={withSuspense(<ResetPasswordPage />)} />
        <Route path="verify-email" element={withSuspense(<VerifyEmailPage />)} />
      </Route>

      {/* Admin shell (guarded) */}
      <Route
        path="admin"
        element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={withSuspense(<AdminDashboard />)} />
        <Route path="products" element={withSuspense(<AdminProducts />)} />
        <Route path="orders" element={withSuspense(<AdminOrders />)} />
        <Route path="customers" element={withSuspense(<AdminCustomers />)} />
        <Route path="analytics" element={withSuspense(<AdminAnalytics />)} />
      </Route>

      {/* 404 */}
      <Route path="*" element={withSuspense(<NotFoundPage />)} />
    </Routes>
  );
}
