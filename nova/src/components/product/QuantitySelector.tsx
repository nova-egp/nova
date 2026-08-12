import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ quantity, onChange, min = 1, max = 20 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-navy-800/20">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="w-10 h-11 flex items-center justify-center text-navy-700 hover:bg-navy-800/5 disabled:opacity-30 transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 text-center font-mono text-sm text-navy-800" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="w-10 h-11 flex items-center justify-center text-navy-700 hover:bg-navy-800/5 disabled:opacity-30 transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
