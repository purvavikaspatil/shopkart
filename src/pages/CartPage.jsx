import { useState } from 'react';
import {
  Box, Grid, Card, Typography, Button, Stack, Divider, IconButton, TextField,
  Chip, Collapse, Alert,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CloseIcon from '@mui/icons-material/Close';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import QuantitySelector from '@/components/common/QuantitySelector';
import OrderSummary from '@/components/order/OrderSummary';
import { useCart, useToast } from '@/hooks';
import { formatPrice } from '@/utils/format';

export default function CartPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    items, savedForLater, totals, coupon, couponError, applyingCoupon,
    updateQuantity, removeItem, saveForLater, moveToCart, removeSaved,
    applyCoupon, removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const submitCoupon = async () => {
    if (!couponCode.trim()) return;
    const ok = await applyCoupon(couponCode.trim().toUpperCase());
    if (ok) {
      toast.success(`Coupon ${couponCode.trim().toUpperCase()} applied`);
      setCouponCode('');
    }
  };

  if (items.length === 0) {
    return (
      <PageContainer>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <EmptyState
          icon={<ShoppingBagOutlinedIcon />}
          title="Your cart is empty"
          description="Once you add something, it will wait for you here. Your cart is saved on this device."
          primaryLabel="Start shopping"
          primaryTo="/shop"
        />

        {savedForLater.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Saved for later ({savedForLater.length})</Typography>
            <Grid container spacing={2}>
              {savedForLater.map((item) => (
                <Grid item xs={12} sm={6} key={item.key}>
                  <SavedRow item={item} onMove={moveToCart} onRemove={removeSaved} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <Typography variant="h3" sx={{ mb: 3 }}>Your cart ({totals.itemCount})</Typography>

      <Grid container spacing={3}>
        {/* Line items */}
        <Grid item xs={12} md={8}>
          <Card>
            {items.map((item, index) => (
              <Box key={item.key}>
                {index > 0 && <Divider />}
                <Stack direction="row" spacing={2} sx={{ p: 2 }}>
                  <Box component={RouterLink} to={`/product/${item.productId}`} sx={{ flexShrink: 0 }}>
                    <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: { xs: 88, sm: 108 }, height: { xs: 88, sm: 108 }, borderRadius: 2, objectFit: 'cover', display: 'block' }} />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary">{item.brand}</Typography>
                        <Typography
                          component={RouterLink}
                          to={`/product/${item.productId}`}
                          variant="body1"
                          sx={{ display: 'block', fontWeight: 600, color: 'text.primary', textDecoration: 'none', mb: 0.5 }}
                        >
                          {item.title}
                        </Typography>
                        {(item.size || item.color) && (
                          <Typography variant="caption" color="text.secondary">
                            {[item.color, item.size].filter(Boolean).join(' · ')}
                          </Typography>
                        )}
                      </Box>
                      <IconButton size="small" onClick={() => { removeItem(item.key); toast.info(`${item.title} removed`); }} aria-label={`Remove ${item.title}`}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mt: 1.5 }}>
                      <QuantitySelector value={item.quantity} onChange={(q) => updateQuantity(item.key, q)} max={Math.min(item.stock || 10, 10)} />
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Button size="small" color="inherit" startIcon={<BookmarkBorderIcon fontSize="small" />} onClick={() => saveForLater(item.key)}>
                          Save for later
                        </Button>
                        <Typography variant="subtitle1">{formatPrice(item.price * item.quantity)}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Card>

          <Button component={RouterLink} to="/shop" sx={{ mt: 2 }}>← Continue shopping</Button>

          {/* Saved for later */}
          {savedForLater.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Saved for later ({savedForLater.length})</Typography>
              <Grid container spacing={2}>
                {savedForLater.map((item) => (
                  <Grid item xs={12} sm={6} key={item.key}>
                    <SavedRow item={item} onMove={moveToCart} onRemove={removeSaved} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>

        {/* Summary */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: 96 }}>
            {/* Coupon box */}
            <Card sx={{ p: 2, mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <LocalOfferOutlinedIcon fontSize="small" color="primary" />
                <Typography variant="subtitle2">Have a coupon?</Typography>
              </Stack>

              {coupon ? (
                <Alert
                  severity="success"
                  action={<IconButton size="small" onClick={removeCoupon} aria-label="Remove coupon"><CloseIcon fontSize="small" /></IconButton>}
                >
                  <strong>{coupon.code}</strong> applied — you saved {formatPrice(totals.couponDiscount)}
                </Alert>
              ) : (
                <>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      error={Boolean(couponError)}
                      sx={{ flex: 1 }}
                    />
                    <Button variant="outlined" onClick={submitCoupon} disabled={applyingCoupon} sx={{ height: 40 }}>
                      Apply
                    </Button>
                  </Stack>
                  {couponError && <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: 'block' }}>{couponError}</Typography>}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Try <strong>WELCOME10</strong> for 10% off your first order.
                  </Typography>
                </>
              )}
            </Card>

            <OrderSummary totals={totals} coupon={coupon} />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

/** Compact card for a saved-for-later item. */
function SavedRow({ item, onMove, onRemove }) {
  return (
    <Card sx={{ p: 1.5, display: 'flex', gap: 1.5, height: '100%' }}>
      <Box component={RouterLink} to={`/product/${item.productId}`} sx={{ flexShrink: 0 }}>
        <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: 72, height: 72, borderRadius: 1.5, objectFit: 'cover', display: 'block' }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ my: 0.5 }}>{formatPrice(item.price)}</Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => onMove(item.key)}>Move to cart</Button>
          <IconButton size="small" onClick={() => onRemove(item.key)} aria-label="Remove"><DeleteOutlineIcon fontSize="small" /></IconButton>
        </Stack>
      </Box>
    </Card>
  );
}
