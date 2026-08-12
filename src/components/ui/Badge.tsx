import React from 'react';
import type { DepositStatus, OrderStatus } from '@/types';

const STATUS_CLASS: Record<OrderStatus, string> = {
  New: 'bg-navy-100 text-navy-700',
  Confirmed: 'bg-gold/15 text-gold-dim',
  Preparing: 'bg-gold/25 text-gold-dim',
  Shipped: 'bg-navy-700 text-cream-200',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide ${STATUS_CLASS[status]}`}
    >
      {status}
    </span>
  );
}

const DEPOSIT_CLASS: Record<DepositStatus, string> = {
  Pending: 'bg-red-100 text-red-700',
  Paid: 'bg-green-100 text-green-800',
};

export function DepositBadge({ status }: { status: DepositStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide ${DEPOSIT_CLASS[status]}`}
    >
      Deposit: {status}
    </span>
  );
}
