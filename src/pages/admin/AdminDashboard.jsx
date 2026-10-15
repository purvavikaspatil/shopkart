import { Box, Grid, Stack, Typography, Card, Chip, Avatar, Divider, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import StatCard from '@/components/common/StatCard';
import OrderStatusChip from '@/components/order/OrderStatusChip';
import { adminStats, revenueSeries, categorySales, topProducts, adminOrders } from '@/data/editorial';
import { formatPrice, formatCompact, formatNumber, formatDate } from '@/utils/format';

/** Palette used for the category pie, echoing the brand gradient. */
const PIE_COLORS = ['#3D48D6', '#0E9F97', '#6D3DD6', '#B4456F', '#E08A3C', '#3DA5D6', '#8A6A33'];

/** Shared card wrapper for chart panels. */
function ChartCard({ title, subtitle, action, children, height = 300 }) {
  return (
    <Card sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
        </Box>
        {action}
      </Stack>
      <Box sx={{ height, mx: -1 }}>{children}</Box>
    </Card>
  );
}

export default function AdminDashboard() {
  const recentOrders = adminOrders.slice(0, 6);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Overview</Typography>
          <Typography variant="body2" color="text.secondary">Last 12 months of store performance.</Typography>
        </Box>
      </Stack>

      {/* KPI row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Total revenue" value={formatPrice(adminStats.revenue)} delta={12.4} icon={<CurrencyRupeeIcon />} color="primary" caption="vs previous year" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Orders" value={formatNumber(adminStats.orders)} delta={8.1} icon={<ShoppingBagOutlinedIcon />} color="secondary" caption="vs previous year" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Customers" value={formatNumber(adminStats.customers)} delta={5.6} icon={<PeopleAltOutlinedIcon />} color="success" caption="active this year" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Avg. order value" value={formatPrice(adminStats.averageOrderValue)} delta={-1.2} icon={<TrendingUpIcon />} color="warning" caption="vs previous year" />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <ChartCard title="Revenue trend" subtitle="Monthly revenue across the store">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3D48D6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3D48D6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickFormatter={(v) => formatCompact(v)} tickLine={false} axisLine={false} fontSize={12} width={48} />
                <Tooltip formatter={(v) => formatPrice(v)} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3D48D6" strokeWidth={2.5} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard title="Sales by category" subtitle="Share of revenue">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} dataKey="share" nameKey="name" innerRadius={54} outerRadius={90} paddingAngle={2}>
                  {categorySales.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Recent orders + top products */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Recent orders</Typography>
              <Button component={RouterLink} to="/admin/orders" size="small" endIcon={<ArrowForwardIcon />}>View all</Button>
            </Stack>
            <Stack divider={<Divider />}>
              {recentOrders.map((order) => (
                <Stack key={order.id} direction="row" alignItems="center" spacing={2} sx={{ py: 1.25 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>{order.id}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>{order.customer} · {formatDate(order.date)}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>{formatPrice(order.total)}</Typography>
                  <OrderStatusChip status={order.status} />
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Top products</Typography>
            <Stack spacing={1.5}>
              {topProducts.slice(0, 5).map((product, i) => (
                <Stack key={product.id} direction="row" spacing={1.5} alignItems="center">
                  <Typography variant="body2" color="text.secondary" sx={{ width: 16 }}>{i + 1}</Typography>
                  <Avatar variant="rounded" src={product.thumbnail} sx={{ width: 40, height: 40 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{product.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatNumber(product.unitsSold)} sold</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCompact(product.revenue)}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
