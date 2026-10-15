import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Stack, Divider, Alert, CircularProgress,
  Link,
} from '@mui/material';

import PasswordField from '@/components/common/PasswordField';
import { useAuth, useToast } from '@/hooks';
import { validateEmail, validateRequired } from '@/utils/validators';
import { DEMO_CREDENTIALS } from '@/utils/constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login, loading } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  // Where to return after a successful sign-in.
  const from = location.state?.from ?? '/';

  const submit = async (event) => {
    event.preventDefault();
    const next = {
      email: validateEmail(form.email),
      password: validateRequired(form.password, 'Password'),
    };
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(cleaned);
    setFormError('');
    if (Object.keys(cleaned).length) return;

    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.firstName}`);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message ?? 'Could not sign you in.');
    }
  };

  const fillDemo = () => {
    setForm({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
    setErrors({});
  };

  const fillAdmin = () => {
    setForm({ email: 'abhale.parth07@gmail.com', password: 'Parth@1234' });
    setErrors({});
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Welcome back</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sign in to track orders, save your wishlist and check out faster.
      </Typography>

      <Alert
        severity="info"
        sx={{ mb: 3 }}
        action={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={fillDemo}>Customer</Button>
            <Button size="small" variant="contained" onClick={fillAdmin}>Admin</Button>
          </Stack>
        }
      >
        Quick test accounts: <strong>Customer</strong> (demo@example.com) or <strong>Admin</strong> (abhale.parth07@gmail.com)
      </Alert>

      {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

      <Box component="form" onSubmit={submit}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
            error={!!errors.email}
            helperText={errors.email}
            autoComplete="email"
          />
          <Box>
            <PasswordField
              label="Password"
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
              error={errors.password}
              autoComplete="current-password"
            />
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2">Forgot password?</Link>
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }}>New here?</Divider>

      <Button component={RouterLink} to="/signup" variant="outlined" fullWidth size="large">
        Create an account
      </Button>
    </Box>
  );
}
