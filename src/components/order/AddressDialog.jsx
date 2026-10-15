import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField,
  ToggleButton, ToggleButtonGroup, IconButton, Box, CircularProgress,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { INDIAN_STATES } from '@/data/mockContent';
import { validateName, validatePhone, validatePincode, validateRequired, runValidators } from '@/utils/validators';

/** Blank address used when adding rather than editing. */
const EMPTY = {
  label: 'Home', fullName: '', phone: '', pincode: '',
  line1: '', line2: '', city: '', state: '', isDefault: false,
};

/**
 * Modal form for creating or editing an address.
 * @param {{open:boolean, address?:object|null, onClose:Function, onSave:Function}} props
 */
export default function AddressDialog({ open, address, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Reset the form each time the dialog opens for a different address.
  useEffect(() => {
    if (open) {
      setForm(address ? { ...EMPTY, ...address } : EMPTY);
      setErrors({});
    }
  }, [open, address]);

  const setField = (field) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = runValidators({
      fullName: () => validateName(form.fullName),
      phone: () => validatePhone(form.phone),
      pincode: () => validatePincode(form.pincode),
      line1: () => validateRequired(form.line1, 'Address line 1'),
      city: () => validateRequired(form.city, 'City'),
      state: () => validateRequired(form.state, 'State'),
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        {address ? 'Edit address' : 'Add a new address'}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={form.label}
            onChange={(_, value) => value && setField('label')(value)}
          >
            <ToggleButton value="Home">Home</ToggleButton>
            <ToggleButton value="Work">Work</ToggleButton>
            <ToggleButton value="Other">Other</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Full name" value={form.fullName}
              onChange={setField('fullName')} error={!!errors.fullName} helperText={errors.fullName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Phone number" value={form.phone}
              onChange={setField('phone')} error={!!errors.phone} helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Address line 1 (house no, building, street)" value={form.line1}
              onChange={setField('line1')} error={!!errors.line1} helperText={errors.line1}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Address line 2 (area, landmark) — optional" value={form.line2}
              onChange={setField('line2')}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth label="Pincode" value={form.pincode}
              onChange={setField('pincode')} error={!!errors.pincode} helperText={errors.pincode}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <TextField
              fullWidth label="City" value={form.city}
              onChange={setField('city')} error={!!errors.city} helperText={errors.city}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select fullWidth label="State" value={form.state}
              onChange={setField('state')} error={!!errors.state} helperText={errors.state}
            >
              {INDIAN_STATES.map((state) => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          onClick={submit}
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={15} color="inherit" /> : null}
        >
          {address ? 'Save changes' : 'Add address'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
