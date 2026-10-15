import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNavigation from './MobileBottomNavigation';
import CartDrawer from './CartDrawer';
import CompareTray from '@/components/product/CompareTray';
import ScrollToTop from '@/components/common/ScrollToTop';
import BackToTopButton from '@/components/common/BackToTopButton';

/**
 * Shell for all storefront pages: sticky navbar, routed page body, footer,
 * plus the persistent cart drawer, compare tray and mobile tab bar.
 */
export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <ScrollToTop />
      <Navbar />

      <Box component="main" sx={{ flex: 1, pb: { xs: 8, md: 0 } }}>
        <Outlet />
      </Box>

      <Footer />

      <MobileBottomNavigation />
      <CartDrawer />
      <CompareTray />
      <BackToTopButton />
    </Box>
  );
}
