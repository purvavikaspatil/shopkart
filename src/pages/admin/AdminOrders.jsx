import { useState, useMemo } from 'react';
import {
  Box, Stack, Typography, Card, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TextField, InputAdornment, Tabs, Tab, TablePagination, Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import OrderStatusChip from '@/components/order/OrderStatusChip';
import { adminOrders } from '@/data/editorial';
import { formatPrice, formatDate } from '@/utils/format';

const TABS = ['All', 'Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

export default function AdminOrders() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return adminOrders.filter((order) => {
      if (tab !== 'All' && order.status !== tab) return false;
      if (q && !order.id.toLowerCase().includes(q) && !order.customer.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tab, search]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Counts per status for the tab badges.
  const counts = useMemo(() => {
    const map = { All: adminOrders.length };
    adminOrders.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1; });
    return map;
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Orders</Typography>
        <Typography variant="body2" color="text.secondary">{adminOrders.length} orders across all statuses.</Typography>
      </Box>

      <Card>
        <Tabs
          value={tab}
          onChange={(_, next) => { setTab(next); setPage(0); }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          {TABS.map((label) => (
            <Tab
              key={label}
              value={label}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{label}</span>
                  {counts[label] > 0 && <Chip label={counts[label]} size="small" sx={{ height: 20 }} />}
                </Stack>
              }
            />
          ))}
        </Tabs>

        <Box sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder="Search by order ID or customer"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ width: { xs: '100%', sm: 340 } }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="center">Items</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.id}</Typography></TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.customer}</Typography>
                    <Typography variant="caption" color="text.secondary">{order.email}</Typography>
                  </TableCell>
                  <TableCell><Typography variant="body2">{formatDate(order.date)}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>{order.product}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="body2">{order.items}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{formatPrice(order.total)}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{order.payment}</Typography></TableCell>
                  <TableCell><OrderStatusChip status={order.status} /></TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No orders match those filters.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>
    </Box>
  );
}
