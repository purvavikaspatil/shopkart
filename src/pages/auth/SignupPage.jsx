import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Stack, Grid, Divider, Alert,
  CircularProgress, FormControlLabel, Checkbox, Link,
} from '@mui/material';

import PasswordField from '@/components/common/PasswordField';
import { useAuth, useToast } from '@/hooks';
import {
  validateName, validateEmail, validatePhone, validatePassword, validateConfirmPassword,
} from '@/utils/validators';

export default function SignupPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { signup, loading } = useAuth();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '',
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const setField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = {
      firstName: validateName(form.firstName),
      lastName: validateName(form.lastName, 'Last name'),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      confirm: validateConfirmPassword(form.password, form.confirm),
    };
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(cleaned);
    setFormError('');
    if (Object.keys(cleaned).length) return;
    if (!agree) { setFormError('Please accept the terms to continue.'); return; }

    try {
      const user = await signup(form);
      toast.success(`Welcome to ShopNest, ${user.firstName}`);
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      setFormError(err.message ?? 'Could not create your account.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Create your account</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        It takes less than a minute, and your cart comes with you.
      </Typography>

      {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

      <Box component="form" onSubmit={submit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First name" value={form.firstName} onChange={setField('firstName')} error={!!errors.firstName} helperText={errors.firstName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Last name" value={form.lastName} onChange={setField('lastName')} error={!!errors.lastName} helperText={errors.lastName} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" type="email" value={form.email} onChange={setField('email')} error={!!errors.email} helperText={errors.email} autoComplete="email" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Phone" value={form.phone} onChange={setField('phone')} error={!!errors.phone} helperText={errors.phone} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PasswordField label="Password" value={form.password} onChange={setField('password')} error={errors.password} showStrength autoComplete="new-password" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PasswordField label="Confirm password" value={form.confirm} onChange={setField('confirm')} error={errors.confirm} autoComplete="new-password" />
          </Grid>
        </Grid>

        <FormControlLabel
          sx={{ mt: 1.5, alignItems: 'flex-start' }}
          control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} sx={{ pt: 0 }} />}
          label={
            <Typography variant="body2" color="text.secondary">
              I agree to the <Link component={RouterLink} to="/help">Terms of Use</Link> and{' '}
              <Link component={RouterLink} to="/help">Privacy Policy</Link>.
            </Typography>
          }
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ mt: 2 }}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }}>Already registered?</Divider>
      <Button component={RouterLink} to="/login" variant="outlined" fullWidth size="large">
        Sign in instead
      </Button>
    </Box>
  );
}
