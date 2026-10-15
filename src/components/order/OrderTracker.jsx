import { Box, Stack, Typography, Step, Stepper, StepLabel, StepConnector, stepConnectorClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import { formatDateTime } from '@/utils/format';

/** Gradient connector that fills in as the shipment progresses. */
const ProgressConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.divider,
    borderTopWidth: 3,
    borderRadius: 3,
  },
}));

/** Custom circular step icon: check when done, filled dot when active. */
function StepIconDot({ active, completed }) {
  return (
    <Box
      sx={{
        width: 30, height: 30, borderRadius: '50%',
        display: 'grid', placeItems: 'center',
        bgcolor: completed || active ? 'primary.main' : 'action.disabledBackground',
        color: completed || active ? 'primary.contrastText' : 'text.disabled',
        boxShadow: active ? (t) => `0 0 0 5px ${t.palette.primary.main}22` : 'none',
        transition: 'all 200ms ease',
      }}
    >
      {completed ? <CheckIcon sx={{ fontSize: 17 }} /> : <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'currentColor' }} />}
    </Box>
  );
}

/**
 * Horizontal (desktop) / vertical (mobile) shipment tracker.
 * @param {{timeline:Array<{stage,at,done,current}>}} props
 */
export default function OrderTracker({ timeline = [] }) {
  const activeStep = Math.max(0, timeline.findIndex((t) => t.current));
  const resolvedActive = timeline.every((t) => t.done) ? timeline.length : activeStep;

  return (
    <Box>
      {/* Desktop: horizontal */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Stepper activeStep={resolvedActive} alternativeLabel connector={<ProgressConnector />}>
          {timeline.map((entry) => (
            <Step key={entry.stage} completed={entry.done}>
              <StepLabel StepIconComponent={StepIconDot}>
                <Typography variant="body2" sx={{ fontWeight: entry.current ? 700 : 500 }}>
                  {entry.stage}
                </Typography>
                {entry.done && (
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(entry.at)}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Mobile: vertical */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Stepper activeStep={resolvedActive} orientation="vertical">
          {timeline.map((entry) => (
            <Step key={entry.stage} completed={entry.done}>
              <StepLabel StepIconComponent={StepIconDot}>
                <Typography variant="body2" sx={{ fontWeight: entry.current ? 700 : 500 }}>
                  {entry.stage}
                </Typography>
                {entry.done && (
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(entry.at)}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
}
