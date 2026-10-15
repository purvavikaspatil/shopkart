import { Paper, Box, Stack, Typography, Button, IconButton, Slide, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '@/hooks';
import { productById } from '@/data/products';

/**
 * Sticky tray listing products queued for comparison.
 * Appears only when at least one product is selected.
 */
export default function CompareTray() {
  const { ids, remove, clear, count } = useCompare();
  const navigate = useNavigate();

  const items = ids.map((id) => productById.get(id)).filter(Boolean);

  return (
    <Slide direction="up" in={count > 0} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          left: { xs: 8, md: 24 },
          right: { xs: 8, md: 24 },
          bottom: { xs: 70, md: 20 },
          zIndex: (t) => t.zIndex.appBar - 1,
          p: 1.5,
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack direction="row" spacing={1} sx={{ flex: 1, overflowX: 'auto' }} className="no-scrollbar">
            {items.map((product) => (
              <Box key={product.id} sx={{ position: 'relative', flexShrink: 0 }}>
                <Box
                  component="img"
                  src={product.thumbnail}
                  alt={product.title}
                  sx={{ width: 52, height: 52, borderRadius: 1.5, objectFit: 'cover', display: 'block' }}
                />
                <IconButton
                  size="small"
                  onClick={() => remove(product.id)}
                  aria-label={`Remove ${product.title} from compare`}
                  sx={{
                    position: 'absolute', top: -6, right: -6,
                    bgcolor: 'background.paper', boxShadow: 2, p: 0.25,
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Box>
            ))}
          </Stack>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="caption" color="text.secondary">
              {count} selected
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Clear all">
              <IconButton onClick={clear} size="small" aria-label="Clear comparison list">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              size="small"
              startIcon={<CompareArrowsIcon />}
              onClick={() => navigate('/compare')}
              disabled={count < 2}
            >
              Compare
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );
}
