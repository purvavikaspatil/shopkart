import { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton, ListItemIcon,
  ListItemText, IconButton, Divider, Avatar, Stack, Tooltip, Chip, Container,
} from '@mui/material';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import InsightsIcon from '@mui/icons-material/Insights';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Logo from './Logo';
import { useColorMode, useAuth } from '@/hooks';
import { initials } from '@/utils/format';

const DRAWER_WIDTH = 248;

/** Sidebar destinations for the seller dashboard. */
const NAV = [
  { label: 'Overview', to: '/admin', icon: <DashboardIcon />, exact: true },
  { label: 'Products', to: '/admin/products', icon: <Inventory2Icon /> },
  { label: 'Orders', to: '/admin/orders', icon: <ShoppingBagIcon /> },
  { label: 'Customers', to: '/admin/customers', icon: <PeopleIcon /> },
  { label: 'Analytics', to: '/admin/analytics', icon: <InsightsIcon /> },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleMode } = useColorMode();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item) => (item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to));

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />
        <Chip size="small" label="Seller" color="primary" variant="outlined" />
      </Box>
      <Divider />

      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {NAV.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            selected={isActive(item)}
            onClick={() => setMobileOpen(false)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
          </ListItemButton>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton component={RouterLink} to="/" sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 40 }}><StorefrontIcon /></ListItemIcon>
          <ListItemText primary="Back to store" primaryTypographyProps={{ fontSize: '0.9rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
      {/* Permanent sidebar on desktop */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, borderRight: 1, borderColor: 'divider' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Content column */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', backgroundImage: 'none' }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' } }}
              aria-label="Open dashboard menu"
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ flex: 1 }}>Seller dashboard</Typography>

            <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleMode} aria-label="Toggle colour mode">
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 1 }}>
              <Avatar src={user?.avatar} sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                {user ? initials(`${user.firstName} ${user.lastName}`) : 'S'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                  {user ? `${user.firstName} ${user.lastName}` : 'Store owner'}
                </Typography>
                <Typography variant="caption" color="text.secondary">Administrator</Typography>
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3 }, flex: 1 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
