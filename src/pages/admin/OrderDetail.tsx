import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Order, OrderStatus } from '@/types';
import { ORDER_STATUSES, CUSTOM_DEPOSIT_AMOUNT } from '@/types';
import {
  fetchOrderById,
  updateOrderStatus,
  updateOrderShipping,
  updateOrderDepositStatus,
} from '@/api/orders';
import { formatEGP, formatDateTime } from '@/lib/format';
import { buildOrderWhatsAppMessage, whatsappLink } from '@/lib/whatsapp';
import { StatusBadge, DepositBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { findGovernorate } from '@/data/governorates';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [shippingInput, setShippingInput] = useState('');
  const [shippingError, setShippingError] = useState('');
  const [savingShipping, setSavingShipping] = useState(false);
  const [savingDeposit, setSavingDeposit] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchOrderById(id).then((o) => setOrder(o ?? null));
  }, [id]);

  useEffect(() => {
    setShippingInput(order?.shipping != null ? String(order.shipping) : '');
  }, [order?.id, order?.shipping]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    await updateOrderStatus(order.id, status);
    setOrder({ ...order, status });
  }

  async function handleSaveShipping(e: React.FormEvent) {
    e.preventDefault();
    if (!order) return;
    const value = Number(shippingInput);
    if (!shippingInput.trim() || Number.isNaN(value) || value < 0) {
      setShippingError('Enter a valid shipping amount in EGP.');
      return;
    }
    setShippingError('');
    setSavingShipping(true);
    const updated = await updateOrderShipping(order.id, value);
    if (updated) setOrder(updated);
    setSavingShipping(false);
  }

  async function handleMarkDepositPaid() {
    if (!order) return;
    setSavingDeposit(true);
    const updated = await updateOrderDepositStatus(order.id, 'Paid');
    if (updated) setOrder(updated);
    setSavingDeposit(false);
  }

  // Message always reflects the order's latest saved state (subtotal,
  // shipping, deposit status) — never a fake/estimated total.
  const whatsappMessage = useMemo(() => (order ? buildOrderWhatsAppMessage(order) : ''), [order]);

  async function handleConfirmOrder() {
    if (!order) return;
    await updateOrderStatus(order.id, 'Confirmed');
    const updated = { ...order, status: 'Confirmed' as OrderStatus };
    setOrder(updated);
    window.open(whatsappLink(updated.customer.phone, buildOrderWhatsAppMessage(updated)), '_blank', 'noopener');
  }

  async function handleCancelOrder() {
    if (!order) return;
    await updateOrderStatus(order.id, 'Cancelled');
    const updated = { ...order, status: 'Cancelled' as OrderStatus };
    setOrder(updated);
    window.open(whatsappLink(updated.customer.phone, buildOrderWhatsAppMessage(updated)), '_blank', 'noopener');
  }

  if (order === undefined) return <p className="text-cream-300/50 text-sm">Loading…</p>;
  if (order === null) {
    return (
      <div>
        <p className="text-cream-300/50 text-sm mb-4">Order not found.</p>
        <Link to="/admin/orders" className="text-gold text-sm hover:text-gold-light">← Back to orders</Link>
      </div>
    );
  }

  const gov = findGovernorate(order.customer.governorate);

  return (
    <div>
      <Link to="/admin/orders" className="text-sm text-cream-300/50 hover:text-cream-200 mb-6 inline-block">
        ← Back to orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl mb-2">{order.id}</h1>
          <p className="text-sm text-cream-300/50">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <Select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className="!bg-navy-800 !border-cream-200/20 !text-cream-200 !py-2 w-40"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-navy-800 p-6">
            <h2 className="eyebrow text-cream-300/40 mb-4">Items</h2>
            <div className="divide-y divide-cream-200/10">
              {order.lines.map((line) => (
                <div key={line.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm">{line.quantity}× {line.productName}</p>
                      {line.variantName && (
                        <p className="text-xs text-cream-300/50 mt-1">Colour: {line.variantName}</p>
                      )}
                    </div>
                    <span className="font-mono text-sm shrink-0">{formatEGP(line.unitPrice * line.quantity)}</span>
                  </div>
                  {line.custom && (
                    <div className="mt-3 bg-navy-900 p-4">
                      <p className="text-xs uppercase tracking-wide text-gold mb-2">Custom order details</p>
                      <p className="text-sm text-cream-300/80 leading-relaxed mb-3">{line.custom.description}</p>
                      {line.custom.referenceImageDataUrl && (
                        <img
                          src={line.custom.referenceImageDataUrl}
                          alt={line.custom.referenceImageName ?? 'Reference'}
                          className="w-32 h-32 object-cover border border-cream-200/10"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="rail rail-light my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-cream-300/70">
                <span>Subtotal</span>
                <span className="font-mono">{formatEGP(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-cream-300/70">
                <span>Shipping</span>
                <span className="font-mono">
                  {order.shipping === null ? 'According to location' : formatEGP(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base pt-2">
                <span>Total</span>
                <span className="font-mono">{formatEGP(order.total)}</span>
              </div>
              {order.shipping === null && (
                <p className="text-xs text-cream-300/40 pt-1">
                  Order total shown is the product subtotal only, until shipping is confirmed below.
                </p>
              )}
            </div>
          </section>

          {order.isCustom && (
            <section className="bg-navy-800 p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="eyebrow text-cream-300/40">Custom order — deposit</h2>
                <DepositBadge status={order.depositStatus ?? 'Pending'} />
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-cream-300/70">
                  <dt>Custom product</dt>
                  <dd className="font-mono">{formatEGP(order.lines.filter((l) => l.custom).reduce((s, l) => s + l.unitPrice * l.quantity, 0))}</dd>
                </div>
                <div className="flex justify-between text-cream-300/70">
                  <dt>Deposit</dt>
                  <dd className="font-mono">{formatEGP(CUSTOM_DEPOSIT_AMOUNT)}</dd>
                </div>
                <div className="flex justify-between text-cream-300/70">
                  <dt>Deposit status</dt>
                  <dd>{order.depositStatus ?? 'Pending'}</dd>
                </div>
                <div className="flex justify-between text-cream-300/70">
                  <dt>Remaining product balance</dt>
                  <dd className="font-mono">
                    {formatEGP(Math.max(
                      order.lines.filter((l) => l.custom).reduce((s, l) => s + l.unitPrice * l.quantity, 0) - CUSTOM_DEPOSIT_AMOUNT,
                      0
                    ))}
                  </dd>
                </div>
                <div className="flex justify-between text-cream-300/70">
                  <dt>Shipping</dt>
                  <dd>According to location</dd>
                </div>
              </dl>
              {order.depositStatus === 'Paid' ? (
                <p className="text-xs text-green-400 mt-4">Deposit paid — ready for production.</p>
              ) : (
                <>
                  <p className="text-xs text-gold-dim mt-4 mb-3">
                    Not ready for production until the deposit is marked as paid.
                  </p>
                  <Button variant="gold" onClick={handleMarkDepositPaid} disabled={savingDeposit}>
                    {savingDeposit ? 'Saving…' : 'Mark deposit as Paid'}
                  </Button>
                </>
              )}
            </section>
          )}

          <section className="bg-navy-800 p-6">
            <h2 className="eyebrow text-cream-300/40 mb-1">Shipping cost</h2>
            <p className="text-xs text-cream-300/50 mb-4">
              Confirm the real shipping cost with the shipping company for this customer's
              governorate/area, then enter it here. This is never calculated automatically.
            </p>
            <form onSubmit={handleSaveShipping} className="flex flex-wrap items-end gap-3">
              <div className="w-40">
                <label className="block text-xs uppercase tracking-wide text-cream-300/40 mb-2">
                  Shipping (EGP)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 70"
                  value={shippingInput}
                  onChange={(e) => setShippingInput(e.target.value)}
                  error={shippingError}
                  className="!bg-navy-900 !border-cream-200/20 !text-cream-200"
                />
              </div>
              <Button type="submit" variant="gold" disabled={savingShipping}>
                {savingShipping ? 'Saving…' : order.shipping === null ? 'Confirm shipping' : 'Update shipping'}
              </Button>
            </form>
          </section>

          {order.notes && (
            <section className="bg-navy-800 p-6">
              <h2 className="eyebrow text-cream-300/40 mb-3">Order notes</h2>
              <p className="text-sm text-cream-300/80 leading-relaxed">{order.notes}</p>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="bg-navy-800 p-6">
            <h2 className="eyebrow text-cream-300/40 mb-4">Customer</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-cream-300/40 text-xs">Name</dt>
                <dd>{order.customer.fullName}</dd>
              </div>
              <div>
                <dt className="text-cream-300/40 text-xs">Phone</dt>
                <dd className="font-mono">{order.customer.phone}</dd>
              </div>
              <div>
                <dt className="text-cream-300/40 text-xs">Governorate</dt>
                <dd>{gov?.name ?? order.customer.governorate}</dd>
              </div>
              <div>
                <dt className="text-cream-300/40 text-xs">Address</dt>
                <dd>{order.customer.address}</dd>
              </div>
              <div>
                <dt className="text-cream-300/40 text-xs">Payment method</dt>
                <dd className="uppercase">{order.paymentMethod}</dd>
              </div>
            </dl>
          </section>

          <section className="bg-navy-800 p-6">
            <h2 className="eyebrow text-cream-300/40 mb-1">WhatsApp order confirmation</h2>
            <p className="text-xs text-cream-300/50 mb-4">
              Generated from this order's latest saved information. Shipping is only included
              once you've confirmed it above — otherwise it's shown as "According to location".
            </p>
            <pre className="whitespace-pre-wrap break-words text-xs bg-navy-900 p-4 text-cream-300/80 leading-relaxed mb-4 font-sans">
              {whatsappMessage}
            </pre>
            <div className="flex flex-col gap-2">
              <Button type="button" variant="gold" className="w-full" onClick={handleConfirmOrder}>
                Confirm Order
              </Button>
              <Button type="button" variant="secondary" className="w-full" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
              <a
                href={whatsappLink(order.customer.phone, whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full text-center"
              >
                Contact Customer / Other
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
