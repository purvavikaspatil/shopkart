import { Box, Typography, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Section title with optional subtitle and a "view all" link.
 * Used at the top of every homepage and category block.
 */
export default function SectionHeader({
  title, subtitle, actionLabel, actionTo, onAction, align = 'left', mb = 3, size = 'h4',
}) {
  const showAction = Boolean(actionLabel && (actionTo || onAction));

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent={align === 'center' ? 'center' : 'space-between'}
      alignItems={{ xs: align === 'center' ? 'center' : 'flex-start', sm: 'flex-end' }}
      spacing={1.5}
      sx={{ mb, textAlign: align }}
    >
      <Box>
        <Typography variant={size} component="h2" sx={{ mb: subtitle ? 0.5 : 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 620 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {showAction && (
        <Button
          component={actionTo ? RouterLink : 'button'}
          to={actionTo}
          onClick={onAction}
          endIcon={<ArrowForwardIcon fontSize="small" />}
          size="small"
          sx={{ flexShrink: 0 }}
        >
          {actionLabel}
        </Button>
      )}
    </Stack>
  );
}
