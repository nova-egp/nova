import type { Product } from '@/types';
import { PRODUCTS, getProductBySlug, getShopProducts } from '@/data/products';

// -----------------------------------------------------------------------
// Swap point: replace the bodies of these functions with real HTTP calls
// (e.g. fetch('/api/products')) once a backend exists. Every function
// already returns a Promise so call sites don't need to change.
// -----------------------------------------------------------------------

const LATENCY = 120;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
}

export async function fetchShopProducts(): Promise<Product[]> {
  return delay(getShopProducts());
}

export async function fetchAllProducts(): Promise<Product[]> {
  return delay(PRODUCTS);
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  return delay(getProductBySlug(slug));
}
