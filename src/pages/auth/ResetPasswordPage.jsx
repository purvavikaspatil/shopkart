import { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Button, Stack, Alert, CircularProgress, Link,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

import PasswordField from '@/components/common/PasswordField';
import { authService } from '@/services';
import { useToast } from '@/hooks';
import { validatePassword, validateConfirmPassword } from '@/utils/validators';

/**
 * Sets a new password for the account tied to the email in the query string.
 * (In a real app the query would carry a signed token, not an email.)
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const email = params.get('email') ?? '';

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = {
      password: validatePassword(form.password),
      confirm: validateConfirmPassword(form.password, form.confirm),
    };
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(cleaned);
    setFormError('');
    if (Object.keys(cleaned).length) return;

    setLoading(true);
    try {
      await authService.resetPassword({ email, password: form.password });
      toast.success('Password updated — you can sign in now.');
      navigate('/login', { replace: true });
    } catch (err) {
      setFormError(err.message ?? 'That reset link is no longer valid.');
    } finally {
      setLoading(false);
    }
  };

  // Guard: reaching this page without an email means a broken/expired link.
  if (!email) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 1 }}>This reset link is invalid</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The link is missing some information. Please request a new password reset.
        </Typography>
        <Button component={RouterLink} to="/forgot-password" variant="contained" fullWidth>
          Request a new link
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={submit} noValidate>
      <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', mb: 2 }}>
        <LockResetIcon sx={{ fontSize: 28 }} />
      </Box>

      <Typography variant="h4" sx={{ mb: 1 }}>Set a new password</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose a strong password for <strong>{email}</strong>. You will use it the next time you sign in.
      </Typography>

      {formError && <Alert severity="error" sx={{ mb: 3 }}>{formError}</Alert>}

      <Stack spacing={2.5}>
        <PasswordField
          label="New password"
          value={form.password}
          onChange={setField('password')}
          error={!!errors.password}
          helperText={errors.password}
          showStrength
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm new password"
          value={form.confirm}
          onChange={setField('confirm')}
          error={!!errors.confirm}
          helperText={errors.confirm}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
        <Link component={RouterLink} to="/login" fontWeight={600}>Back to sign in</Link>
      </Typography>
    </Box>
  );
}
