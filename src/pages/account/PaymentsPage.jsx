import { useState, useEffect } from 'react';
import {
  Grid, Card, Box, Typography, Button, Stack, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Alert, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { userService } from '@/services';
import { useToast } from '@/hooks';
import { validateCardNumber, validateExpiry } from '@/utils/validators';

/** Brand gradient for the card face. */
const BRAND_BG = {
  Visa: 'linear-gradient(135deg, #1a1f71, #3D48D6)',
  Mastercard: 'linear-gradient(135deg, #cc2b2b, #f79e1b)',
  RuPay: 'linear-gradient(135deg, #0e7c3a, #0E9F97)',
};

export default function PaymentsPage() {
  const toast = useToast();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [removing, setRemoving] = useState(false);

  const [form, setForm] = useState({ number: '', holder: '', expiry: '' });
  const [errors, setErrors] = useState({});
  const [adding, setAdding] = useState(false);

  const load = () => {
    setLoading(true);
    userService.getCards().then(setCards).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const addCard = async () => {
    const next = {
      number: validateCardNumber(form.number),
      holder: form.holder.trim() ? '' : 'Enter the name on the card',
      expiry: validateExpiry(form.expiry),
    };
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(cleaned);
    if (Object.keys(cleaned).length) return;

    setAdding(true);
    try {
      const updated = await userService.addCard(form);
      setCards(updated);
      toast.success('Card saved (only the last four digits are stored)');
      setDialogOpen(false);
      setForm({ number: '', holder: '', expiry: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  const confirmDelete = async () => {
    setRemoving(true);
    try {
      const next = await userService.removeCard(deleting.id);
      setCards(next);
      toast.success('Card removed');
      setDeleting(null);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Your account', to: '/profile' }, { label: 'Payment methods' }]} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h3">Payment methods</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>Add card</Button>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is a demo. No real card details are stored — only a masked last-four for display.
      </Alert>

      {loading ? (
        <LoadingSkeleton variant="profile" />
      ) : cards.length === 0 ? (
        <EmptyState
          icon={<CreditCardIcon />}
          title="No saved cards"
          description="Save a card to check out faster next time. We only ever keep the last four digits."
          primaryLabel="Add a card"
          onPrimary={() => setDialogOpen(true)}
        />
      ) : (
        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Box
                sx={{
                  position: 'relative', borderRadius: 3, p: 2.5, minHeight: 170,
                  color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  background: BRAND_BG[card.brand] ?? BRAND_BG.RuPay,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <CreditCardIcon />
                  <Stack direction="row" spacing={1} alignItems="center">
                    {card.isDefault && <Chip size="small" label="Default" sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff' }} />}
                    <IconButton size="small" onClick={() => setDeleting(card)} aria-label="Remove card" sx={{ color: '#fff' }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
                <Box>
                  <Typography variant="h6" sx={{ letterSpacing: 2, color: '#fff' }}>•••• •••• •••• {card.last4}</Typography>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Card holder</Typography>
                      <Typography variant="body2">{card.holder}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Expires</Typography>
                      <Typography variant="body2">{card.expiry}</Typography>
                    </Box>
                  </Stack>
                </Box>
                <Typography variant="caption" sx={{ position: 'absolute', top: 10, right: 12, opacity: 0.9, fontWeight: 700 }}>{card.brand}</Typography>
              </Box>
              {!card.isDefault && (
                <Button size="small" sx={{ mt: 1 }} onClick={async () => { setCards(await userService.setDefaultCard(card.id)); toast.success('Default card updated'); }}>
                  Set as default
                </Button>
              )}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add-card dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add a card</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField fullWidth label="Card number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} error={!!errors.number} helperText={errors.number} inputProps={{ maxLength: 19 }} />
            <TextField fullWidth label="Name on card" value={form.holder} onChange={(e) => setForm({ ...form, holder: e.target.value })} error={!!errors.holder} helperText={errors.holder} />
            <TextField fullWidth label="Expiry (MM/YY)" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} error={!!errors.expiry} helperText={errors.expiry} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addCard} disabled={adding} startIcon={adding ? <CircularProgress size={15} color="inherit" /> : null}>
            Save card
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={removing}
        title="Remove this card?"
        message="You can add it again whenever you like."
        confirmLabel="Remove"
      />
    </PageContainer>
  );
}
