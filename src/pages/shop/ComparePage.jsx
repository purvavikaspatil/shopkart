import { Box, Typography, Button, Table, TableBody, TableRow, TableCell, TableHead, Rating, Stack, IconButton, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckIcon from '@mui/icons-material/Check';
import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import PriceDisplay from '@/components/common/PriceDisplay';
import { useCompare, useCart, useToast } from '@/hooks';
import { productById } from '@/data/products';
import { formatNumber } from '@/utils/format';

/** Union of every specification key across the compared products. */
function collectSpecKeys(products) {
  const keys = [];
  products.forEach((p) => {
    Object.keys(p.specifications ?? {}).forEach((k) => {
      if (!keys.includes(k)) keys.push(k);
    });
  });
  return keys;
}

export default function ComparePage() {
  const { ids, remove, clear } = useCompare();
  const { addItem, openDrawer } = useCart();
  const toast = useToast();

  const products = ids.map((id) => productById.get(id)).filter(Boolean);

  if (products.length === 0) {
    return (
      <PageContainer>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Compare' }]} />
        <EmptyState
          icon={<CompareArrowsIcon />}
          title="Nothing to compare yet"
          description="Add products to compare from any product card or product page, then see their specs side by side here."
          primaryLabel="Browse products"
          primaryTo="/shop"
        />
      </PageContainer>
    );
  }

  const specKeys = collectSpecKeys(products);

  /** A styled cell header per product with image, title and remove control. */
  const headerCell = (product) => (
    <TableCell key={product.id} sx={{ minWidth: 220, verticalAlign: 'top', borderBottom: 0 }}>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          size="small"
          onClick={() => remove(product.id)}
          aria-label={`Remove ${product.title}`}
          sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper', boxShadow: 1 }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Box component={RouterLink} to={`/product/${product.id}`}>
          <Box component="img" src={product.thumbnail} alt={product.title} sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 2 }} />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>{product.brand}</Typography>
        <Typography
          component={RouterLink}
          to={`/product/${product.id}`}
          variant="body2"
          sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {product.title}
        </Typography>
      </Box>
    </TableCell>
  );

  const row = (label, render) => (
    <TableRow>
      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: 160, position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        {label}
      </TableCell>
      {products.map((p) => (
        <TableCell key={p.id}>{render(p)}</TableCell>
      ))}
    </TableRow>
  );

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Compare' }]} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h3">Compare {products.length} products</Typography>
        <Button color="inherit" onClick={clear}>Clear all</Button>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 200 + products.length * 220 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: 0, position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 1 }} />
              {products.map(headerCell)}
            </TableRow>
          </TableHead>
          <TableBody>
            {row('Price', (p) => <PriceDisplay price={p.price} originalPrice={p.originalPrice} discount={p.discount} size="sm" />)}
            {row('Rating', (p) => (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Rating value={p.rating} readOnly size="small" precision={0.1} />
                <Typography variant="caption" color="text.secondary">({formatNumber(p.reviewCount)})</Typography>
              </Stack>
            ))}
            {row('Availability', (p) => (
              p.stock > 0
                ? <Chip size="small" color="success" icon={<CheckIcon sx={{ fontSize: 14 }} />} label="In stock" />
                : <Chip size="small" label="Out of stock" />
            ))}
            {row('Category', (p) => <Typography variant="body2">{p.category}</Typography>)}
            {row('Delivery', (p) => <Typography variant="body2">{p.deliveryDays} day{p.deliveryDays > 1 ? 's' : ''}</Typography>)}
            {row('Warranty', (p) => <Typography variant="body2">{p.warranty}</Typography>)}
            {row('Returns', (p) => <Typography variant="body2">{p.returnPolicy}</Typography>)}

            {specKeys.map((key) => row(key, (p) => (
              <Typography variant="body2" color={p.specifications?.[key] ? 'text.primary' : 'text.disabled'}>
                {p.specifications?.[key] ?? '—'}
              </Typography>
            )))}

            {row('', (p) => (
              <Button
                variant="contained"
                size="small"
                disabled={p.stock === 0}
                onClick={() => {
                  addItem(p, { quantity: 1 });
                  toast.success('Added to cart', { action: { label: 'View cart', onClick: openDrawer } });
                }}
              >
                Add to cart
              </Button>
            ))}
          </TableBody>
        </Table>
      </Box>
    </PageContainer>
  );
}
