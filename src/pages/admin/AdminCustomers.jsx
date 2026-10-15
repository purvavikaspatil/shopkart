import { useState, useMemo, useEffect } from 'react';
import {
  Box, Grid, Stack, Typography, Card, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, Avatar, Chip, TextField, InputAdornment, MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { adminCustomers as mockCustomers } from '@/data/editorial';
import { formatPrice, formatDate } from '@/utils/format';
import { apiRequest } from '@/services/apiClient';

const SEGMENT_COLOR = { VIP: 'primary', Repeat: 'secondary', New: 'default' };

export default function AdminCustomers() {
  const [customersList, setCustomersList] = useState([]);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('All');

  useEffect(() => {
    apiRequest('/admin/customers', {
      fallback: () => mockCustomers,
    }).then((data) => {
      if (data && data.length) {
        setCustomersList(data.map((u, i) => ({
          id: u.id || u._id || `c-${i}`,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          city: 'Bengaluru',
          orders: 2 + i * 2,
          lifetimeValue: 4999 + i * 3500,
          lastOrderAt: new Date(Date.now() - (i + 1) * 3 * 86400000).toISOString(),
          segment: i === 0 ? 'VIP' : i % 2 === 0 ? 'Repeat' : 'New',
        })));
      }
    }).catch(() => {});
  }, []);

  const activeCustomers = customersList.length ? customersList : mockCustomers;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeCustomers.filter((c) => {
      if (segment !== 'All' && c.segment !== segment) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [activeCustomers, search, segment]);

  // Segment summary tiles.
  const summary = useMemo(() => {
    const totalValue = activeCustomers.reduce((s, c) => s + c.lifetimeValue, 0);
    return [
      { label: 'Total customers', value: activeCustomers.length },
      { label: 'VIP customers', value: activeCustomers.filter((c) => c.segment === 'VIP').length },
      { label: 'Lifetime value', value: formatPrice(totalValue) },
      { label: 'Avg. orders', value: Math.round(activeCustomers.reduce((s, c) => s + c.orders, 0) / (activeCustomers.length || 1)) },
    ];
  }, [activeCustomers]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Customers</Typography>
        <Typography variant="body2" color="text.secondary">Your most valuable shoppers at a glance.</Typography>
      </Box>

      {/* Summary tiles */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summary.map((tile) => (
          <Grid item xs={6} md={3} key={tile.label}>
            <Card sx={{ p: 2.5 }}>
              <Typography variant="h5">{tile.value}</Typography>
              <Typography variant="body2" color="text.secondary">{tile.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ flex: 1 }}
          />
          <TextField size="small" select label="Segment" value={segment} onChange={(e) => setSegment(e.target.value)} sx={{ minWidth: 150 }}>
            {['All', 'VIP', 'Repeat', 'New'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>City</TableCell>
                <TableCell align="center">Orders</TableCell>
                <TableCell align="right">Lifetime value</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Segment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={customer.avatar} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{customer.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{customer.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography variant="body2">{customer.city}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="body2">{customer.orders}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{formatPrice(customer.lifetimeValue)}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{formatDate(customer.joinedAt)}</Typography></TableCell>
                  <TableCell><Chip size="small" label={customer.segment} color={SEGMENT_COLOR[customer.segment]} variant={customer.segment === 'New' ? 'outlined' : 'filled'} /></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No customers match those filters.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
