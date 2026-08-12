import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '@/types';
import { fetchAllOrders } from '@/api/orders';
import { formatEGP, formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/ui/Badge';

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    fetchAllOrders().then(setOrders);
  }, []);

  if (orders === null) return <p className="text-cream-300/60">Loading…</p>;

  const newCount = orders.filter((o) => o.status === 'New').length;
  const customCount = orders.filter((o) => o.isCustom).length;
  const revenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const recent = orders.slice(0, 6);

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Metric label="Total orders" value={String(orders.length)} />
        <Metric label="New orders" value={String(newCount)} accent />
        <Metric label="Custom orders" value={String(customCount)} />
        <Metric label="Revenue" value={formatEGP(revenue)} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg">Recent orders</h2>
        <Link to="/admin/orders" className="text-sm text-gold hover:text-gold-light">View all →</Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-cream-300/50 text-sm">No orders yet.</p>
      ) : (
        <div className="bg-navy-800 divide-y divide-cream-200/10">
          {recent.map((o) => (
            <Link
              key={o.id}
              to={`/admin/orders/${o.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-cream-200/5 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm">{o.id}</p>
                <p className="text-xs text-cream-300/50 mt-0.5">
                  {o.customer.fullName} · {formatDateTime(o.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-mono text-sm">{formatEGP(o.total)}</span>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-navy-800 p-5">
      <p className="eyebrow text-cream-300/40 mb-2">{label}</p>
      <p className={`font-display text-2xl ${accent ? 'text-gold' : ''}`}>{value}</p>
    </div>
  );
}
