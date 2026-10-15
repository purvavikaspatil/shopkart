import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CheckIcon from '@mui/icons-material/Check';
import { SORT_OPTIONS } from '@/utils/constants';

/** Dropdown for the sort order. Current selection shows in the trigger label. */
export default function SortMenu({ value, onChange, size = 'small', fullWidth = false }) {
  const [anchor, setAnchor] = useState(null);
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  const select = (next) => {
    onChange(next);
    setAnchor(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        size={size}
        fullWidth={fullWidth}
        startIcon={<SwapVertIcon />}
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="listbox"
        aria-expanded={Boolean(anchor)}
        sx={{ color: 'text.primary', justifyContent: fullWidth ? 'flex-start' : 'center' }}
      >
        {current.label}
      </Button>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === value}
            onClick={() => select(option.value)}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {option.value === value && <CheckIcon fontSize="small" color="primary" />}
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.9rem' }}>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
