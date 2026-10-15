import { Box, Typography, Stack } from '@mui/material';
import useCountdown from '@/hooks/useCountdown';

/** A single two-digit block in the countdown. */
function TimeBlock({ value, label, compact }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          minWidth: compact ? 34 : 46,
          px: compact ? 0.75 : 1.25,
          py: compact ? 0.4 : 0.75,
          borderRadius: 1.5,
          bgcolor: 'text.primary',
          color: 'background.paper',
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          fontSize: compact ? '0.85rem' : '1.15rem',
          lineHeight: 1.3,
        }}
      >
        {String(value).padStart(2, '0')}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: compact ? '0.6rem' : '0.68rem' }}>
        {label}
      </Typography>
    </Box>
  );
}

/**
 * Countdown to a deadline. Shows days only when there is at least one.
 * @param {{target:Date|string|number, compact?:boolean, onExpire?:Function}} props
 */
export default function CountdownTimer({ target, compact = false, label, sx = {} }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(target);

  if (expired) {
    return (
      <Typography variant="body2" color="text.secondary" sx={sx}>
        This offer has ended
      </Typography>
    );
  }

  return (
    <Stack direction="row" spacing={compact ? 0.75 : 1.25} alignItems="center" sx={sx}>
      {label && (
        <Typography variant="body2" sx={{ fontWeight: 600, mr: 0.5 }}>{label}</Typography>
      )}
      {days > 0 && <TimeBlock value={days} label="days" compact={compact} />}
      <TimeBlock value={hours} label="hrs" compact={compact} />
      <TimeBlock value={minutes} label="min" compact={compact} />
      <TimeBlock value={seconds} label="sec" compact={compact} />
    </Stack>
  );
}
