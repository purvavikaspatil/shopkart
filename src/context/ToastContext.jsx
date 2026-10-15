import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { Snackbar, Alert, Slide, Button, Box } from '@mui/material';

const ToastContext = createContext(null);

function SlideUp(props) {
  return <Slide {...props} direction="up" />;
}

/**
 * Global snackbar. One toast at a time; a new one replaces the current one so
 * rapid "add to cart" taps do not build a queue the shopper has to sit through.
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [open, setOpen] = useState(false);
  const idRef = useRef(0);

  const show = useCallback((message, options = {}) => {
    idRef.current += 1;
    setToast({
      id: idRef.current,
      message,
      severity: options.severity ?? 'success',
      duration: options.duration ?? 3000,
      action: options.action ?? null,   // { label, onClick }
    });
    setOpen(true);
  }, []);

  const handleClose = useCallback((_event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  }, []);

  const api = useMemo(() => ({
    show,
    success: (message, options) => show(message, { ...options, severity: 'success' }),
    error: (message, options) => show(message, { ...options, severity: 'error' }),
    info: (message, options) => show(message, { ...options, severity: 'info' }),
    warning: (message, options) => show(message, { ...options, severity: 'warning' }),
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Snackbar
        key={toast?.id}
        open={open}
        autoHideDuration={toast?.duration}
        onClose={handleClose}
        TransitionComponent={SlideUp}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        // Lift above the mobile bottom navigation so it never covers it.
        sx={{ bottom: { xs: 76, md: 24 } }}
      >
        <Alert
          onClose={handleClose}
          severity={toast?.severity ?? 'success'}
          variant="filled"
          sx={{ width: '100%', maxWidth: 460, boxShadow: 6 }}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {toast?.action && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => { toast.action.onClick(); setOpen(false); }}
                  sx={{ fontWeight: 700 }}
                >
                  {toast.action.label}
                </Button>
              )}
            </Box>
          }
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

/** @returns {{show:Function, success:Function, error:Function, info:Function, warning:Function}} */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
