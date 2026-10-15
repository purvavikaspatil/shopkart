import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Stack, Badge } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';
import OrderCard from '@/components/order/OrderCard';
import { useOrders } from '@/hooks';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const { orders, active, delivered, cancelled, loading, error, refetch } = useOrders();
  const [tab, setTab] = useState('all');

  const buckets = { all: orders, active, delivered, cancelled };
  const visible = buckets[tab] ?? orders;

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Your orders' }]} />
      <Typography variant="h3" sx={{ mb: 3 }}>Your orders</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }} variant="scrollable" scrollButtons="auto">
        {TABS.map((t) => (
          <Tab key={t.key} value={t.key} label={`${t.label} (${(buckets[t.key] ?? []).length})`} />
        ))}
      </Tabs>

      {loading ? (
        <LoadingSkeleton variant="orderList" count={3} />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Inventory2OutlinedIcon />}
          title="No orders here yet"
          description="When you place an order it will show up here, where you can track it and manage returns."
          primaryLabel="Start shopping"
          primaryTo="/shop"
        />
      ) : (
        <Stack spacing={2}>
          {visible.map((order) => <OrderCard key={order.id} order={order} />)}
        </Stack>
      )}
    </PageContainer>
  );
}
