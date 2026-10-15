import { useState } from 'react';
import {
  Box, Grid, Stack, Typography, Card, TextField, Button, MenuItem,
  CircularProgress, Alert,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { userService } from '@/services';
import { useToast, useAuth } from '@/hooks';
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_HOURS } from '@/utils/constants';
import { validateName, validateEmail, validateRequired, runValidators } from '@/utils/validators';

const TOPICS = ['General enquiry', 'Order or delivery', 'Returns and refunds', 'Payments', 'Partnership', 'Something else'];

/** One contact channel row in the sidebar. */
function Channel({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ color: 'primary.main', '& svg': { fontSize: 22 } }}>{icon}</Box>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">{value}</Typography>
      </Box>
    </Stack>
  );
}

export default function ContactPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email ?? '',
    topic: TOPICS[0],
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const submit = async () => {
    const next = runValidators({
      name: () => validateName(form.name),
      email: () => validateEmail(form.email),
      message: () => validateRequired(form.message, 'Message'),
    });
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      const result = await userService.sendContactMessage(form);
      setSent(result.ticketId);
      setForm((prev) => ({ ...prev, message: '' }));
      toast.success('Message sent — we will be in touch soon.');
    } catch {
      toast.error('Could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Get in touch</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 620 }}>
          Have a question we have not answered? Send us a note and a real person will reply, usually within a few hours.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Form */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: { xs: 2.5, md: 4 } }}>
            {sent && (
              <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSent(null)}>
                Thanks — your reference is <strong>{sent}</strong>. We have emailed you a copy.
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Your name" value={form.name} onChange={setField('name')} error={!!errors.name} helperText={errors.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email address" value={form.email} onChange={setField('email')} error={!!errors.email} helperText={errors.email} />
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="What is this about?" value={form.topic} onChange={setField('topic')}>
                  {TOPICS.map((topic) => <MenuItem key={topic} value={topic}>{topic}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth multiline minRows={5} label="Message" value={form.message}
                  onChange={setField('message')} error={!!errors.message} helperText={errors.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained" size="large" onClick={submit} disabled={sending}
                  startIcon={sending ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {sending ? 'Sending…' : 'Send message'}
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Channels */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: { xs: 2.5, md: 4 }, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Other ways to reach us</Typography>
            <Stack spacing={3}>
              <Channel icon={<EmailOutlinedIcon />} label="Email" value={SUPPORT_EMAIL} />
              <Channel icon={<CallOutlinedIcon />} label="Phone (toll-free)" value={SUPPORT_PHONE} />
              <Channel icon={<ScheduleOutlinedIcon />} label="Support hours" value={SUPPORT_HOURS} />
              <Channel icon={<ChatBubbleOutlineIcon />} label="Help centre" value="Browse answers to common questions" />
            </Stack>
            <Box sx={{ mt: 4, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
              <Typography variant="body2" color="text.secondary">
                This is a demonstration store. Messages are simulated and no email is actually sent.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
