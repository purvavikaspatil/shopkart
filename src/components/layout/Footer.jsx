import { useState } from 'react';
import {
  Box, Container, Grid, Typography, Link, Stack, TextField, Button, Divider,
  IconButton, Chip, CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import Logo from './Logo';
import { userService } from '@/services';
import { useToast } from '@/hooks';
import { validateEmail } from '@/utils/validators';
import { layout } from '@/theme/tokens';
import { APP_NAME, SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_HOURS } from '@/utils/constants';

/** Footer link columns. Keeping them as data makes the markup trivial. */
const COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All products', to: '/shop' },
      { label: 'New arrivals', to: '/new-arrivals' },
      { label: 'Best sellers', to: '/best-sellers' },
      { label: 'Deals', to: '/deals' },
      { label: 'Coupons', to: '/coupons' },
      { label: 'Compare products', to: '/compare' },
    ],
  },
  {
    heading: 'Categories',
    links: [
      { label: 'Electronics', to: '/category/electronics' },
      { label: 'Fashion', to: '/category/fashion' },
      { label: 'Home & Living', to: '/category/home-living' },
      { label: 'Beauty', to: '/category/beauty' },
      { label: 'Sports', to: '/category/sports' },
      { label: 'Watches', to: '/category/watches' },
    ],
  },
  {
    heading: 'Customer service',
    links: [
      { label: 'Help centre', to: '/help' },
      { label: 'Contact us', to: '/contact' },
      { label: 'Track an order', to: '/orders' },
      { label: 'Returns', to: '/returns' },
      { label: 'Refunds', to: '/refunds' },
      { label: 'Shipping information', to: '/help' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Careers', to: '/about' },
      { label: 'Seller dashboard', to: '/admin' },
      { label: 'Privacy policy', to: '/help' },
      { label: 'Terms of use', to: '/help' },
    ],
  },
];

const SOCIALS = [
  { label: 'Facebook', icon: <FacebookIcon fontSize="small" /> },
  { label: 'Instagram', icon: <InstagramIcon fontSize="small" /> },
  { label: 'X', icon: <XIcon fontSize="small" /> },
  { label: 'YouTube', icon: <YouTubeIcon fontSize="small" /> },
  { label: 'LinkedIn', icon: <LinkedInIcon fontSize="small" /> },
];

const PAYMENTS = [
  { label: 'Cards', icon: <CreditCardIcon fontSize="small" /> },
  { label: 'UPI', icon: <QrCode2Icon fontSize="small" /> },
  { label: 'Net banking', icon: <AccountBalanceIcon fontSize="small" /> },
  { label: 'Cash on delivery', icon: <LocalAtmIcon fontSize="small" /> },
];

export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (event) => {
    event.preventDefault();
    const message = validateEmail(email);
    setError(message);
    if (message) return;

    setSubmitting(true);
    try {
      await userService.subscribeNewsletter(email);
      toast.success('Subscribed. Look out for one email a week, no more.');
      setEmail('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        // Clear the mobile bottom navigation.
        pb: { xs: `${layout.bottomNavHeight + 8}px`, md: 0 },
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: layout.maxWidth, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Newsletter */}
        <Box
          sx={{
            py: { xs: 4, md: 5 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box sx={{ maxWidth: 460 }}>
            <Typography variant="h5" sx={{ mb: 0.75 }}>One email a week, worth opening</Typography>
            <Typography variant="body2" color="text.secondary">
              New arrivals, honest price drops and the occasional buying guide. Unsubscribe in one click.
            </Typography>
          </Box>

          <Box component="form" onSubmit={subscribe} sx={{ width: { xs: '100%', md: 420 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                fullWidth
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                error={Boolean(error)}
                helperText={error}
                inputProps={{ 'aria-label': 'Email address for the newsletter' }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={15} color="inherit" /> : null}
                sx={{ flexShrink: 0, minWidth: 130 }}
              >
                Subscribe
              </Button>
            </Stack>
          </Box>
        </Box>

        <Divider />

        {/* Link columns */}
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ py: { xs: 4, md: 5 } }}>
          <Grid item xs={12} md={3}>
            <Logo />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, mb: 2, maxWidth: 300 }}>
              Everyday essentials and premium picks, delivered across 19,400 pincodes with a 7-day return
              window on almost everything.
            </Typography>

            <Stack spacing={0.5}>
              <Typography variant="body2">
                <Link href={`mailto:${SUPPORT_EMAIL}`} color="text.primary">{SUPPORT_EMAIL}</Link>
              </Typography>
              <Typography variant="body2">
                <Link href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} color="text.primary">{SUPPORT_PHONE}</Link>
              </Typography>
              <Typography variant="caption" color="text.secondary">{SUPPORT_HOURS}</Typography>
            </Stack>
          </Grid>

          {COLUMNS.map((column) => (
            <Grid item xs={6} sm={3} md={2} key={column.heading}>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{column.heading}</Typography>
              <Stack spacing={1}>
                {column.links.map((link) => (
                  <Link
                    key={`${column.heading}-${link.label}`}
                    component={RouterLink}
                    to={link.to}
                    color="text.secondary"
                    variant="body2"
                    sx={{ '&:hover': { color: 'primary.main' } }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={1}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Follow</Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              {SOCIALS.map((social) => (
                <IconButton
                  key={social.label}
                  size="small"
                  aria-label={social.label}
                  sx={{ border: 1, borderColor: 'divider', color: 'text.secondary' }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        {/* Bottom bar */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          sx={{ py: 3 }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} {APP_NAME}. A demonstration storefront. No real orders are placed
            and no payments are processed.
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {PAYMENTS.map((payment) => (
              <Chip
                key={payment.label}
                size="small"
                variant="outlined"
                icon={payment.icon}
                label={payment.label}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
