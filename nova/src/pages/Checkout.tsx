import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { GOVERNORATES } from '@/data/governorates';
import { createOrder } from '@/api/orders';
import { processPayment } from '@/lib/payment';
import type { Order, PaymentMethod } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CartSummary } from '@/components/cart/CartSummary';
import { formatEGP } from '@/lib/format';

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; blurb: string }[] = [
  { id: 'cod', label: 'Cash on Delivery', blurb: 'Pay in cash when your order arrives.' },
  { id: 'card', label: 'Card', blurb: 'Pay online by card.' },
  { id: 'instapay', label: 'InstaPay', blurb: 'Send payment manually and confirm via WhatsApp.' },
];

export default function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const { session } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(session?.fullName ?? '');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');

  if (lines.length === 0 && !completedOrder) {
    return (
      <div className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
        <h1 className="font-display text-2xl text-navy-800 mb-6">Your cart is empty</h1>
        <Link to="/shop" className="btn-primary inline-flex">Shop T-Head</Link>
      </div>
    );
  }

  if (completedOrder) {
    return (
      <div className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
        <p className="eyebrow mb-3">Order placed</p>
        <h1 className="font-display text-3xl text-navy-800 mb-4">Thank you, {completedOrder.customer.fullName.split(' ')[0]}.</h1>
        <p className="text-navy-600 mb-2">Order <span className="font-mono">{completedOrder.id}</span></p>
        <p className="text-navy-600 mb-2 max-w-md mx-auto">{paymentMessage}</p>
        <p className="text-navy-500 text-sm mb-8 max-w-md mx-auto">
          Shipping cost depends on your area and will be confirmed with you separately.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/shop" className="btn-secondary">Continue shopping</Link>
          {session && <Link to="/account/orders" className="btn-primary">View order history</Link>}
        </div>
      </div>
    );
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Required.';
    if (!/^01[0-2,5]\d{8}$/.test(phone.trim())) next.phone = 'Enter a valid Egyptian phone number.';
    if (!governorate) next.governorate = 'Select a governorate.';
    if (!address.trim()) next.address = 'Required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (paymentMethod === 'card') {
      setErrors((prev) => ({ ...prev, payment: 'Card payment is not yet connected — choose Cash on Delivery or InstaPay.' }));
      return;
    }
    setSubmitting(true);
    try {
      const order = await createOrder({
        lines,
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          governorate,
          address: address.trim(),
          userId: session?.userId,
        },
        paymentMethod,
        notes: notes.trim() || undefined,
      });

      const result = await processPayment(paymentMethod, {
        orderId: order.id,
        amountEgp: order.total,
        customerPhone: order.customer.phone,
      });

      if (!result.success) {
        setPaymentMessage(result.message);
        setSubmitting(false);
        return;
      }

      setPaymentMessage(result.message);
      setCompletedOrder(order);
      clear();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20">
      <p className="eyebrow mb-3">Checkout</p>
      <h1 className="font-display text-3xl md:text-4xl text-navy-800 mb-10">
        {session ? 'Complete your order' : 'Guest checkout'}
      </h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-10">
          <div>
            <h2 className="font-display text-xl text-navy-800 mb-5">Delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
              <Input label="Phone number" placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
              <Select label="Governorate" value={governorate} onChange={(e) => setGovernorate(e.target.value)} error={errors.governorate}>
                <option value="">Select governorate</option>
                {GOVERNORATES.map((g) => (
                  <option key={g.code} value={g.code}>{g.name}</option>
                ))}
              </Select>
              <div className="sm:col-span-2">
                <Input label="Full address" value={address} onChange={(e) => setAddress(e.target.value)} error={errors.address} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Order notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
            {!session && (
              <p className="text-xs text-navy-500 mt-3">
                Checking out as guest.{' '}
                <Link to="/account/login" className="underline hover:text-navy-800">Sign in</Link> to track this order in your account.
              </p>
            )}
          </div>

          <div>
            <h2 className="font-display text-xl text-navy-800 mb-5">Payment method</h2>
            <div className="space-y-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === opt.id ? 'border-gold bg-gold/5' : 'border-navy-800/15 hover:border-navy-800/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-navy-800">{opt.label}</p>
                    <p className="text-xs text-navy-500 mt-0.5">{opt.blurb}</p>
                  </div>
                </label>
              ))}
            </div>
            {paymentMethod === 'card' && (
              <p className="text-xs text-gold-dim mt-3">
                Card payment isn't connected yet — you can complete this order with Cash on Delivery or InstaPay for now.
              </p>
            )}
            {errors.payment && <p className="text-xs text-red-600 mt-3">{errors.payment}</p>}
          </div>
        </div>

        <div>
          <CartSummary subtotal={subtotal} shipping={null}>
            <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
              {submitting ? 'Placing order…' : `Place Order — ${formatEGP(subtotal)}`}
            </Button>
          </CartSummary>
        </div>
      </form>
    </div>
  );
}
