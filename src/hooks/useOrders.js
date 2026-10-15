import { useCallback } from 'react';
import { orderService } from '@/services';
import useAsync from './useAsync';

/**
 * Loads the shopper's orders and exposes the actions the orders pages need.
 * Every mutation refetches so the list, tabs and counts stay consistent.
 */
export function useOrders() {
  const { data, loading, error, refetch } = useAsync(() => orderService.getOrders(), []);

  const cancelOrder = useCallback(async (id, reason) => {
    const result = await orderService.cancelOrder(id, reason);
    await refetch();
    return result;
  }, [refetch]);

  const advanceOrder = useCallback(async (id) => {
    const result = await orderService.advanceOrder(id);
    await refetch();
    return result;
  }, [refetch]);

  const orders = data ?? [];

  return {
    orders,
    loading,
    error,
    refetch,
    cancelOrder,
    advanceOrder,
    // Convenience buckets for the tabbed orders page.
    active: orders.filter((o) => !['Delivered', 'Cancelled', 'Returned'].includes(o.status)),
    delivered: orders.filter((o) => o.status === 'Delivered'),
    cancelled: orders.filter((o) => o.status === 'Cancelled'),
    returned: orders.filter((o) => o.status === 'Returned'),
  };
}

export default useOrders;
