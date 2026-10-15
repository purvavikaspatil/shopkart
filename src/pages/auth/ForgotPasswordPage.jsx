import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Stack, Alert, CircularProgress, Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

import { authService } from '@/services';
import { validateEmail } from '@/utils/validators';

/**
 * Requests a password-reset link. The mock always "succeeds" (without
 * revealing whether an account exists) and then points the user at the
 * reset screen so the flow can be demonstrated end to end.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const message = validateEmail(email);
    setError(message);
    if (message) return;

    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  // Confirmation state.
  if (sent) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'success.main', color: 'success.contrastText', display: 'grid', placeItems: 'center', mx: 'auto', mb: 2 }}>
          <MarkEmailReadOutlinedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h5" sx={{ mb: 1 }}>Check your inbox</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          If an account exists for <strong>{email}</strong>, we have sent a link to reset your password. The link expires in 30 minutes.
        </Typography>
        <Button
          component={RouterLink}
          to={`/reset-password?email=${encodeURIComponent(email)}`}
          variant="contained"
          fullWidth
          sx={{ mb: 1.5 }}
        >
          Continue to reset (demo)
        </Button>
        <Button component={RouterLink} to="/login" fullWidth color="inherit">
          Back to sign in
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={submit} noValidate>
      <Button component={RouterLink} to="/login" startIcon={<ArrowBackIcon />} size="small" color="inherit" sx={{ mb: 2 }}>
        Back to sign in
      </Button>

      <Typography variant="h4" sx={{ mb: 1 }}>Forgot your password?</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter the email tied to your account and we will send you a link to set a new one.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is a demo — no email is actually sent. You will be taken straight to the reset step.
      </Alert>

      <Stack spacing={2.5}>
        <TextField
          fullWidth
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          error={!!error}
          helperText={error}
          autoComplete="email"
          autoFocus
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
        Remembered it?{' '}
        <Link component={RouterLink} to="/login" fontWeight={600}>Sign in</Link>
      </Typography>
    </Box>
  );
}
