import { Grid, Card, Box, Typography, Button, Stack, IconButton, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import PriceDisplay from '@/components/common/PriceDisplay';
import { useWishlist, useCart, useToast } from '@/hooks';
import { productById } from '@/data/products';
import { formatPrice } from '@/utils/format';

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { addItem, openDrawer } = useCart();
  const toast = useToast();

  const moveToCart = (entry) => {
    const product = productById.get(entry.productId);
    if (!product) return;
    if (product.stock === 0) { toast.error('This item is out of stock right now.'); return; }
    addItem(product, { quantity: 1 });
    remove(product.id);
    toast.success('Moved to cart', { action: { label: 'View cart', onClick: openDrawer } });
  };

  if (items.length === 0) {
    return (
      <PageContainer>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
        <EmptyState
          icon={<FavoriteBorderIcon />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to keep it here. We will even flag it if the price drops."
          primaryLabel="Find something to love"
          primaryTo="/shop"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h3">Wishlist ({items.length})</Typography>
        <Button color="inherit" onClick={clear}>Clear all</Button>
      </Stack>

      <Grid container spacing={2}>
        {items.map((entry) => {
          const live = productById.get(entry.productId);
          const currentPrice = live?.price ?? entry.price;
          const priceDropped = currentPrice < entry.savedAtPrice;
          const outOfStock = (live?.stock ?? entry.stock) === 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={entry.productId}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <Box component={RouterLink} to={`/product/${entry.productId}`}>
                    <Box component="img" src={entry.thumbnail} alt={entry.title} sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => remove(entry.productId)}
                    aria-label={`Remove ${entry.title}`}
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', boxShadow: 1 }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                  {priceDropped && (
                    <Chip
                      size="small"
                      color="success"
                      icon={<TrendingDownIcon sx={{ fontSize: 15 }} />}
                      label={`Dropped ${formatPrice(entry.savedAtPrice - currentPrice)}`}
                      sx={{ position: 'absolute', bottom: 8, left: 8 }}
                    />
                  )}
                  {outOfStock && (
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center' }}>
                      <Chip label="Out of stock" sx={{ bgcolor: 'background.paper' }} />
                    </Box>
                  )}
                </Box>

                <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" color="text.secondary">{entry.brand}</Typography>
                  <Typography
                    component={RouterLink}
                    to={`/product/${entry.productId}`}
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1 }}
                  >
                    {entry.title}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    <PriceDisplay price={currentPrice} originalPrice={live?.originalPrice} discount={live?.discount} size="sm" />
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCartIcon />}
                      disabled={outOfStock}
                      onClick={() => moveToCart(entry)}
                      sx={{ mt: 1.5 }}
                    >
                      Move to cart
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </PageContainer>
  );
}
