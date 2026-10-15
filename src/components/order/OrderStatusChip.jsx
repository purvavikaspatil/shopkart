import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import PendingIcon from '@mui/icons-material/Pending';
import { ORDER_STATUS } from '@/utils/constants';

/** Maps an order status to a colour and icon. */
const CONFIG = {
  [ORDER_STATUS.PLACED]: { color: 'info', icon: <PendingIcon sx={{ fontSize: 15 }} /> },
  [ORDER_STATUS.CONFIRMED]: { color: 'info', icon: <CheckCircleIcon sx={{ fontSize: 15 }} /> },
  [ORDER_STATUS.PACKED]: { color: 'warning', icon: <Inventory2Icon sx={{ fontSize: 15 }} /> },
  [ORDER_STATUS.SHIPPED]: { color: 'warning', icon: <LocalShippingIcon sx={{ fontSize: 15 }} /> },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: { color: 'primary', icon: <LocalShippingIcon sx={{ fontSize: 15 }} /> },
  [ORDER_STATUS.DELIVERED]: { color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 15 }} /> },
  [ORDER_STATUS.CANCELLED]: { color: 'error', icon: <CancelIcon sx={{ fontSize: 15 }} /> },
  [ORDER_STATUS.RETURNED]: { color: 'default', icon: <ReplayIcon sx={{ fontSize: 15 }} /> },
};

export default function OrderStatusChip({ status, size = 'small' }) {
  const config = CONFIG[status] ?? { color: 'default', icon: null };
  return (
    <Chip
      size={size}
      color={config.color}
      icon={config.icon}
      label={status}
      sx={{ fontWeight: 600 }}
    />
  );
}
