import { Grid, Card, Box, Typography, Button, Stack, Avatar, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useAuth, useOrders, useWishlist } from '@/hooks';
import { initials, formatDate } from '@/utils/format';

const LINKS = [
  { label: 'Your orders', caption: 'Track, return or buy again', to: '/orders', icon: <Inventory2OutlinedIcon /> },
  { label: 'Addresses', caption: 'Manage delivery addresses', to: '/profile/addresses', icon: <LocationOnOutlinedIcon /> },
  { label: 'Payment methods', caption: 'Saved cards and UPI', to: '/profile/payments', icon: <CreditCardOutlinedIcon /> },
  { label: 'Your reviews', caption: 'Ratings you have written', to: '/profile/reviews', icon: <RateReviewOutlinedIcon /> },
  { label: 'Wishlist', caption: 'Items you saved for later', to: '/wishlist', icon: <FavoriteBorderIcon /> },
  { label: 'Coupons', caption: 'Offers available to you', to: '/coupons', icon: <LocalOfferOutlinedIcon /> },
  { label: 'Returns & refunds', caption: 'Manage returns', to: '/returns', icon: <ReplayOutlinedIcon /> },
  { label: 'Settings', caption: 'Preferences and privacy', to: '/settings', icon: <SettingsOutlinedIcon /> },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { count: wishlistCount } = useWishlist();

  if (!user) return null;

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Your account' }]} />

      {/* Header card */}
      <Card sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }}>
          <Avatar src={user.avatar} sx={{ width: 72, height: 72, fontSize: '1.4rem' }}>
            {initials(`${user.firstName} ${user.lastName}`)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email} · {user.phone}</Typography>
            <Typography variant="caption" color="text.secondary">Member since {formatDate(user.createdAt)}</Typography>
          </Box>
          <Button component={RouterLink} to="/profile/edit" variant="outlined" startIcon={<EditOutlinedIcon />}>
            Edit profile
          </Button>
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        <Grid container spacing={2}>
          {[
            { label: 'Orders', value: orders.length },
            { label: 'Wishlist', value: wishlistCount },
            { label: 'Reviews', value: '—', to: '/profile/reviews' },
          ].map((stat) => (
            <Grid item xs={4} key={stat.label}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5">{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Quick links */}
      <Grid container spacing={2}>
        {LINKS.map((link) => (
          <Grid item xs={12} sm={6} md={3} key={link.to}>
            <Card
              component={RouterLink}
              to={link.to}
              sx={{
                p: 2, height: '100%', display: 'flex', flexDirection: 'column',
                textDecoration: 'none', color: 'inherit',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ color: 'primary.main', mb: 1.5, '& svg': { fontSize: 26 } }}>{link.icon}</Box>
                <ChevronRightIcon sx={{ color: 'text.disabled' }} />
              </Stack>
              <Typography variant="subtitle2">{link.label}</Typography>
              <Typography variant="caption" color="text.secondary">{link.caption}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}
