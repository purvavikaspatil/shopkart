import { useState } from 'react';
import {
  Card, Box, Typography, Button, Stack, IconButton, Chip, Tabs, Tab, Avatar,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import { useNotifications } from '@/hooks';
import { timeAgo } from '@/utils/format';

/** Icon + colour per notification type. */
const TYPE = {
  order: { icon: <LocalShippingOutlinedIcon />, color: 'primary.main' },
  price: { icon: <TrendingDownIcon />, color: 'success.main' },
  deal: { icon: <LocalOfferOutlinedIcon />, color: 'warning.main' },
  wishlist: { icon: <FavoriteBorderIcon />, color: 'error.main' },
  account: { icon: <AccountCircleOutlinedIcon />, color: 'text.secondary' },
};

export default function NotificationsPage() {
  const { items, unreadCount, markRead, markAllRead, remove, clearAll } = useNotifications();
  const [tab, setTab] = useState('all');

  const visible = tab === 'unread' ? items.filter((n) => !n.read) : items;

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Notifications' }]} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h3">Notifications</Typography>
        <Stack direction="row" spacing={1}>
          {unreadCount > 0 && (
            <Button size="small" startIcon={<DoneAllIcon />} onClick={markAllRead}>Mark all read</Button>
          )}
          {items.length > 0 && (
            <Button size="small" color="inherit" onClick={clearAll}>Clear all</Button>
          )}
        </Stack>
      </Stack>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab value="all" label={`All (${items.length})`} />
        <Tab value="unread" label={`Unread (${unreadCount})`} />
      </Tabs>

      {visible.length === 0 ? (
        <EmptyState
          icon={<NotificationsNoneIcon />}
          title={tab === 'unread' ? 'You are all caught up' : 'No notifications'}
          description="Order updates, price drops and offers will appear here."
          primaryLabel="Go to shop"
          primaryTo="/shop"
        />
      ) : (
        <Stack spacing={1}>
          {visible.map((n) => {
            const meta = TYPE[n.type] ?? TYPE.account;
            return (
              <Card
                key={n.id}
                sx={{
                  p: 2, display: 'flex', gap: 2, alignItems: 'flex-start',
                  bgcolor: n.read ? 'background.paper' : 'action.hover',
                  borderLeft: 3, borderColor: n.read ? 'transparent' : 'primary.main',
                }}
              >
                <Avatar sx={{ bgcolor: 'transparent', color: meta.color, border: 1, borderColor: 'divider' }}>
                  {meta.icon}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2">{n.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{n.body}</Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">{timeAgo(n.createdAt)}</Typography>
                    {n.link && (
                      <Button component={RouterLink} to={n.link} size="small" onClick={() => markRead(n.id)}>
                        View
                      </Button>
                    )}
                    {!n.read && (
                      <Button size="small" color="inherit" onClick={() => markRead(n.id)}>Mark read</Button>
                    )}
                  </Stack>
                </Box>
                <IconButton size="small" onClick={() => remove(n.id)} aria-label="Dismiss notification">
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Card>
            );
          })}
        </Stack>
      )}
    </PageContainer>
  );
}
