import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

/**
 * Plus / minus quantity control with stock-aware limits.
 *
 * @param {{value:number, onChange:(next:number)=>void, min?:number, max?:number,
 *          size?:'small'|'medium', disabled?:boolean}} props
 */
export default function QuantitySelector({
  value, onChange, min = 1, max = 10, size = 'medium', disabled = false, sx = {},
}) {
  const dimension = size === 'small' ? 28 : 34;
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        ...sx,
      }}
    >
      <IconButton
        size="small"
        onClick={() => onChange(value - 1)}
        disabled={disabled || atMin}
        aria-label="Reduce quantity"
        sx={{ width: dimension, height: dimension, borderRadius: 0 }}
      >
        <RemoveIcon fontSize="inherit" />
      </IconButton>

      <Typography
        component="span"
        aria-live="polite"
        sx={{
          minWidth: dimension + 4,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: size === 'small' ? '0.8rem' : '0.9rem',
        }}
      >
        {value}
      </Typography>

      <Tooltip title={atMax ? `Only ${max} available` : ''} disableHoverListener={!atMax}>
        <span>
          <IconButton
            size="small"
            onClick={() => onChange(value + 1)}
            disabled={disabled || atMax}
            aria-label="Increase quantity"
            sx={{ width: dimension, height: dimension, borderRadius: 0 }}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
