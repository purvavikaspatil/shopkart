import { useState } from 'react';
import { TextField, InputAdornment, IconButton, Box, LinearProgress, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { passwordStrength } from '@/utils/validators';

/**
 * Password input with a show/hide toggle and an optional strength meter.
 * The meter is announced politely so screen readers pick up changes.
 */
export default function PasswordField({
  label = 'Password', value, onChange, error, helperText,
  showStrength = false, autoComplete = 'current-password', ...rest
}) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? passwordStrength(value) : null;

  return (
    <Box>
      <TextField
        fullWidth
        type={visible ? 'text' : 'password'}
        label={label}
        value={value}
        onChange={onChange}
        error={Boolean(error)}
        helperText={error || helperText}
        autoComplete={autoComplete}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setVisible((v) => !v)}
                edge="end"
                size="small"
                aria-label={visible ? 'Hide password' : 'Show password'}
              >
                {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...rest}
      />

      {showStrength && value && (
        <Box sx={{ mt: 1 }} aria-live="polite">
          <LinearProgress
            variant="determinate"
            value={strength.percent}
            color={strength.color}
            sx={{ height: 5 }}
          />
          <Typography variant="caption" color={`${strength.color}.main`} sx={{ fontWeight: 600 }}>
            Password strength: {strength.label}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
