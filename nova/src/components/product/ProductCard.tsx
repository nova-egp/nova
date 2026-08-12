import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { formatEGP } from '@/lib/format';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="aspect-[4/5] bg-cream-300 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-navy-800">{product.shortName}</h3>
          {product.variants.length > 0 && (
            <p className="text-xs text-navy-500 mt-1">
              {product.variants.map((v) => v.name).join(' · ')}
            </p>
          )}
        </div>
        <span className="font-mono text-sm text-navy-700 whitespace-nowrap pt-1">
          {formatEGP(product.price)}
        </span>
      </div>
    </Link>
  );
}
