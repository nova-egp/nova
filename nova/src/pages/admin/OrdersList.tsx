import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Order, OrderStatus } from '@/types';
import { ORDER_STATUSES } from '@/types';
import { fetchAllOrders } from '@/api/orders';
import { formatEGP, formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  useEffect(() => {
    fetchAllOrders().then(setOrders);
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q);
      const matchesStatus = !statusFilter || o.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Orders</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by order ID, name, or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="!bg-navy-800 !border-cream-200/20 !text-cream-200 placeholder:!text-cream-300/40"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          className="!bg-navy-800 !border-cream-200/20 !text-cream-200 sm:w-52"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {orders === null ? (
        <p className="text-cream-300/50 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-cream-300/50 text-sm">No orders match.</p>
      ) : (
        <div className="bg-navy-800 divide-y divide-cream-200/10">
          <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3 text-xs text-cream-300/40 font-mono uppercase tracking-wide">
            <span>Order</span>
            <span>Customer</span>
            <span>Governorate</span>
            <span>Total</span>
            <span>Payment</span>
            <span>Status</span>
          </div>
          {filtered.map((o) => (
            <Link
              key={o.id}
              to={`/admin/orders/${o.id}`}
              className="grid grid-cols-2 md:grid-cols-6 gap-4 px-5 py-4 hover:bg-cream-200/5 transition-colors items-center"
            >
              <div>
                <p className="font-mono text-sm">{o.id}</p>
                <p className="text-xs text-cream-300/40 mt-0.5">{formatDateTime(o.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm">{o.customer.fullName}</p>
                <p className="text-xs text-cream-300/40 mt-0.5">{o.customer.phone}</p>
              </div>
              <span className="text-sm text-cream-300/70 hidden md:block">{o.customer.governorate}</span>
              <span className="font-mono text-sm">{formatEGP(o.total)}</span>
              <span className="text-sm text-cream-300/70 hidden md:block uppercase">{o.paymentMethod}</span>
              <StatusBadge status={o.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
