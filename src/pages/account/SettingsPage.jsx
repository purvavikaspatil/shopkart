import {
  Card, Box, Typography, Stack, Switch, FormControlLabel, Divider, MenuItem,
  TextField, Button, ToggleButtonGroup, ToggleButton, Grid,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useSettings, useColorMode, useToast } from '@/hooks';
import { CURRENCIES, LANGUAGES } from '@/utils/constants';

/** A single labelled toggle row. */
function ToggleRow({ label, caption, checked, onChange }) {
  return (
    <FormControlLabel
      sx={{ display: 'flex', justifyContent: 'space-between', ml: 0, py: 0.5 }}
      labelPlacement="start"
      control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      label={
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
          {caption && <Typography variant="caption" color="text.secondary">{caption}</Typography>}
        </Box>
      }
    />
  );
}

export default function SettingsPage() {
  const { settings, update, set, reset } = useSettings();
  const { preference, setMode } = useColorMode();
  const toast = useToast();

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Settings' }]} />
      <Typography variant="h3" sx={{ mb: 3 }}>Settings</Typography>

      <Grid container spacing={3}>
        {/* Appearance */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Appearance</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Theme</Typography>
            <ToggleButtonGroup
              exclusive
              value={preference}
              onChange={(_, value) => value && setMode(value)}
              fullWidth
            >
              <ToggleButton value="light"><LightModeIcon sx={{ mr: 1 }} fontSize="small" /> Light</ToggleButton>
              <ToggleButton value="dark"><DarkModeIcon sx={{ mr: 1 }} fontSize="small" /> Dark</ToggleButton>
              <ToggleButton value="system"><SettingsBrightnessIcon sx={{ mr: 1 }} fontSize="small" /> System</ToggleButton>
            </ToggleButtonGroup>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>Region</Typography>
            <Stack spacing={2}>
              <TextField select fullWidth label="Language" value={settings.language} onChange={(e) => set('language', e.target.value)}>
                {LANGUAGES.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </TextField>
              <TextField select fullWidth label="Currency" value={settings.currency} onChange={(e) => set('currency', e.target.value)}>
                {CURRENCIES.map((c) => <MenuItem key={c.code} value={c.code}>{c.code} — {c.label}</MenuItem>)}
              </TextField>
              <Typography variant="caption" color="text.secondary">
                Currency here is a display preference only; prices in this demo stay in rupees.
              </Typography>
            </Stack>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Notifications</Typography>
            <Stack divider={<Divider />}>
              <ToggleRow label="Email" caption="Receipts and important updates" checked={settings.notifications.email} onChange={(v) => update('notifications', 'email', v)} />
              <ToggleRow label="SMS" caption="Delivery alerts by text" checked={settings.notifications.sms} onChange={(v) => update('notifications', 'sms', v)} />
              <ToggleRow label="Push" caption="On this device" checked={settings.notifications.push} onChange={(v) => update('notifications', 'push', v)} />
              <ToggleRow label="Order updates" checked={settings.notifications.orderUpdates} onChange={(v) => update('notifications', 'orderUpdates', v)} />
              <ToggleRow label="Price drops" caption="On items in your wishlist" checked={settings.notifications.priceDrops} onChange={(v) => update('notifications', 'priceDrops', v)} />
              <ToggleRow label="Deals & offers" checked={settings.notifications.deals} onChange={(v) => update('notifications', 'deals', v)} />
            </Stack>
          </Card>
        </Grid>

        {/* Privacy */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Privacy</Typography>
            <Stack divider={<Divider />}>
              <ToggleRow label="Public profile" caption="Let others see your reviews" checked={settings.privacy.publicProfile} onChange={(v) => update('privacy', 'publicProfile', v)} />
              <ToggleRow label="Personalised recommendations" caption="Use your activity to suggest products" checked={settings.privacy.personalisedRecommendations} onChange={(v) => update('privacy', 'personalisedRecommendations', v)} />
              <ToggleRow label="Activity tracking" caption="Remember recently viewed items" checked={settings.privacy.activityTracking} onChange={(v) => update('privacy', 'activityTracking', v)} />
            </Stack>
          </Card>
        </Grid>

        {/* Reset */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Reset</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Put every preference on this page back to its default. This does not touch your orders or saved data.
            </Typography>
            <Button variant="outlined" color="inherit" onClick={() => { reset(); toast.success('Settings reset to defaults'); }}>
              Reset to defaults
            </Button>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
