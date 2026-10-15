import { useState, useRef } from 'react';
import { Box, Stack, IconButton, Chip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

/**
 * Product gallery with thumbnails and hover-to-zoom.
 *
 * Zoom follows the pointer by shifting `transform-origin`, which is cheaper
 * than a second magnified image and works with any aspect ratio. On touch,
 * where there is no hover, arrows and thumbnails carry the interaction.
 */
export default function ProductImageGallery({ images = [], alt = '', badge = null }) {
  const [index, setIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const frameRef = useRef(null);

  const go = (delta) => {
    setIndex((prev) => (prev + delta + images.length) % images.length);
  };

  const handleMove = (event) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  if (images.length === 0) return null;

  return (
    <Box>
      <Box
        ref={frameRef}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => { setZooming(false); setOrigin('50% 50%'); }}
        onMouseMove={handleMove}
        sx={{
          position: 'relative',
          pt: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'action.hover',
          border: 1,
          borderColor: 'divider',
          cursor: 'zoom-in',
        }}
      >
        <Box
          component="img"
          src={images[index]}
          alt={`${alt} - image ${index + 1} of ${images.length}`}
          sx={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 220ms ease',
            transform: zooming ? 'scale(1.9)' : 'scale(1)',
            transformOrigin: origin,
          }}
        />

        {badge && (
          <Chip
            size="small"
            color={badge.color ?? 'error'}
            label={badge.label}
            sx={{ position: 'absolute', top: 12, left: 12 }}
          />
        )}

        <Chip
          size="small"
          icon={<ZoomInIcon sx={{ fontSize: 14 }} />}
          label="Hover to zoom"
          sx={{
            position: 'absolute', bottom: 12, right: 12,
            bgcolor: 'background.paper',
            display: { xs: 'none', md: 'flex' },
          }}
        />

        {images.length > 1 && (
          <>
            <IconButton
              onClick={() => go(-1)}
              aria-label="Previous image"
              sx={{
                position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
                bgcolor: 'background.paper', boxShadow: 2, '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => go(1)}
              aria-label="Next image"
              sx={{
                position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)',
                bgcolor: 'background.paper', boxShadow: 2, '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: 'auto', pb: 0.5 }} className="no-scrollbar">
        {images.map((src, i) => (
          <Box
            key={src}
            component="button"
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show image ${i + 1}`}
            aria-current={i === index}
            sx={{
              flex: '0 0 auto',
              width: 72, height: 72, p: 0,
              borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
              border: 2,
              borderColor: i === index ? 'primary.main' : 'divider',
              bgcolor: 'transparent',
              transition: 'border-color 160ms ease',
            }}
          >
            <Box
              component="img"
              src={src}
              alt=""
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
