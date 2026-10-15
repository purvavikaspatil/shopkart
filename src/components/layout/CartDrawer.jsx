import {
  Drawer, Box, Typography, IconButton, Stack, Divider, Button, LinearProgress,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import QuantitySelector from '@/components/common/QuantitySelector';
import EmptyState from '@/components/common/EmptyState';
import { useCart, useToast } from '@/hooks';
import { formatPrice } from '@/utils/format';
import { FREE_SHIPPING_THRESHOLD } from '@/utils/constants';

/** Slide-out cart, reachable from the navbar on every page. */
export default function CartDrawer() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    items, itemCount, totals, drawerOpen, closeDrawer,
    updateQuantity, removeItem,
  } = useCart();

  const goTo = (path) => {
    closeDrawer();
    navigate(path);
  };

  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={closeDrawer}
      PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, display: 'flex', flexDirection: 'column' } }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6">Your cart</Typography>
          {itemCount > 0 && <Chip size="small" label={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`} />}
        </Stack>
        <IconButton onClick={closeDrawer} aria-label="Close cart">
          <CloseIcon />
        </IconButton>
      </Stack>

      {items.length === 0 ? (
        <Box sx={{ p: 2, flex: 1, display: 'grid', placeItems: 'center' }}>
          <EmptyState
            dense
            icon={<ShoppingBagOutlinedIcon />}
            title="Your cart is empty"
            description="Browse the shop and add something you like. Items stay here on this device."
            primaryLabel="Start shopping"
            onPrimary={() => goTo('/shop')}
            sx={{ border: 0 }}
          />
        </Box>
      ) : (
        <>
          {/* Free-shipping nudge */}
          <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <LocalShippingOutlinedIcon fontSize="small" color={totals.amountToFreeShipping === 0 ? 'success' : 'action'} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {totals.amountToFreeShipping === 0
                  ? 'Standard shipping is free on this order'
                  : `Add ${formatPrice(totals.amountToFreeShipping)} more for free shipping`}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={totals.amountToFreeShipping === 0 ? 'success' : 'primary'}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
            {items.map((item) => (
              <Box key={item.key}>
                <Stack direction="row" spacing={1.5} sx={{ py: 2 }}>
                  <Box
                    component={RouterLink}
                    to={`/product/${item.productId}`}
                    onClick={closeDrawer}
                    sx={{ flexShrink: 0 }}
                  >
                    <Box
                      component="img"
                      src={item.thumbnail}
                      alt={item.title}
                      sx={{ width: 72, height: 72, borderRadius: 1.5, objectFit: 'cover', display: 'block' }}
                    />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">{item.brand}</Typography>
                    <Typography
                      component={RouterLink}
                      to={`/product/${item.productId}`}
                      onClick={closeDrawer}
                      variant="body2"
                      sx={{
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', fontWeight: 600, color: 'text.primary', textDecoration: 'none',
                      }}
                    >
                      {item.title}
                    </Typography>

                    {(item.size || item.color) && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        {[item.color, item.size].filter(Boolean).join(' · ')}
                      </Typography>
                    )}

                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                      <QuantitySelector
                        size="small"
                        value={item.quantity}
                        max={item.stock || 10}
                        onChange={(q) => updateQuantity(item.key, q)}
                      />
                      <Typography variant="subtitle2">{formatPrice(item.price * item.quantity)}</Typography>
                    </Stack>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => {
                      removeItem(item.key);
                      toast.info(`${item.title} removed from cart`);
                    }}
                    aria-label={`Remove ${item.title}`}
                    sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Divider />
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatPrice(totals.subtotal)}</Typography>
            </Stack>
            {totals.savings > 0 && (
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color="success.main">You save</Typography>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                  {formatPrice(totals.savings)}
                </Typography>
              </Stack>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              Shipping and tax are calculated at checkout.
            </Typography>

            <Stack spacing={1}>
              <Button fullWidth variant="contained" size="large" onClick={() => goTo('/checkout')}>
                Checkout · {formatPrice(totals.subtotal)}
              </Button>
              <Button fullWidth variant="outlined" onClick={() => goTo('/cart')}>
                View full cart
              </Button>
            </Stack>
          </Box>
        </>
      )}
    </Drawer>
  );
}
