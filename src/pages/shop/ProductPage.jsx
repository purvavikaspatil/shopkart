import { useState, useEffect } from 'react';
import { useParams, Navigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Grid, Stack, Typography, Button, Chip, Divider, Rating, Tabs, Tab,
  TextField, Table, TableBody, TableRow, TableCell, LinearProgress, Alert,
  ToggleButton, ToggleButtonGroup, Card, CircularProgress, IconButton,
  Snackbar, Checkbox,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BoltIcon from '@mui/icons-material/Bolt';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';
import PriceDisplay from '@/components/common/PriceDisplay';
import QuantitySelector from '@/components/common/QuantitySelector';
import SectionHeader from '@/components/common/SectionHeader';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductCarousel from '@/components/product/ProductCarousel';
import ReviewCard from '@/components/product/ReviewCard';
import WishlistButton from '@/components/product/WishlistButton';
import { productService } from '@/services';
import { useAsync, useCart, useCompare, useRecentlyViewed, useToast } from '@/hooks';
import { getCategoryByName } from '@/data/categories';
import { formatPrice, formatNumber } from '@/utils/format';
import { validatePincode } from '@/utils/validators';

/** Small labelled promise row (shipping / returns / warranty). */
function Promise({ icon, title, caption }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center', '& svg': { fontSize: 22 } }}>{icon}</Box>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{caption}</Typography>
      </Box>
    </Stack>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const toast = useToast();
  const { addItem, openDrawer } = useCart();
  const { toggle: toggleCompare, isComparing } = useCompare();
  const { record } = useRecentlyViewed();

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [tab, setTab] = useState(0);

  // Delivery checker state.
  const [pincode, setPincode] = useState('');
  const [pinError, setPinError] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [checkingPin, setCheckingPin] = useState(false);

  const { data: product, loading, error, refetch } = useAsync(
    () => productService.getProductById(id),
    [id],
  );
  const reviews = useAsync(() => productService.getReviews(Number(id)), [id]);
  const related = useAsync(() => productService.getRelated(Number(id), 10), [id]);
  const fbt = useAsync(() => productService.getFrequentlyBoughtTogether(Number(id)), [id]);

  // Record the visit and reset the variant selection when the product changes.
  useEffect(() => {
    if (product) {
      record(product.id);
      setQuantity(1);
      setSize(product.sizes?.[0] ?? null);
      setColor(product.colors?.[0] ?? null);
      setDelivery(null);
      setPincode('');
      window.scrollTo({ top: 0 });
    }
  }, [product, record]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSkeleton variant="productDetail" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState variant="notFound" onRetry={refetch} />
      </PageContainer>
    );
  }

  if (!product) return <Navigate to="/404" replace />;

  const category = getCategoryByName(product.category);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  const requiresSize = product.sizes?.length > 0;
  const requiresColor = product.colors?.length > 0;

  const handleAddToCart = (thenCheckout = false) => {
    if (requiresSize && !size) { toast.error('Please choose a size first.'); return; }
    if (requiresColor && !color) { toast.error('Please choose a colour first.'); return; }
    addItem(product, { quantity, size, color });
    if (thenCheckout) {
      openDrawer();
    } else {
      toast.success(`${product.title} added to cart`, { action: { label: 'View cart', onClick: openDrawer } });
    }
  };

  const checkDelivery = async () => {
    const message = validatePincode(pincode);
    setPinError(message);
    if (message) return;
    setCheckingPin(true);
    try {
      const result = await productService.checkDelivery(pincode, product.id);
      setDelivery(result);
    } catch {
      toast.error('Could not check delivery right now. Try again.');
    } finally {
      setCheckingPin(false);
    }
  };

  // Frequently-bought-together bundle total.
  const bundleItems = [product, ...(fbt.data ?? [])];
  const bundleTotal = bundleItems.reduce((sum, p) => sum + p.price, 0);

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: product.category, to: category ? `/category/${category.slug}` : '/shop' },
          { label: product.title },
        ]}
      />

      <Grid container spacing={{ xs: 3, md: 5 }}>
        {/* Gallery */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: { md: 'sticky' }, top: 96 }}>
            <ProductImageGallery
              images={product.images}
              alt={product.title}
              badge={!inStock ? { label: 'Out of stock', color: 'default' } : product.discount >= 25 ? { label: `${product.discount}% off`, color: 'error' } : null}
            />
          </Box>
        </Grid>

        {/* Buy box */}
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>{product.brand}</Typography>
            {product.isBestSeller && <Chip size="small" color="warning" label="Best seller" />}
            {product.isNew && <Chip size="small" color="success" label="New" />}
          </Stack>

          <Typography variant="h4" sx={{ mb: 1 }}>{product.title}</Typography>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Rating value={product.rating} readOnly precision={0.1} size="small" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.rating}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="a"
              href="#reviews"
              onClick={() => setTab(1)}
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              {formatNumber(product.reviewCount)} ratings
            </Typography>
          </Stack>

          <PriceDisplay price={product.price} originalPrice={product.originalPrice} discount={product.discount} size="lg" />

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Inclusive of all taxes
          </Typography>

          {lowStock && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Only {product.stock} left in stock — order soon.
            </Alert>
          )}
          {!inStock && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This item is currently out of stock. Add it to your wishlist and we will nudge you when it is back.
            </Alert>
          )}

          <Divider sx={{ my: 2.5 }} />

          {/* Colour selector */}
          {requiresColor && (
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Colour: <Box component="span" color="text.secondary">{color}</Box></Typography>
              <ToggleButtonGroup exclusive value={color} onChange={(_, v) => v && setColor(v)} size="small">
                {product.colors.map((c) => (
                  <ToggleButton key={c} value={c} sx={{ textTransform: 'none' }}>{c}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Size selector */}
          {requiresSize && (
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Size: <Box component="span" color="text.secondary">{size}</Box></Typography>
              <ToggleButtonGroup exclusive value={size} onChange={(_, v) => v && setSize(v)} size="small">
                {product.sizes.map((s) => (
                  <ToggleButton key={s} value={s} sx={{ minWidth: 48 }}>{s}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Quantity + actions */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Quantity</Typography>
            <QuantitySelector value={quantity} onChange={setQuantity} max={Math.min(product.stock || 10, 10)} disabled={!inStock} />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 1.5 }}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<ShoppingCartIcon />}
              disabled={!inStock}
              onClick={() => handleAddToCart(false)}
            >
              Add to cart
            </Button>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<BoltIcon />}
              disabled={!inStock}
              onClick={() => handleAddToCart(true)}
            >
              Buy now
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Button
              variant="text"
              size="small"
              startIcon={<CompareArrowsIcon />}
              color={isComparing(product.id) ? 'primary' : 'inherit'}
              onClick={() => toggleCompare(product.id)}
            >
              {isComparing(product.id) ? 'Added to compare' : 'Compare'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WishlistButton product={product} size="small" />
              <Typography variant="body2" color="text.secondary">Save for later</Typography>
            </Box>
          </Stack>

          {/* Delivery checker */}
          <Card sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Check delivery & services</Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setPinError(''); }}
                error={Boolean(pinError)}
                helperText={pinError}
                sx={{ flex: 1 }}
                inputProps={{ inputMode: 'numeric' }}
              />
              <Button variant="outlined" onClick={checkDelivery} disabled={checkingPin} sx={{ flexShrink: 0, height: 40 }}>
                {checkingPin ? <CircularProgress size={18} /> : 'Check'}
              </Button>
            </Stack>

            {delivery && (
              <Box sx={{ mt: 1.5 }}>
                {delivery.serviceable ? (
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{delivery.message}</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {delivery.codAvailable ? 'Cash on delivery available' : 'Prepaid only'}
                      {delivery.sameDay ? ' · Same-day delivery available' : ''}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="error.main">{delivery.message}</Typography>
                )}
              </Box>
            )}
          </Card>

          {/* Promises */}
          <Stack spacing={1.5}>
            <Promise icon={<LocalShippingOutlinedIcon />} title={product.price >= 999 ? 'Free delivery' : 'Standard delivery ₹49'} caption={`Usually ships in ${product.deliveryDays} day${product.deliveryDays > 1 ? 's' : ''}`} />
            <Promise icon={<ReplayOutlinedIcon />} title={product.returnPolicy} caption="Easy pickup from your doorstep" />
            <Promise icon={<VerifiedUserOutlinedIcon />} title={product.warranty} caption="Covered against manufacturing defects" />
          </Stack>
        </Grid>
      </Grid>

      {/* Frequently bought together */}
      {(fbt.data?.length ?? 0) > 0 && (
        <Box sx={{ mt: 6 }}>
          <SectionHeader title="Frequently bought together" size="h5" mb={2} />
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ flex: 1 }} useFlexGap>
                {bundleItems.map((item, i) => (
                  <Stack key={item.id} direction="row" spacing={1} alignItems="center">
                    <Box component={RouterLink} to={`/product/${item.id}`}>
                      <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: 84, height: 84, borderRadius: 2, objectFit: 'cover', display: 'block' }} />
                    </Box>
                    {i < bundleItems.length - 1 && <AddIcon color="disabled" />}
                  </Stack>
                ))}
              </Stack>
              <Box sx={{ textAlign: { md: 'right' } }}>
                <Typography variant="caption" color="text.secondary">Bundle price</Typography>
                <Typography variant="h5" sx={{ mb: 1 }}>{formatPrice(bundleTotal)}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    bundleItems.forEach((item) => addItem(item, { quantity: 1 }));
                    toast.success('Bundle added to cart', { action: { label: 'View cart', onClick: openDrawer } });
                  }}
                >
                  Add all {bundleItems.length} to cart
                </Button>
              </Box>
            </Stack>
          </Card>
        </Box>
      )}

      {/* Detail tabs */}
      <Box sx={{ mt: 6 }} id="reviews">
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Description" />
          <Tab label={`Reviews (${formatNumber(product.reviewCount)})`} />
          <Tab label="Specifications" />
        </Tabs>

        {/* Description */}
        {tab === 0 && (
          <Box sx={{ py: 3 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 760 }}>
              {product.description}
            </Typography>
            {product.highlights?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 1.5 }}>Highlights</Typography>
                <Grid container spacing={1.5} sx={{ maxWidth: 760 }}>
                  {product.highlights.map((h) => (
                    <Grid item xs={12} sm={6} key={h}>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <CheckCircleIcon color="primary" sx={{ fontSize: 18, mt: 0.25 }} />
                        <Typography variant="body2">{h}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        )}

        {/* Reviews */}
        {tab === 1 && (
          <Box sx={{ py: 3 }}>
            {reviews.loading ? (
              <LinearProgress />
            ) : (
              <Grid container spacing={4}>
                {/* Breakdown */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h2">{product.rating}</Typography>
                    <Rating value={product.rating} readOnly precision={0.1} sx={{ my: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Based on {formatNumber(product.reviewCount)} ratings
                    </Typography>
                    <Stack spacing={0.75}>
                      {(reviews.data?.breakdown ?? []).map((row) => (
                        <Stack key={row.star} direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption" sx={{ width: 24 }}>{row.star}★</Typography>
                          <LinearProgress variant="determinate" value={row.percent} sx={{ flex: 1, height: 8, borderRadius: 4 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ width: 36, textAlign: 'right' }}>{row.percent}%</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Card>
                </Grid>

                {/* List */}
                <Grid item xs={12} md={8}>
                  {(reviews.data?.items ?? []).length === 0 ? (
                    <Typography color="text.secondary">No written reviews yet. Be the first to share your thoughts.</Typography>
                  ) : (
                    <Stack divider={<Divider />}>
                      {reviews.data.items.map((review) => (
                        <ReviewCard key={review.id} review={review} variant="plain" />
                      ))}
                    </Stack>
                  )}
                </Grid>
              </Grid>
            )}
          </Box>
        )}

        {/* Specifications */}
        {tab === 2 && (
          <Box sx={{ py: 3, maxWidth: 760 }}>
            <Table>
              <TableBody>
                {Object.entries(product.specifications ?? {}).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 600, width: '40%', color: 'text.secondary', border: 0, py: 1 }}>{key}</TableCell>
                    <TableCell sx={{ border: 0, py: 1 }}>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Related */}
      <Box sx={{ mt: 6 }}>
        <SectionHeader title="You might also like" size="h5" mb={2} />
        <ProductCarousel products={related.data ?? []} loading={related.loading} />
      </Box>
    </PageContainer>
  );
}
