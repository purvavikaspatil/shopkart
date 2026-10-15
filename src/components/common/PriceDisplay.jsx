import { Box, Typography, Chip } from '@mui/material';
import { formatPrice } from '@/utils/format';

/**
 * Price, struck-through MRP and discount chip in one consistent block.
 *
 * @param {{price:number, originalPrice?:number, discount?:number,
 *          size?:'sm'|'md'|'lg', showDiscount?:boolean, inline?:boolean}} props
 */
export default function PriceDisplay({
  price, originalPrice, discount = 0, size = 'md', showDiscount = true, inline = true, sx = {},
}) {
  const variants = {
    sm: { price: 'subtitle2', mrp: 'caption' },
    md: { price: 'h6', mrp: 'body2' },
    lg: { price: 'h4', mrp: 'body1' },
  }[size];

  const hasDiscount = originalPrice > price;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: inline ? 'baseline' : 'flex-start',
        flexDirection: inline ? 'row' : 'column',
        flexWrap: 'wrap',
        gap: inline ? 0.75 : 0.25,
        ...sx,
      }}
    >
      <Typography variant={variants.price} component="span" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
        {formatPrice(price)}
      </Typography>

      {hasDiscount && (
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
          <Typography
            variant={variants.mrp}
            component="span"
            color="text.disabled"
            sx={{ textDecoration: 'line-through' }}
          >
            {formatPrice(originalPrice)}
          </Typography>

          {showDiscount && discount > 0 && (
            size === 'lg'
              ? <Chip size="small" color="success" label={`${discount}% off`} />
              : (
                <Typography variant={variants.mrp} component="span" color="success.main" sx={{ fontWeight: 700 }}>
                  {discount}% off
                </Typography>
              )
          )}
        </Box>
      )}
    </Box>
  );
}
