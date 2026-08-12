import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { formatEGP } from '@/lib/format';
import { HeroViewer3D } from '@/components/product/HeroViewer3D';

const HERO_GLB_URL = '/assets/glb/hero-gold.glb';

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);

  return (
    <div>
      {/* Hero — the product is the visual hero, per brief */}
      <section className="relative bg-navy-800 text-cream-200 overflow-hidden">
        <div className="max-w-content mx-auto px-5 md:px-8 pt-20 pb-16 md:pt-28 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow text-gold mb-6">Egyptian resin, cast to order</p>
            <h1 className="font-display text-cream-200 text-5xl md:text-6xl leading-[1.05] mb-6">
              Resin.
              <br />
              Reimagined.
            </h1>
            <p className="text-cream-300/70 text-base leading-relaxed max-w-md mb-10">
              The NOVA T-Head — hand-cast in small batches, from optically clear
              resin to gold leaf and glitter. Every piece carries its own light.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-gold">
                Shop T-Head
              </Link>
              <Link to="/custom" className="btn-secondary !border-cream-200/30 !text-cream-200 hover:!bg-cream-200/10">
                Design your own
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-navy-700 overflow-hidden">
              <HeroViewer3D glbUrl={HERO_GLB_URL} />
            </div>
          </div>
        </div>
        <div className="rail rail-light" />
      </section>

      {/* Brand statement — minimal, sits between the hero and the collection */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-16">
        <div className="max-w-lg">
          <h2 className="font-display text-xl md:text-2xl text-navy-800 mb-3">
            Made in Egypt. Designed differently.
          </h2>
          <p className="text-navy-600 leading-relaxed text-sm md:text-base">
            NOVA casts every T-Head by hand in Cairo, treating resin as a
            material worth taking seriously — distinctive pieces made in
            small batches, not off a shelf.
          </p>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">The Collection</p>
            <h2 className="font-display text-3xl md:text-4xl text-navy-800">Every T-Head</h2>
          </div>
          <Link to="/shop" className="hidden sm:block text-sm text-navy-600 hover:text-navy-800 transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Custom section */}
      <section className="bg-cream-300">
        <div className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] bg-navy-800 overflow-hidden order-2 md:order-1">
            <img
              src="/assets/products/custom-section.png"
              alt="Design your own NOVA T-Head"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="eyebrow mb-3">Made once, for one person</p>
            <h2 className="font-display text-3xl md:text-4xl text-navy-800 mb-6">
              Build your own T-Head
            </h2>
            <p className="text-navy-600 leading-relaxed mb-8 max-w-md">
              Tell us what you're picturing — a colour, an inclusion, a reference
              photo — and we'll cast it by hand. {formatEGP(250)}, ready in 2–3 days.
            </p>
            <Link to="/custom" className="btn-primary">
              Start a custom order
            </Link>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">Our Story</p>
          <h2 className="font-display text-2xl md:text-3xl text-navy-800 mb-6">
            Cast in Cairo, one mould at a time
          </h2>
          <p className="text-navy-600 leading-relaxed">
            NOVA began as a single mould and a question: how much character can
            resin actually hold? Every T-Head is still poured, cured and finished
            by hand in small batches — which means no two pieces catch the light
            quite the same way, and every order takes a few days rather than a
            few seconds.
          </p>
        </div>
      </section>
    </div>
  );
}
