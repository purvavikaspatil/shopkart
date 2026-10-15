import { useState, useMemo, useEffect } from 'react';
import {
  Box, Stack, Typography, Card, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Avatar, Chip, TextField, InputAdornment, MenuItem, TablePagination,
  Button, Tooltip, IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import { inventoryRows } from '@/data/editorial';
import { categoryNames } from '@/data/categories';
import { formatPrice } from '@/utils/format';
import { useToast } from '@/hooks';
import { productService } from '@/services';

/** Maps a stock status to a chip colour. */
const STATUS_COLOR = { 'In stock': 'success', 'Low stock': 'warning', 'Out of stock': 'error' };

export default function AdminProducts() {
  const toast = useToast();
  const [productsList, setProductsList] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    productService.getAllProducts().then((data) => {
      if (data && data.length) {
        setProductsList(data.map((p) => ({
          sku: `SKU-${(p.id || p._id || '').toString().slice(-6).toUpperCase()}`,
          title: p.title,
          category: p.category,
          price: p.price,
          stock: p.stock ?? 12,
          status: (p.stock ?? 12) > 10 ? 'In stock' : (p.stock ?? 12) > 0 ? 'Low stock' : 'Out of stock',
          thumbnail: p.thumbnail,
        })));
      }
    }).catch(() => {});
  }, []);

  const activeRows = productsList.length ? productsList : inventoryRows;

  // Apply the three filters together.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeRows.filter((row) => {
      if (q && !row.title.toLowerCase().includes(q) && !row.sku.toLowerCase().includes(q)) return false;
      if (category !== 'All' && row.category !== category) return false;
      if (status !== 'All' && row.status !== status) return false;
      return true;
    });
  }, [activeRows, search, category, status]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const resetPage = (setter) => (value) => { setter(value); setPage(0); };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Products</Typography>
          <Typography variant="body2" color="text.secondary">{activeRows.length} products in the catalogue.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={() => toast.info('Export is not available in this demo.')}>
            Export
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => toast.info('Adding products is disabled in this demo.')}>
            Add product
          </Button>
        </Stack>
      </Stack>

      <Card>
        {/* Filter toolbar */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder="Search by name or SKU"
            value={search}
            onChange={(e) => resetPage(setSearch)(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ flex: 1 }}
          />
          <TextField size="small" select label="Category" value={category} onChange={(e) => resetPage(setCategory)(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="All">All categories</MenuItem>
            {categoryNames.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField size="small" select label="Status" value={status} onChange={(e) => resetPage(setStatus)(e.target.value)} sx={{ minWidth: 150 }}>
            {['All', 'In stock', 'Low stock', 'Out of stock'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar variant="rounded" src={row.thumbnail} sx={{ width: 40, height: 40 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 240 }} noWrap>{row.title}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }} color="text.secondary">{row.sku}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{row.category}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2">{formatPrice(row.price)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2">{row.stock}</Typography></TableCell>
                  <TableCell><Chip size="small" label={row.status} color={STATUS_COLOR[row.status]} variant="outlined" /></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit product">
                      <IconButton size="small" onClick={() => toast.info('Editing is disabled in this demo.')}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No products match those filters.</Typography>
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
