import { Card, Box, Typography, Stack, Chip, IconButton, Button, Radio } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

/**
 * Saved address, used both in the address book and (with `selectable`) in the
 * checkout address step.
 */
export default function AddressCard({
  address, selected = false, selectable = false, onSelect,
  onEdit, onDelete, onSetDefault,
}) {
  const Icon = address.label === 'Work' ? WorkOutlineIcon : HomeOutlinedIcon;

  return (
    <Card
      onClick={selectable ? () => onSelect?.(address) : undefined}
      sx={{
        p: 2,
        cursor: selectable ? 'pointer' : 'default',
        borderColor: selected ? 'primary.main' : 'divider',
        boxShadow: selected ? (t) => `0 0 0 1px ${t.palette.primary.main}` : undefined,
        transition: 'border-color 160ms ease',
        height: '100%',
      }}
    >
      <Stack direction="row" spacing={1.5}>
        {selectable && (
          <Radio checked={selected} size="small" sx={{ p: 0, mt: 0.25 }} tabIndex={-1} />
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="subtitle2">{address.fullName}</Typography>
            <Chip size="small" label={address.label} variant="outlined" />
            {address.isDefault && <Chip size="small" color="primary" label="Default" />}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {address.line1}{address.line2 ? `, ${address.line2}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {address.city}, {address.state} {address.pincode}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Phone: {address.phone}
          </Typography>

          {(onEdit || onDelete || onSetDefault) && (
            <Stack direction="row" spacing={0.5} sx={{ mt: 1.5 }} alignItems="center">
              {onEdit && (
                <Button size="small" startIcon={<EditOutlinedIcon fontSize="small" />} onClick={(e) => { e.stopPropagation(); onEdit(address); }}>
                  Edit
                </Button>
              )}
              {onSetDefault && !address.isDefault && (
                <Button size="small" onClick={(e) => { e.stopPropagation(); onSetDefault(address); }}>
                  Set default
                </Button>
              )}
              {onDelete && (
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(address); }} aria-label="Delete address">
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
