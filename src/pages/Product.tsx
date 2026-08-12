import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { Product } from '@/types';
import { fetchProductBySlug } from '@/api/products';
import { formatEGP, processingLabel } from '@/lib/format';
import { VariantSelector } from '@/components/product/VariantSelector';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { ProductViewer3D } from '@/components/product/ProductViewer3D';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

const VIEWER_COLOR: Record<string, string> = {
  clear: '#eef0ee',
  'gold-leaf': '#e9dcb0',
  glitter: '#8c2036', // overridden per-variant below
};

const VARIANT_VIEWER_COLOR: Record<string, string> = {
  var_red: '#7A1128',
  var_pink: '#C86C93',
  var_black: '#1B1B22',
};

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addLine } = useCart();

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [showViewer, setShowViewer] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchProductBySlug(slug).then((p) => {
      setProduct(p ?? null);
      if (p && p.variants.length > 0) setVariantId(p.variants[0].id);
    });
  }, [slug]);

  const selectedVariant = useMemo(
    () => product?.variants.find((v) => v.id === variantId),
    [product, variantId]
  );

  // Each variant carries its own front/angle photography — falls back to
  // the product's own images for products with no variants (Clear, Gold Leaf).
  const displayImages = selectedVariant?.images ?? product?.images ?? [];

  // Switching colour should always jump back to that colour's first photo,
  // never leave a stale image from the previous variant on screen.
  useEffect(() => {
    setActiveImage(0);
  }, [variantId]);

  if (product === undefined) {
    return <div className="max-w-content mx-auto px-5 md:px-8 py-24 text-navy-500">Loading…</div>;
  }
  if (product === null) {
    return (
      <div className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
        <h1 className="font-display text-2xl text-navy-800 mb-4">Product not found</h1>
        <Link to="/shop" className="text-gold-dim underline">Back to shop</Link>
      </div>
    );
  }

  const outOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const viewerColor = selectedVariant
    ? VARIANT_VIEWER_COLOR[selectedVariant.id] ?? VIEWER_COLOR[product.type]
    : VIEWER_COLOR[product.type];
  const viewerOpacity = product.type === 'clear' ? 0.15 : product.type === 'gold-leaf' ? 0.3 : 0.8;

  function buildLine() {
    return {
      id: `${product!.id}${selectedVariant ? `:${selectedVariant.id}` : ''}`,
      productId: product!.id,
      productName: product!.name,
      productSlug: product!.slug,
      image: displayImages[0] ?? product!.images[0],
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      unitPrice: product!.price,
      quantity,
    };
  }

  function handleAddToCart() {
    addLine(buildLine());
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleBuyNow() {
    addLine(buildLine());
    navigate('/cart');
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Media column */}
        <div>
          {showViewer && product.stlUrl ? (
            <ProductViewer3D stlUrl={product.stlUrl} color={viewerColor} opacity={viewerOpacity} />
          ) : (
            <div className="aspect-square md:aspect-[4/3] bg-cream-300 overflow-hidden">
              <img
                src={displayImages[activeImage] ?? displayImages[0]}
                alt={`${product.name}${selectedVariant ? ` — ${selectedVariant.name}` : ''}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mt-4">
            {displayImages.map((img, i) => (
              <button
                key={img}
                onClick={() => {
                  setActiveImage(i);
                  setShowViewer(false);
                }}
                className={`w-16 h-16 shrink-0 overflow-hidden border-2 transition-colors ${
                  !showViewer && activeImage === i ? 'border-gold' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {product.stlUrl && (
              <button
                onClick={() => setShowViewer(true)}
                className={`w-16 h-16 shrink-0 flex items-center justify-center border-2 bg-navy-800 text-cream-200 font-mono text-[10px] uppercase tracking-wide transition-colors ${
                  showViewer ? 'border-gold' : 'border-transparent'
                }`}
              >
                3D
              </button>
            )}
          </div>
        </div>

        {/* Info column */}
        <div>
          <p className="eyebrow mb-3">{product.shortName}</p>
          <h1 className="font-display text-3xl md:text-4xl text-navy-800 mb-3">{product.name}</h1>
          <p className="font-mono text-xl text-navy-800 mb-8">{formatEGP(product.price)}</p>

          <p className="text-navy-600 leading-relaxed mb-8">{product.description}</p>

          <div className="space-y-6 mb-8">
            <VariantSelector
              variants={product.variants}
              selectedId={variantId}
              onSelect={setVariantId}
            />
            <div>
              <p className="label">Quantity</p>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
            </div>
          </div>

          {outOfStock && (
            <p className="text-sm text-red-600 mb-4">This colour is currently out of stock.</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Button variant="secondary" className="flex-1" onClick={handleAddToCart} disabled={outOfStock}>
              {justAdded ? 'Added ✓' : 'Add to Cart'}
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleBuyNow} disabled={outOfStock}>
              Buy Now
            </Button>
          </div>

          <div className="rail my-8" />

          <dl className="grid grid-cols-2 gap-y-4 text-sm">
            <dt className="text-navy-500">Weight</dt>
            <dd className="font-mono text-navy-800">~{product.weightGrams}g</dd>
            <dt className="text-navy-500">Processing time</dt>
            <dd className="font-mono text-navy-800">{processingLabel(product.processingDays)}</dd>
            <dt className="text-navy-500">Shipping</dt>
            <dd className="font-mono text-navy-800">Calculated by governorate at checkout</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
