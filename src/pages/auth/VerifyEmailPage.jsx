import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Button, Stack, Alert, CircularProgress, Link, TextField,
} from '@mui/material';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

import { authService } from '@/services';
import { useAuth, useToast } from '@/hooks';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

/**
 * Six-box OTP entry. Any 6-digit code verifies except 000000, which the mock
 * treats as expired so the error state can be shown.
 */
export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user, markVerified } = useAuth();

  // Email comes from the signup redirect, or the logged-in user, or a fallback.
  const email = location.state?.email ?? user?.email ?? 'your email';

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputs = useRef([]);

  // Resend cooldown timer.
  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const setDigit = (index, value) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    setError('');
    // Auto-advance to the next box.
    if (clean && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Support pasting the whole code at once.
  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setDigits(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const submit = async (event) => {
    event?.preventDefault();
    const code = digits.join('');
    if (code.length < OTP_LENGTH) { setError('Enter all six digits.'); return; }

    setLoading(true);
    try {
      await authService.verifyEmail({ email, code });
      markVerified();
      toast.success('Email verified — welcome to ShopNest!');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message ?? 'That code was not right. Try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    await authService.resendCode(email);
    setSecondsLeft(RESEND_SECONDS);
    toast.info('A fresh code is on its way.');
  };

  return (
    <Box component="form" onSubmit={submit} noValidate>
      <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', mb: 2 }}>
        <MarkEmailReadOutlinedIcon sx={{ fontSize: 28 }} />
      </Box>

      <Typography variant="h4" sx={{ mb: 1 }}>Verify your email</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        We sent a 6-digit code to <strong>{email}</strong>. Enter it below to confirm your address.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Demo tip: any six digits work, except <strong>000000</strong> which shows the expired-code error.
      </Alert>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* OTP boxes */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }} onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <TextField
            key={index}
            value={digit}
            onChange={(e) => setDigit(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            inputRef={(el) => { inputs.current[index] = el; }}
            inputProps={{
              inputMode: 'numeric',
              maxLength: 1,
              style: { textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, padding: '12px 0' },
              'aria-label': `Digit ${index + 1}`,
            }}
            sx={{ flex: 1 }}
            autoFocus={index === 0}
          />
        ))}
      </Stack>

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Verifying…' : 'Verify email'}
      </Button>

      <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">Did not get it?</Typography>
        {secondsLeft > 0 ? (
          <Typography variant="body2" color="text.secondary">Resend in {secondsLeft}s</Typography>
        ) : (
          <Link component="button" type="button" onClick={resend} fontWeight={600} variant="body2">
            Resend code
          </Link>
        )}
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        <Link component={RouterLink} to="/" fontWeight={600}>Skip for now</Link>
      </Typography>
    </Box>
  );
}
