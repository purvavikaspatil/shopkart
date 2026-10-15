import { memo, useState } from 'react';
import {
  Card, CardContent, Box, Typography, Button, Chip, Stack, Tooltip, IconButton, CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BoltIcon from '@mui/icons-material/Bolt';
import PriceDisplay from '@/components/common/PriceDisplay';
import RatingBadge from '@/components/common/RatingBadge';
import WishlistButton from './WishlistButton';
import { useCart, useCompare, useToast } from '@/hooks';
import { formatPrice } from '@/utils/format';

/**
 * The one product card in the app.
 *
 * Variants change density and layout, never the underlying behaviour:
 *   standard   - default grid card
 *   compact    - denser card for 5-6 column grids
 *   featured   - taller card with description, for hero grids
 *   horizontal - image left, details right (list view, cart suggestions)
 *   editorial  - full-bleed image with an overlay, for mixed-size layouts
 *
 * @param {{product:object, variant?:string, showCompare?:boolean, showQuickAdd?:boolean}} props
 */
function ProductCard({
  product,
  variant = 'standard',
  showCompare = false,
  showQuickAdd = true,
  imageHeight,
  sx = {},
}) {
  const { addItem, openDrawer } = useCart();
  const { isComparing, toggle: toggleCompare, max } = useCompare();
  const toast = useToast();
  const [adding, setAdding] = useState(false);

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock < 15;
  const to = `/product/${product.id}`;

  /** Quick add uses the product's first size/colour so one tap still works. */
  const handleAdd = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (outOfStock) return;

    setAdding(true);
    // Small delay so the button's loading state is perceptible rather than a flicker.
    await new Promise((resolve) => { setTimeout(resolve, 320); });

    addItem(product, {
      quantity: 1,
      size: product.sizes?.[0] ?? null,
      color: product.colors?.[0] ?? null,
    });
    setAdding(false);
    toast.success(`${product.title} added to cart`, {
      action: { label: 'View cart', onClick: openDrawer },
    });
  };

  const handleCompare = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const result = toggleCompare(product.id);
    if (result === 'full') toast.warning(`You can compare up to ${max} products at once`);
    else if (result === 'added') toast.info('Added to compare', { action: { label: 'Compare', onClick: () => { window.location.href = '/compare'; } } });
    else toast.info('Removed from compare');
  };

  /** Badges are ordered by importance; at most two show so the corner stays clean. */
  const badges = [];
  if (outOfStock) badges.push({ label: 'Out of stock', color: 'default' });
  else if (product.discount >= 30) badges.push({ label: `${product.discount}% off`, color: 'error' });
  if (product.isNew) badges.push({ label: 'New', color: 'secondary' });
  else if (product.isBestSeller) badges.push({ label: 'Best seller', color: 'warning' });

  /* ------------------------- horizontal ------------------------- */
  if (variant === 'horizontal') {
    return (
      <Card
        sx={{
          display: 'flex',
          overflow: 'hidden',
          transition: 'border-color 160ms ease, box-shadow 160ms ease',
          '&:hover': { borderColor: 'primary.main', boxShadow: 2 },
          ...sx,
        }}
      >
        <Box
          component={RouterLink}
          to={to}
          sx={{
            width: { xs: 116, sm: 172 },
            flexShrink: 0,
            position: 'relative',
            bgcolor: 'action.hover',
          }}
        >
          <Box
            component="img"
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            sx={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              filter: outOfStock ? 'grayscale(1)' : 'none', opacity: outOfStock ? 0.6 : 1,
            }}
          />
        </Box>

        <CardContent sx={{ flex: 1, p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } }, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary">{product.brand}</Typography>
              <Typography
                component={RouterLink}
                to={to}
                variant="subtitle1"
                sx={{
                  color: 'text.primary', textDecoration: 'none', fontWeight: 600,
                  overflow: 'hidden',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {product.title}
              </Typography>
            </Box>
            <WishlistButton product={product} />
          </Stack>

          <RatingBadge value={product.rating} count={product.reviewCount} sx={{ mt: 0.75 }} />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1, display: { xs: 'none', sm: '-webkit-box' },
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {product.description}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1.5}
            sx={{ mt: 1.5 }}
          >
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
            />
            {showQuickAdd && (
              <Button
                variant="contained"
                size="small"
                startIcon={adding ? <CircularProgress size={14} color="inherit" /> : <ShoppingCartOutlinedIcon />}
                onClick={handleAdd}
                disabled={outOfStock || adding}
              >
                {outOfStock ? 'Out of stock' : 'Add to cart'}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  /* ------------------------- editorial ------------------------- */
  if (variant === 'editorial') {
    return (
      <Card
        component={RouterLink}
        to={to}
        sx={{
          display: 'block', position: 'relative', height: '100%', minHeight: 260,
          textDecoration: 'none', overflow: 'hidden',
          '&:hover img': { transform: 'scale(1.05)' },
          ...sx,
        }}
      >
        <Box
          component="img"
          src={product.images[1] ?? product.thumbnail}
          alt={product.title}
          loading="lazy"
          sx={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', transition: 'transform 400ms ease',
          }}
        />
        <Box
          sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(8,10,18,0.88) 0%, rgba(8,10,18,0.25) 45%, rgba(8,10,18,0) 70%)',
          }}
        />
        <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 2.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)' }}>
            {product.subcategory}
          </Typography>
          <Typography variant="h6" sx={{ color: '#fff', mb: 0.5 }}>{product.title}</Typography>
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
            {formatPrice(product.price)}
          </Typography>
        </Box>
      </Card>
    );
  }

  /* --------------- standard / compact / featured --------------- */
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
        '&:hover .product-hover-image': { opacity: 1 },
        ...sx,
      }}
    >
      {/* Image with a cross-fade to the second shot on hover. */}
      <Box
        component={RouterLink}
        to={to}
        sx={{
          position: 'relative',
          display: 'block',
          pt: imageHeight ?? (isFeatured ? '78%' : '100%'),
          bgcolor: 'action.hover',
          overflow: 'hidden',
        }}
        aria-label={product.title}
      >
        <Box
          component="img"
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          sx={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            filter: outOfStock ? 'grayscale(1)' : 'none', opacity: outOfStock ? 0.55 : 1,
          }}
        />
        {product.images[1] && !outOfStock && (
          <Box
            className="product-hover-image"
            component="img"
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            sx={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: 0, transition: 'opacity 300ms ease',
            }}
          />
        )}

        {badges.length > 0 && (
          <Stack spacing={0.5} sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2, alignItems: 'flex-start' }}>
            {badges.slice(0, 2).map((badge) => (
              <Chip key={badge.label} size="small" color={badge.color} label={badge.label} />
            ))}
          </Stack>
        )}

        <WishlistButton product={product} variant="floating" />

        {showCompare && (
          <Tooltip title={isComparing(product.id) ? 'Remove from compare' : 'Add to compare'}>
            <IconButton
              size="small"
              onClick={handleCompare}
              aria-label="Compare this product"
              aria-pressed={isComparing(product.id)}
              sx={{
                position: 'absolute', top: 48, right: 8, zIndex: 2,
                bgcolor: 'background.paper', boxShadow: 2,
                color: isComparing(product.id) ? 'primary.main' : 'text.secondary',
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <CompareArrowsIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: isCompact ? 1.25 : 1.75,
          '&:last-child': { pb: isCompact ? 1.25 : 1.75 },
        }}
      >
        <Typography variant="caption" color="text.secondary" noWrap>{product.brand}</Typography>

        <Typography
          component={RouterLink}
          to={to}
          variant={isCompact ? 'body2' : 'subtitle1'}
          sx={{
            color: 'text.primary', textDecoration: 'none', fontWeight: 600, mt: 0.25,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', minHeight: isCompact ? 36 : 44,
            '&:hover': { color: 'primary.main' },
          }}
        >
          {product.title}
        </Typography>

        {isFeatured && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.75, display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {product.description}
          </Typography>
        )}

        <RatingBadge value={product.rating} count={product.reviewCount} sx={{ mt: 0.75 }} />

        <Box sx={{ mt: 'auto', pt: 1 }}>
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            size={isCompact ? 'sm' : 'md'}
          />

          {lowStock && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>
              Only {product.stock} left
            </Typography>
          )}

          {showQuickAdd && !isCompact && (
            <Button
              fullWidth
              variant={isFeatured ? 'contained' : 'outlined'}
              size="small"
              startIcon={
                adding
                  ? <CircularProgress size={14} color="inherit" />
                  : outOfStock ? <BoltIcon /> : <ShoppingCartOutlinedIcon />
              }
              onClick={handleAdd}
              disabled={outOfStock || adding}
              sx={{ mt: 1.5 }}
            >
              {outOfStock ? 'Out of stock' : adding ? 'Adding' : 'Add to cart'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

// Cards render in long grids; memoising avoids re-rendering all of them when
// an unrelated piece of cart or wishlist state changes.
export default memo(ProductCard);
