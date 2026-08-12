import React, { useEffect, useState } from 'react';
import type { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { fetchOrdersForUser } from '@/api/orders';
import { formatDate, formatEGP } from '@/lib/format';
import { StatusBadge } from '@/components/ui/Badge';

export default function OrderHistory() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!session) return;
    fetchOrdersForUser(session.userId).then(setOrders);
  }, [session]);

  if (orders === null) return <p className="text-navy-500">Loading…</p>;

  if (orders.length === 0) {
    return <p className="text-navy-500">You haven't placed any orders yet.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="card p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-mono text-sm text-navy-800">{order.id}</p>
              <p className="text-xs text-navy-500 mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <ul className="text-sm text-navy-600 space-y-1 mb-3">
            {order.lines.map((line) => (
              <li key={line.id}>
                {line.quantity}× {line.productName}
                {line.variantName ? ` — ${line.variantName}` : ''}
              </li>
            ))}
          </ul>
          <p className="font-mono text-sm text-navy-800">{formatEGP(order.total)}</p>
        </div>
      ))}
    </div>
  );
}
