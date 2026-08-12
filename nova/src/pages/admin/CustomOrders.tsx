import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '@/types';
import { fetchAllOrders } from '@/api/orders';
import { formatDateTime } from '@/lib/format';
import { StatusBadge, DepositBadge } from '@/components/ui/Badge';

export default function CustomOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    fetchAllOrders().then((all) => setOrders(all.filter((o) => o.isCustom)));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Custom Orders</h1>

      {orders === null ? (
        <p className="text-cream-300/50 text-sm">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-cream-300/50 text-sm">No custom orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const customLine = o.lines.find((l) => l.custom);
            return (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                className="block bg-navy-800 p-6 hover:bg-navy-700 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-mono text-sm">{o.id}</p>
                    <p className="text-xs text-cream-300/50 mt-1">
                      {o.customer.fullName} · {o.customer.phone} · {formatDateTime(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DepositBadge status={o.depositStatus ?? 'Pending'} />
                    <StatusBadge status={o.status} />
                  </div>
                </div>
                {customLine?.custom && (
                  <div className="flex gap-4 items-start">
                    {customLine.custom.referenceImageDataUrl && (
                      <img
                        src={customLine.custom.referenceImageDataUrl}
                        alt="Reference"
                        className="w-16 h-16 object-cover shrink-0 border border-cream-200/10"
                      />
                    )}
                    <p className="text-sm text-cream-300/80 leading-relaxed line-clamp-2">
                      {customLine.custom.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
