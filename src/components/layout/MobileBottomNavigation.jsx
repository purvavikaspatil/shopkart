import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart, useWishlist } from '@/hooks';
import { layout } from '@/theme/tokens';

/** Bottom tab bar shown below the md breakpoint. */
export default function MobileBottomNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  // Match the deepest route that starts with each tab's path.
  const current = ['/categories', '/wishlist', '/cart', '/profile'].find((p) => pathname.startsWith(p)) ?? '/';

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: (t) => t.zIndex.appBar,
        borderTop: 1,
        borderColor: 'divider',
        display: { xs: 'block', md: 'none' },
        // Respect the iOS home indicator.
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation
        value={current}
        onChange={(_, value) => navigate(value)}
        showLabels
        sx={{ height: layout.bottomNavHeight, bgcolor: 'background.paper' }}
      >
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={pathname === '/' ? <HomeIcon /> : <HomeOutlinedIcon />}
        />
        <BottomNavigationAction label="Categories" value="/categories" icon={<CategoryOutlinedIcon />} />
        <BottomNavigationAction
          label="Wishlist"
          value="/wishlist"
          icon={
            <Badge badgeContent={wishlistCount} color="error">
              <FavoriteBorderIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Cart"
          value="/cart"
          icon={
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCartOutlinedIcon />
            </Badge>
          }
        />
        <BottomNavigationAction label="Profile" value="/profile" icon={<PersonOutlineIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
