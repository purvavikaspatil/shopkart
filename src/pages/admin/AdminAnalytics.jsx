import { Box, Grid, Stack, Typography, Card } from '@mui/material';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,
} from 'recharts';

import StatCard from '@/components/common/StatCard';
import { revenueSeries, trafficSeries, categorySales, adminStats } from '@/data/editorial';
import { formatPrice, formatCompact, formatNumber } from '@/utils/format';

/** Shared chart panel. */
function Panel({ title, subtitle, children, height = 300 }) {
  return (
    <Card sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </Box>
      <Box sx={{ height, mx: -1 }}>{children}</Box>
    </Card>
  );
}

const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.12)' };

export default function AdminAnalytics() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Analytics</Typography>
        <Typography variant="body2" color="text.secondary">A deeper look at revenue, traffic and conversion.</Typography>
      </Box>

      {/* Headline metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <StatCard label="Conversion rate" value={`${adminStats.conversionRate}%`} delta={0.4} caption="vs last month" color="primary" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Refund rate" value={`${adminStats.refundRate}%`} delta={-0.3} caption="vs last month" color="success" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Avg. order value" value={formatPrice(adminStats.averageOrderValue)} delta={2.1} caption="vs last month" color="secondary" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Products live" value={formatNumber(adminStats.products)} caption="in the catalogue" color="warning" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Revenue vs orders (composed) */}
        <Grid item xs={12}>
          <Panel title="Revenue and orders" subtitle="Twelve-month trend, dual axis">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueSeries} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis yAxisId="left" tickFormatter={(v) => formatCompact(v)} tickLine={false} axisLine={false} fontSize={12} width={48} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} fontSize={12} width={40} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => (name === 'revenue' ? formatPrice(v) : formatNumber(v))} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#3D48D6" radius={[6, 6, 0, 0]} barSize={22} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#0E9F97" strokeWidth={2.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Panel>
        </Grid>

        {/* Traffic */}
        <Grid item xs={12} md={7}>
          <Panel title="Weekly traffic" subtitle="Visitors and conversions by day">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficSeries} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="visFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3D48D6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3D48D6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="convFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0E9F97" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0E9F97" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickFormatter={(v) => formatCompact(v)} tickLine={false} axisLine={false} fontSize={12} width={40} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatNumber(v)} />
                <Legend />
                <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#3D48D6" strokeWidth={2} fill="url(#visFill)" />
                <Area type="monotone" dataKey="conversions" name="Conversions" stroke="#0E9F97" strokeWidth={2} fill="url(#convFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </Grid>

        {/* Category revenue bars */}
        <Grid item xs={12} md={5}>
          <Panel title="Revenue by category" subtitle="This year to date">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySales} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => formatCompact(v)} tickLine={false} axisLine={false} fontSize={12} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={96} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatPrice(v)} />
                <Bar dataKey="value" name="Revenue" fill="#6D3DD6" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </Grid>
      </Grid>
    </Box>
  );
}
