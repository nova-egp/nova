import type { Product } from '@/types';

// This module stands in for a real product database. Every field here
// matches the Product type in src/types, so src/api/products.ts is the
// only place that needs to change to point at a real backend.

export const PRODUCTS: Product[] = [
  {
    id: 'prod_clear',
    slug: 'nova-t-head-clear',
    name: 'NOVA T-Head — Clear Resin',
    shortName: 'Clear Resin',
    type: 'clear',
    price: 200,
    weightGrams: 75,
    processingDays: [2, 3],
    description:
      'The original NOVA T-Head, cast in optically clear resin. Every seam and facet is left fully visible, showing the precision of the mould with nothing to hide behind. A quiet, versatile piece that pairs with anything.',
    images: [
      '/assets/products/clear-front.png',
      '/assets/products/clear-angle.png',
    ],
    stlUrl: '/assets/stl/nova-t-head.stl',
    variants: [],
    featured: true,
  },
  {
    id: 'prod_gold',
    slug: 'nova-t-head-gold-leaf',
    name: 'NOVA T-Head — Gold Leaf',
    shortName: 'Gold Leaf',
    type: 'gold-leaf',
    price: 200,
    weightGrams: 75,
    processingDays: [2, 3],
    description:
      'Genuine gold leaf suspended inside clear resin, fractured and folded by hand before each pour so no two pieces catch the light the same way. Understated up close, unmistakable in the sun.',
    images: [
      '/assets/products/gold-front.png',
      '/assets/products/gold-angle.png',
    ],
    stlUrl: '/assets/stl/nova-t-head.stl',
    variants: [],
    featured: true,
  },
  {
    id: 'prod_glitter',
    slug: 'nova-t-head-glitter',
    name: 'NOVA T-Head — Glitter',
    shortName: 'Glitter',
    type: 'glitter',
    price: 200,
    weightGrams: 75,
    processingDays: [2, 3],
    description:
      'A dense, fine-grain glitter suspended edge to edge in clear resin. Bold from a distance, finely textured up close — available in three colourways.',
    // Default/fallback images for the product card grid — the product page
    // itself always shows the selected variant's own images (see below).
    images: [
      '/assets/products/glitter-red-front.png',
      '/assets/products/glitter-red-angle.png',
    ],
    stlUrl: '/assets/stl/nova-t-head.stl',
    variants: [
      {
        id: 'var_red',
        name: 'Red',
        sku: 'NV-GLT-RED',
        stock: 24,
        swatch: '#7A1128',
        images: [
          '/assets/products/glitter-red-front.png',
          '/assets/products/glitter-red-angle.png',
        ],
      },
      {
        id: 'var_pink',
        name: 'Pink',
        sku: 'NV-GLT-PNK',
        stock: 18,
        swatch: '#C86C93',
        images: [
          '/assets/products/glitter-pink-front.png',
          '/assets/products/glitter-pink-angle.png',
        ],
      },
      {
        id: 'var_black',
        name: 'Black',
        sku: 'NV-GLT-BLK',
        stock: 30,
        swatch: '#15151A',
        images: [
          '/assets/products/glitter-black-front.png',
          '/assets/products/glitter-black-angle.png',
        ],
      },
    ],
    featured: true,
  },
  {
    id: 'prod_custom',
    slug: 'nova-t-head-custom',
    name: 'NOVA T-Head — Custom',
    shortName: 'Custom',
    type: 'custom',
    price: 250,
    weightGrams: 75,
    processingDays: [2, 3],
    description:
      "Describe what you want cast into your T-Head — colour, inclusions, a reference photo — and we'll cast it to order. Every custom piece is made once, for one person.",
    images: [
      '/assets/products/custom-section.png',
    ],
    stlUrl: '/assets/stl/nova-t-head.stl',
    variants: [],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getShopProducts(): Product[] {
  // Custom is sold via its own dedicated flow (/custom), not the shop grid.
  return PRODUCTS.filter((p) => p.type !== 'custom');
}
