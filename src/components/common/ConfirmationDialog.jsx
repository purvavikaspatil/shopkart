import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Box, CircularProgress,
} from '@mui/material';

/**
 * Confirmation before a destructive or irreversible action.
 * The confirm button repeats the verb from the trigger, so "Remove" leads to
 * a dialog whose button also says "Remove".
 */
export default function ConfirmationDialog({
  open, onClose, onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'error',
  loading = false,
  icon,
  children,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, pb: 1 }}>
        {icon && (
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 1.5, display: 'grid', placeItems: 'center',
              bgcolor: `${confirmColor}.main`, color: '#fff', '& svg': { fontSize: 20 },
            }}
          >
            {icon}
          </Box>
        )}
        {title}
      </DialogTitle>

      <DialogContent>
        {message && <DialogContentText sx={{ mb: children ? 2 : 0 }}>{message}</DialogContentText>}
        {children}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">{cancelLabel}</Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
