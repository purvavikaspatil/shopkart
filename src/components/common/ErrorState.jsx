import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Reusable failure screen.
 * Errors explain what happened and what to do next; they do not apologise.
 *
 * @param {{variant?:'generic'|'network'|'notFound', title?:string,
 *          message?:string, onRetry?:Function, homeTo?:string}} props
 */
const PRESETS = {
  generic: {
    icon: <ErrorOutlineIcon />,
    title: 'Something broke on our side',
    message: 'The page did not load correctly. Retrying usually fixes it. If it keeps happening, our support team can look into it.',
  },
  network: {
    icon: <WifiOffIcon />,
    title: 'No connection',
    message: 'We could not reach the server. Check your internet connection and try again.',
  },
  notFound: {
    icon: <SearchOffIcon />,
    title: 'We could not find that',
    message: 'The item may have been removed, or the link might be out of date.',
  },
};

export default function ErrorState({
  variant = 'generic', title, message, onRetry, homeTo = '/', homeLabel = 'Go to homepage', sx = {},
}) {
  const preset = PRESETS[variant] ?? PRESETS.generic;

  return (
    <Paper variant="outlined" sx={{ textAlign: 'center', px: { xs: 3, sm: 6 }, py: { xs: 6, sm: 8 }, ...sx }}>
      <Box
        sx={{
          width: 76, height: 76, mx: 'auto', mb: 2.5, borderRadius: '50%',
          display: 'grid', placeItems: 'center',
          bgcolor: 'error.main', color: 'error.contrastText',
          '& svg': { fontSize: 38 },
        }}
      >
        {preset.icon}
      </Box>

      <Typography variant="h5" sx={{ mb: 1 }}>{title ?? preset.title}</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mb: 3 }}>
        {message ?? preset.message}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        {onRetry && (
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry} size="large">
            Try again
          </Button>
        )}
        <Button variant="outlined" component={RouterLink} to={homeTo} size="large">
          {homeLabel}
        </Button>
      </Stack>
    </Paper>
  );
}
