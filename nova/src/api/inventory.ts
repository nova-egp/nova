import { PRODUCTS } from '@/data/products';
import { readStore, writeStore, STORE_KEYS } from '@/lib/storage';

// Stock is normally part of the product record itself. In this MVP the
// catalog (src/data/products.ts) is static, so admin stock edits are stored
// as an overrides map keyed by variant id (or product id for products with
// no variants). A real backend would instead PATCH the product/variant row
// directly and this whole override layer would disappear.

type StockOverrides = Record<string, number>;

export interface InventoryRow {
  productId: string;
  productName: string;
  variantId?: string;
  variantName: string; // "—" when the product has no variants
  sku: string;
  stock: number;
}

function getOverrides(): StockOverrides {
  return readStore<StockOverrides>(STORE_KEYS.inventory, {});
}

export async function fetchInventory(): Promise<InventoryRow[]> {
  const overrides = getOverrides();
  const rows: InventoryRow[] = [];
  for (const p of PRODUCTS) {
    if (p.variants.length === 0) {
      if (p.type === 'custom') continue; // custom orders are made to order, not stocked
      rows.push({
        productId: p.id,
        productName: p.name,
        variantName: '—',
        sku: p.id.toUpperCase(),
        stock: overrides[p.id] ?? 50,
      });
    } else {
      for (const v of p.variants) {
        rows.push({
          productId: p.id,
          productName: p.name,
          variantId: v.id,
          variantName: v.name,
          sku: v.sku,
          stock: overrides[v.id] ?? v.stock,
        });
      }
    }
  }
  return rows;
}

export async function updateStock(key: string, stock: number): Promise<void> {
  const overrides = getOverrides();
  overrides[key] = Math.max(0, stock);
  writeStore(STORE_KEYS.inventory, overrides);
}
