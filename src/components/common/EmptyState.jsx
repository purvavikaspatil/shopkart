import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Empty screens are an invitation to act, so every one of these takes a
 * primary action rather than just explaining that there is nothing here.
 *
 * @param {{icon:React.ReactNode, title:string, description?:string,
 *          primaryLabel?:string, primaryTo?:string, onPrimary?:Function,
 *          secondaryLabel?:string, secondaryTo?:string, onSecondary?:Function}} props
 */
export default function EmptyState({
  icon, title, description,
  primaryLabel, primaryTo, onPrimary,
  secondaryLabel, secondaryTo, onSecondary,
  dense = false, sx = {},
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        textAlign: 'center',
        px: { xs: 3, sm: 6 },
        py: dense ? 5 : { xs: 6, sm: 9 },
        borderStyle: 'dashed',
        bgcolor: 'transparent',
        ...sx,
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 76, height: 76, mx: 'auto', mb: 2.5,
            borderRadius: '50%',
            display: 'grid', placeItems: 'center',
            bgcolor: 'action.hover',
            color: 'text.secondary',
            '& svg': { fontSize: 36 },
          }}
        >
          {icon}
        </Box>
      )}

      <Typography variant="h5" sx={{ mb: description ? 1 : 0 }}>{title}</Typography>

      {description && (
        <Typography color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
          {description}
        </Typography>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        {primaryLabel && (
          <Button
            variant="contained"
            size="large"
            component={primaryTo ? RouterLink : 'button'}
            to={primaryTo}
            onClick={onPrimary}
          >
            {primaryLabel}
          </Button>
        )}
        {secondaryLabel && (
          <Button
            variant="outlined"
            size="large"
            component={secondaryTo ? RouterLink : 'button'}
            to={secondaryTo}
            onClick={onSecondary}
          >
            {secondaryLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
