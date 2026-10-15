import { useRef, useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductCard from './ProductCard';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

/**
 * Horizontal, swipe-friendly product rail.
 *
 * Uses native scroll with snap points rather than a carousel library: it is
 * lighter, works with touch and trackpads out of the box, and keeps keyboard
 * scrolling intact. Arrows appear only when there is something to scroll to.
 */
export default function ProductCarousel({
  products = [], loading = false, cardWidth = { xs: 168, sm: 200, md: 232 }, variant = 'standard', sx = {},
}) {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return undefined;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows, products.length, loading]);

  /** Scrolls by roughly one screen of cards. */
  const scrollBy = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth * 0.82), behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Stack direction="row" spacing={2} sx={{ overflow: 'hidden', ...sx }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} sx={{ flex: '0 0 auto', width: cardWidth }}>
            <LoadingSkeleton variant="productCard" />
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <Box
        ref={scrollerRef}
        className="no-scrollbar"
        sx={{
          display: 'flex',
          gap: { xs: 1.5, md: 2.5 },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          // Bleed to the container edge on mobile so cards peek at the sides.
          px: { xs: 0.25, md: 0 },
          pb: 1,
        }}
      >
        {products.map((product) => (
          <Box
            key={product.id}
            sx={{ flex: '0 0 auto', width: cardWidth, scrollSnapAlign: 'start' }}
          >
            <ProductCard product={product} variant={variant} showCompare={false} />
          </Box>
        ))}
      </Box>

      {/* Arrows are decorative on touch devices, so they are hidden below md. */}
      {canScrollLeft && (
        <IconButton
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          sx={{
            display: { xs: 'none', md: 'grid' },
            position: 'absolute', top: '38%', left: -18, zIndex: 2,
            bgcolor: 'background.paper', boxShadow: 3,
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      {canScrollRight && (
        <IconButton
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          sx={{
            display: { xs: 'none', md: 'grid' },
            position: 'absolute', top: '38%', right: -18, zIndex: 2,
            bgcolor: 'background.paper', boxShadow: 3,
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}
