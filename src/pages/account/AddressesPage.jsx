import { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import AddressCard from '@/components/order/AddressCard';
import AddressDialog from '@/components/order/AddressDialog';
import { userService } from '@/services';
import { useToast } from '@/hooks';

export default function AddressesPage() {
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [removing, setRemoving] = useState(false);

  const load = () => {
    setLoading(true);
    userService.getAddresses()
      .then(setAddresses)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async (form) => {
    const next = editing
      ? await userService.updateAddress(editing.id, form)
      : await userService.addAddress(form);
    setAddresses(next);
    toast.success(editing ? 'Address updated' : 'Address added');
    setEditing(null);
  };

  const confirmDelete = async () => {
    setRemoving(true);
    try {
      const next = await userService.deleteAddress(deleting.id);
      setAddresses(next);
      toast.success('Address removed');
      setDeleting(null);
    } finally {
      setRemoving(false);
    }
  };

  const setDefault = async (address) => {
    const next = await userService.setDefaultAddress(address.id);
    setAddresses(next);
    toast.success('Default address updated');
  };

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Your account', to: '/profile' }, { label: 'Addresses' }]} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h3">Saved addresses</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setDialogOpen(true); }}>
          Add address
        </Button>
      </Stack>

      {loading ? (
        <LoadingSkeleton variant="profile" />
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={<LocationOnOutlinedIcon />}
          title="No saved addresses"
          description="Add an address once and reuse it every time you check out."
          primaryLabel="Add your first address"
          onPrimary={() => { setEditing(null); setDialogOpen(true); }}
        />
      ) : (
        <Grid container spacing={2}>
          {addresses.map((address) => (
            <Grid item xs={12} sm={6} key={address.id}>
              <AddressCard
                address={address}
                onEdit={(a) => { setEditing(a); setDialogOpen(true); }}
                onDelete={(a) => setDeleting(a)}
                onSetDefault={setDefault}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AddressDialog
        open={dialogOpen}
        address={editing}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSave={save}
      />

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={removing}
        title="Remove this address?"
        message="You can always add it again later."
        confirmLabel="Remove"
      />
    </PageContainer>
  );
}
