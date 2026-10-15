import { useState } from 'react';
import { Card, Box, Typography, Button, Stack, Chip, Tooltip, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { formatPrice, formatDate } from '@/utils/format';
import { useToast } from '@/hooks';

/**
 * Coupon with a perforated left edge (the notches are pure CSS radial
 * gradients, so there is no image to load).
 */
export default function CouponCard({ coupon, onApply, applied = false, dense = false }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success(`${coupon.code} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Your browser blocked the clipboard. Select and copy the code manually.');
    }
  };

  const value = coupon.type === 'percent'
    ? `${coupon.value}% off`
    : `${formatPrice(coupon.value)} off`;

  return (
    <Card
      sx={{
        position: 'relative',
        opacity: coupon.isExpired ? 0.6 : 1,
        overflow: 'visible',
        display: 'flex',
        // The notch that makes it read as a ticket.
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          left: dense ? 68 : 88,
          width: 14, height: 14,
          borderRadius: '50%',
          bgcolor: 'background.default',
          border: 1,
          borderColor: 'divider',
        },
        '&::before': { top: -8 },
        '&::after': { bottom: -8 },
      }}
    >
      <Box
        sx={{
          width: dense ? 75 : 95,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          bgcolor: coupon.isExpired ? 'action.disabledBackground' : 'primary.main',
          color: coupon.isExpired ? 'text.disabled' : 'primary.contrastText',
          p: 1,
          textAlign: 'center',
        }}
      >
        <Box>
          <LocalOfferIcon sx={{ fontSize: 20, mb: 0.5 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {value}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: dense ? 1.5 : 2, minWidth: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.04em' }}
              >
                {coupon.code}
              </Typography>
              <Tooltip title={copied ? 'Copied' : 'Copy code'}>
                <IconButton size="small" onClick={copy} aria-label={`Copy coupon code ${coupon.code}`}>
                  {copied
                    ? <CheckIcon sx={{ fontSize: 15 }} color="success" />
                    : <ContentCopyIcon sx={{ fontSize: 15 }} />}
                </IconButton>
              </Tooltip>
              {coupon.isExpired && <Chip size="small" label="Expired" />}
            </Stack>

            <Typography variant="body2" sx={{ fontWeight: 600 }}>{coupon.title}</Typography>
            {!dense && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {coupon.description}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Minimum order {formatPrice(coupon.minOrder)}
              {coupon.maxDiscount ? ` · up to ${formatPrice(coupon.maxDiscount)}` : ''}
              {coupon.isExpired ? ` · ended ${formatDate(coupon.expiresAt)}` : ` · valid till ${formatDate(coupon.expiresAt)}`}
            </Typography>
          </Box>

          {onApply && (
            <Button
              size="small"
              variant={applied ? 'outlined' : 'contained'}
              onClick={() => onApply(coupon)}
              disabled={coupon.isExpired}
              sx={{ flexShrink: 0 }}
            >
              {applied ? 'Applied' : 'Apply'}
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
