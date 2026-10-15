import { useState } from 'react';
import { IconButton, Tooltip, keyframes } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useWishlist, useToast } from '@/hooks';

/** One-shot pop when an item is saved. Deliberately short - 320ms. */
const pop = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35); }
  70%  { transform: scale(0.92); }
  100% { transform: scale(1); }
`;

/**
 * Heart toggle. Owns its own wishlist wiring so every surface that shows a
 * product gets identical behaviour and identical toast copy.
 *
 * @param {{product:object, size?:'small'|'medium', variant?:'icon'|'floating'}} props
 */
export default function WishlistButton({ product, size = 'small', variant = 'icon', onToggle, sx = {} }) {
  const { isWishlisted, toggle } = useWishlist();
  const toast = useToast();
  const [animating, setAnimating] = useState(false);

  const saved = isWishlisted(product.id);

  const handleClick = (event) => {
    // Cards are wrapped in links; stop the click from navigating.
    event.preventDefault();
    event.stopPropagation();

    const added = toggle(product);
    if (added) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 340);
    }
    toast.success(added ? 'Saved to your wishlist' : 'Removed from your wishlist', {
      action: added ? { label: 'View', onClick: () => { window.location.href = '/wishlist'; } } : null,
    });
    onToggle?.(added);
  };

  const floatingStyles = variant === 'floating' ? {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    bgcolor: 'background.paper',
    boxShadow: 2,
    '&:hover': { bgcolor: 'background.paper' },
  } : {};

  return (
    <Tooltip title={saved ? 'Remove from wishlist' : 'Save to wishlist'}>
      <IconButton
        size={size}
        onClick={handleClick}
        aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
        aria-pressed={saved}
        sx={{
          color: saved ? 'error.main' : 'text.secondary',
          animation: animating ? `${pop} 340ms ease` : 'none',
          ...floatingStyles,
          ...sx,
        }}
      >
        {saved ? <FavoriteIcon fontSize="inherit" /> : <FavoriteBorderIcon fontSize="inherit" />}
      </IconButton>
    </Tooltip>
  );
}
