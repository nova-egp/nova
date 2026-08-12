import React from 'react';
import type { ProductVariant } from '@/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedId?: string;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({ variants, selectedId, onSelect }: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div>
      <p className="label">
        Colour{selectedId ? ` — ${variants.find((v) => v.id === selectedId)?.name}` : ''}
      </p>
      <div className="flex gap-3">
        {variants.map((v) => {
          const isSelected = v.id === selectedId;
          const isOutOfStock = v.stock <= 0;
          return (
            <button
              key={v.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelect(v.id)}
              title={isOutOfStock ? `${v.name} — out of stock` : v.name}
              className={`relative w-11 h-11 rounded-full border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                isSelected ? 'border-gold' : 'border-transparent hover:border-navy-800/30'
              }`}
              style={{ boxShadow: isSelected ? '0 0 0 2px #F8F5EE, 0 0 0 3px #C6A15B' : undefined }}
            >
              <span
                className="absolute inset-1 rounded-full block"
                style={{ backgroundColor: v.swatch ?? '#999' }}
              />
              {isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-full h-px bg-navy-800/60 rotate-45" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
