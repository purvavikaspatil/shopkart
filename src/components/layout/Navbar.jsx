import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, IconButton, Badge, Button, Stack, Drawer,
  List, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Menu,
  MenuItem, Tooltip, Collapse, useScrollTrigger, Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

import SearchBar from './SearchBar';
import Logo from './Logo';
import { useCart, useWishlist, useAuth, useNotifications, useColorMode, useToast } from '@/hooks';
import { categories } from '@/data/categories';
import { initials } from '@/utils/format';
import { layout } from '@/theme/tokens';

/** Second-row links. Kept short so the row never wraps on a laptop. */
const PRIMARY_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'New arrivals', to: '/new-arrivals' },
  { label: 'Best sellers', to: '/best-sellers' },
  { label: 'Deals', to: '/deals' },
  { label: 'Electronics', to: '/category/electronics' },
  { label: 'Fashion', to: '/category/fashion' },
  { label: 'Home & Living', to: '/category/home-living' },
];

/** Links inside the mobile hamburger drawer. */
const DRAWER_LINKS = [
  { label: 'Home', to: '/', icon: <HomeOutlinedIcon /> },
  { label: 'Shop', to: '/shop', icon: <StorefrontIcon /> },
  { label: 'Categories', to: '/categories', icon: <CategoryIcon /> },
  { label: 'Your orders', to: '/orders', icon: <Inventory2OutlinedIcon /> },
  { label: 'Wishlist', to: '/wishlist', icon: <FavoriteBorderIcon /> },
  { label: 'Cart', to: '/cart', icon: <ShoppingCartOutlinedIcon /> },
  { label: 'Coupons', to: '/coupons', icon: <ReceiptLongIcon /> },
  { label: 'Profile', to: '/profile', icon: <PersonOutlineIcon /> },
  { label: 'Settings', to: '/settings', icon: <SettingsOutlinedIcon /> },
  { label: 'Help centre', to: '/help', icon: <HelpOutlineIcon /> },
  { label: 'About', to: '/about', icon: <InfoOutlinedIcon /> },
  { label: 'Contact', to: '/contact', icon: <MailOutlineIcon /> },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const { itemCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleMode } = useColorMode();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [drawerCatOpen, setDrawerCatOpen] = useState(false);

  // Hide the announcement bar once the shopper starts scrolling.
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 24 });

  const handleLogout = async () => {
    setProfileAnchor(null);
    setDrawerOpen(false);
    await logout();
    toast.info('Signed out. Your cart is saved on this device.');
    navigate('/');
  };

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        }}
      >
        {/* Announcement bar */}
        <Collapse in={!scrolled}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              height: layout.announcementHeight,
              display: 'grid',
              placeItems: 'center',
              px: 2,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'center' }} noWrap>
              Free shipping on orders above ₹999 · Easy 7-day returns
            </Typography>
          </Box>
        </Collapse>

        <Container maxWidth={false} sx={{ maxWidth: layout.maxWidth, px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Main row */}
          <Toolbar disableGutters sx={{ minHeight: { xs: 58, md: layout.navHeight }, gap: 1 }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              edge="start"
              aria-label="Open menu"
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Logo />

            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', px: 2 }}>
              <SearchBar />
            </Box>

            <Box sx={{ flex: { xs: 1, md: 0 } }} />

            <Stack direction="row" spacing={0.25} alignItems="center">
              <IconButton
                onClick={() => setMobileSearch((v) => !v)}
                aria-label="Search"
                sx={{ display: { md: 'none' } }}
              >
                <SearchIcon />
              </IconButton>

              <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton onClick={toggleMode} aria-label="Toggle colour mode">
                  {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Notifications">
                <IconButton
                  component={RouterLink}
                  to="/notifications"
                  aria-label={`Notifications, ${unreadCount} unread`}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Wishlist">
                <IconButton
                  component={RouterLink}
                  to="/wishlist"
                  aria-label={`Wishlist, ${wishlistCount} items`}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  <Badge badgeContent={wishlistCount} color="error">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Cart">
                <IconButton onClick={openDrawer} aria-label={`Cart, ${itemCount} items`}>
                  <Badge badgeContent={itemCount} color="error">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {isAuthenticated ? (
                <Tooltip title="Your account">
                  <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} aria-label="Account menu" sx={{ ml: 0.5 }}>
                    <Avatar src={user.avatar} alt="" sx={{ width: 30, height: 30, fontSize: '0.75rem' }}>
                      {initials(`${user.firstName} ${user.lastName}`)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              ) : (
                <Stack direction="row" spacing={1} sx={{ ml: 1, display: { xs: 'none', sm: 'flex' } }}>
                  <Button component={RouterLink} to="/login" size="small" color="inherit">
                    Sign in
                  </Button>
                  <Button component={RouterLink} to="/signup" size="small" variant="contained">
                    Create account
                  </Button>
                </Stack>
              )}
            </Stack>
          </Toolbar>

          {/* Mobile inline search */}
          <Collapse in={mobileSearch}>
            <Box sx={{ pb: 1.5, display: { md: 'none' } }}>
              <SearchBar fullWidth autoFocus onSubmitted={() => setMobileSearch(false)} />
            </Box>
          </Collapse>
        </Container>

        {/* Category row */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Container maxWidth={false} sx={{ maxWidth: layout.maxWidth, px: { md: 3 } }}>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ height: layout.categoryBarHeight, overflowX: 'auto' }}
              className="no-scrollbar"
            >
              <Button
                size="small"
                endIcon={<ExpandMoreIcon />}
                onClick={(e) => setCategoryAnchor(e.currentTarget)}
                sx={{ color: 'text.primary', flexShrink: 0, fontWeight: 700 }}
              >
                All categories
              </Button>
              <Divider orientation="vertical" flexItem sx={{ my: 1.25, mx: 0.5 }} />

              {PRIMARY_LINKS.map((link) => (
                <Button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    color: isActive(link.to) ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive(link.to) ? 700 : 500,
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Container>
        </Box>
      </AppBar>

      {/* Mega menu for all categories */}
      <Menu
        anchorEl={categoryAnchor}
        open={Boolean(categoryAnchor)}
        onClose={() => setCategoryAnchor(null)}
        PaperProps={{ sx: { width: 300, maxHeight: 460 } }}
      >
        {categories.map((c) => (
          <MenuItem
            key={c.slug}
            component={RouterLink}
            to={`/category/${c.slug}`}
            onClick={() => setCategoryAnchor(null)}
            sx={{ py: 1.25 }}
          >
            <ListItemText
              primary={c.name}
              secondary={c.subcategories.map((s) => s.name).join(' · ')}
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
              secondaryTypographyProps={{ fontSize: '0.72rem', noWrap: true }}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Account menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        PaperProps={{ sx: { width: 240 } }}
      >
        {isAuthenticated && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" noWrap>{user.firstName} {user.lastName}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
          </Box>
        )}
        <Divider />
        <MenuItem component={RouterLink} to="/profile" onClick={() => setProfileAnchor(null)}>
          <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
          Your profile
        </MenuItem>
        <MenuItem component={RouterLink} to="/orders" onClick={() => setProfileAnchor(null)}>
          <ListItemIcon><Inventory2OutlinedIcon fontSize="small" /></ListItemIcon>
          Your orders
        </MenuItem>
        <MenuItem component={RouterLink} to="/wishlist" onClick={() => setProfileAnchor(null)}>
          <ListItemIcon><FavoriteBorderIcon fontSize="small" /></ListItemIcon>
          Wishlist
        </MenuItem>
        <MenuItem component={RouterLink} to="/admin" onClick={() => setProfileAnchor(null)}>
          <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
          Seller dashboard
        </MenuItem>
        <MenuItem component={RouterLink} to="/settings" onClick={() => setProfileAnchor(null)}>
          <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>

      {/* Mobile navigation drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 292 } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {isAuthenticated ? (
          <Box
            component={RouterLink}
            to="/profile"
            onClick={() => setDrawerOpen(false)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, textDecoration: 'none', color: 'inherit' }}
          >
            <Avatar src={user.avatar} alt="" sx={{ width: 42, height: 42 }}>
              {initials(`${user.firstName} ${user.lastName}`)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>{user.firstName} {user.lastName}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
            </Box>
          </Box>
        ) : (
          <Stack direction="row" spacing={1} sx={{ p: 2 }}>
            <Button
              component={RouterLink}
              to="/login"
              onClick={() => setDrawerOpen(false)}
              variant="contained"
              fullWidth
              startIcon={<LoginIcon />}
            >
              Sign in
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              onClick={() => setDrawerOpen(false)}
              variant="outlined"
              fullWidth
            >
              Register
            </Button>
          </Stack>
        )}

        <Divider />

        <List sx={{ px: 1, flex: 1, overflowY: 'auto' }}>
          {DRAWER_LINKS.slice(0, 3).map((link) => (
            <ListItemButton
              key={link.to}
              component={RouterLink}
              to={link.to}
              onClick={() => setDrawerOpen(false)}
              selected={isActive(link.to)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}

          <ListItemButton onClick={() => setDrawerCatOpen((v) => !v)}>
            <ListItemIcon sx={{ minWidth: 40 }}><CategoryIcon /></ListItemIcon>
            <ListItemText primary="Browse categories" />
            <ExpandMoreIcon sx={{ transform: drawerCatOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
          </ListItemButton>

          <Collapse in={drawerCatOpen}>
            <List disablePadding sx={{ pl: 2 }}>
              {categories.map((c) => (
                <ListItemButton
                  key={c.slug}
                  component={RouterLink}
                  to={`/category/${c.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  dense
                >
                  <ListItemText primary={c.name} primaryTypographyProps={{ fontSize: '0.88rem' }} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {DRAWER_LINKS.slice(3).map((link) => (
            <ListItemButton
              key={link.to}
              component={RouterLink}
              to={link.to}
              onClick={() => setDrawerOpen(false)}
              selected={isActive(link.to)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}

          {isAuthenticated && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
