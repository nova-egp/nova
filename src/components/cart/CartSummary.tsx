import React from 'react';
import { formatEGP } from '@/lib/format';

interface CartSummaryProps {
  subtotal: number;
  shipping: number | null; // null = not yet known (governorate not chosen)
  children?: React.ReactNode;
}

export function CartSummary({ subtotal, shipping, children }: CartSummaryProps) {
  const total = subtotal + (shipping ?? 0);
  return (
    <div className="card p-6">
      <h3 className="eyebrow mb-4">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-navy-600">
          <span>Subtotal</span>
          <span className="font-mono">{formatEGP(subtotal)}</span>
        </div>
        <div className="flex justify-between text-navy-600">
          <span>Shipping</span>
          <span className="font-mono">{shipping === null ? 'According to location' : formatEGP(shipping)}</span>
        </div>
      </div>
      <div className="rail my-4" />
      <div className="flex justify-between items-baseline">
        <span className="font-display text-lg text-navy-800">Total</span>
        <span className="font-mono text-lg text-navy-800">{formatEGP(total)}</span>
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
