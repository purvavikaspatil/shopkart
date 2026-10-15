import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Card, Box, Typography, Button, Stack, TextField, MenuItem, Divider,
  Avatar, CircularProgress,
} from '@mui/material';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import PasswordField from '@/components/common/PasswordField';
import { useAuth, useToast } from '@/hooks';
import { authService } from '@/services';
import { initials } from '@/utils/format';
import { validateName, validatePhone, validateEmail, validatePassword } from '@/utils/validators';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    gender: user?.gender ?? 'Prefer not to say',
    dob: user?.dob ?? '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [pwdErrors, setPwdErrors] = useState({});
  const [changingPwd, setChangingPwd] = useState(false);

  const setField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const saveProfile = async () => {
    const next = {
      firstName: validateName(form.firstName),
      lastName: validateName(form.lastName, 'Last name'),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
    };
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(cleaned);
    if (Object.keys(cleaned).length) return;

    setSaving(true);
    try {
      await updateUser(form);
      toast.success('Profile updated');
      navigate('/profile');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    const next = {
      current: pwd.current ? '' : 'Enter your current password',
      next: validatePassword(pwd.next),
      confirm: pwd.next === pwd.confirm ? '' : 'Passwords do not match',
    };
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setPwdErrors(cleaned);
    if (Object.keys(cleaned).length) return;

    setChangingPwd(true);
    try {
      await authService.changePassword(user.id, { current: pwd.current, next: pwd.next });
      toast.success('Password changed');
      setPwd({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Your account', to: '/profile' }, { label: 'Edit' }]} />
      <Typography variant="h3" sx={{ mb: 3 }}>Edit profile</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar src={user?.avatar} sx={{ width: 64, height: 64 }}>
                {initials(`${form.firstName} ${form.lastName}`)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">Profile photo</Typography>
                <Typography variant="caption" color="text.secondary">Photo upload is disabled in this demo.</Typography>
              </Box>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First name" value={form.firstName} onChange={setField('firstName')} error={!!errors.firstName} helperText={errors.firstName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last name" value={form.lastName} onChange={setField('lastName')} error={!!errors.lastName} helperText={errors.lastName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" value={form.email} onChange={setField('email')} error={!!errors.email} helperText={errors.email} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" value={form.phone} onChange={setField('phone')} error={!!errors.phone} helperText={errors.phone} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Gender" value={form.gender} onChange={setField('gender')}>
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Date of birth" InputLabelProps={{ shrink: true }} value={form.dob} onChange={setField('dob')} />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button variant="contained" onClick={saveProfile} disabled={saving} startIcon={saving ? <CircularProgress size={15} color="inherit" /> : null}>
                Save changes
              </Button>
              <Button color="inherit" onClick={() => navigate('/profile')}>Cancel</Button>
            </Stack>
          </Card>
        </Grid>

        {/* Password */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Change password</Typography>
            <Stack spacing={2}>
              <PasswordField label="Current password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} error={pwdErrors.current} />
              <PasswordField label="New password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} error={pwdErrors.next} showStrength />
              <PasswordField label="Confirm new password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} error={pwdErrors.confirm} />
              <Button variant="outlined" onClick={changePassword} disabled={changingPwd}>
                {changingPwd ? 'Updating…' : 'Update password'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
