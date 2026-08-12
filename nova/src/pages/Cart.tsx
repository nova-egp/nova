import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';

export default function Cart() {
  const { lines, setQuantity, removeLine, subtotal } = useCart();
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <div className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
        <p className="eyebrow mb-3">Cart</p>
        <h1 className="font-display text-2xl md:text-3xl text-navy-800 mb-6">Your cart is empty</h1>
        <Link to="/shop" className="btn-primary inline-flex">Shop T-Head</Link>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20">
      <p className="eyebrow mb-3">Cart</p>
      <h1 className="font-display text-3xl md:text-4xl text-navy-800 mb-10">
        {lines.reduce((n, l) => n + l.quantity, 0)} item{lines.length > 1 ? 's' : ''}
      </h1>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          {lines.map((line) => (
            <CartLineItem
              key={line.id}
              line={line}
              onQuantityChange={(q) => setQuantity(line.id, q)}
              onRemove={() => removeLine(line.id)}
            />
          ))}
        </div>
        <div>
          <CartSummary subtotal={subtotal} shipping={null}>
            <Button variant="primary" className="w-full" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          </CartSummary>
        </div>
      </div>
    </div>
  );
}
