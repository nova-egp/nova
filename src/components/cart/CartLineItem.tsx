import React from 'react';
import { Link } from 'react-router-dom';
import type { CartLine } from '@/types';
import { formatEGP } from '@/lib/format';
import { QuantitySelector } from '@/components/product/QuantitySelector';

interface CartLineItemProps {
  line: CartLine;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartLineItem({ line, onQuantityChange, onRemove }: CartLineItemProps) {
  return (
    <div className="flex gap-4 py-6 border-b border-navy-800/10">
      <Link to={`/product/${line.productSlug}`} className="w-24 h-24 bg-cream-300 shrink-0 overflow-hidden">
        <img src={line.image} alt={line.productName} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${line.productSlug}`} className="font-display text-base text-navy-800 hover:text-gold-dim transition-colors">
              {line.productName}
            </Link>
            {line.variantName && (
              <p className="text-xs text-navy-500 mt-1">Colour: {line.variantName}</p>
            )}
            {line.custom && (
              <p className="text-xs text-navy-500 mt-1 line-clamp-2">Custom: {line.custom.description}</p>
            )}
          </div>
          <span className="font-mono text-sm text-navy-800 whitespace-nowrap">
            {formatEGP(line.unitPrice * line.quantity)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <QuantitySelector quantity={line.quantity} onChange={onQuantityChange} />
          <button
            onClick={onRemove}
            className="text-xs text-navy-500 hover:text-red-600 transition-colors font-mono uppercase tracking-wide"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
