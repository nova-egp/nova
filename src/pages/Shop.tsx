import React, { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { fetchShopProducts } from '@/api/products';
import { ProductCard } from '@/components/product/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetchShopProducts().then(setProducts);
  }, []);

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20">
      <div className="mb-12">
        <p className="eyebrow mb-3">Shop</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy-800">NOVA T-Head</h1>
      </div>

      {products === null ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-cream-300" />
              <div className="h-4 bg-cream-300 mt-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
