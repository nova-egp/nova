import React, { useEffect, useState } from 'react';
import type { InventoryRow } from '@/api/inventory';
import { fetchInventory, updateStock } from '@/api/inventory';

export default function Inventory() {
  const [rows, setRows] = useState<InventoryRow[] | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory().then(setRows);
  }, []);

  async function handleStockChange(row: InventoryRow, value: string) {
    const stock = Math.max(0, Number(value) || 0);
    const key = row.variantId ?? row.productId;
    setRows((prev) => prev && prev.map((r) => ((r.variantId ?? r.productId) === key ? { ...r, stock } : r)));
    setSavingKey(key);
    await updateStock(key, stock);
    setSavingKey(null);
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-2">Inventory</h1>
      <p className="text-sm text-cream-300/50 mb-6">
        Stock is tracked per colour variant. Editing here does not affect orders already placed.
      </p>

      {rows === null ? (
        <p className="text-cream-300/50 text-sm">Loading…</p>
      ) : (
        <div className="bg-navy-800 divide-y divide-cream-200/10">
          <div className="hidden md:grid grid-cols-4 gap-4 px-5 py-3 text-xs text-cream-300/40 font-mono uppercase tracking-wide">
            <span>Product</span>
            <span>Variant</span>
            <span>SKU</span>
            <span>Stock</span>
          </div>
          {rows.map((row) => {
            const key = row.variantId ?? row.productId;
            const low = row.stock <= 5;
            return (
              <div key={key} className="grid grid-cols-2 md:grid-cols-4 gap-4 px-5 py-4 items-center">
                <span className="text-sm">{row.productName}</span>
                <span className="text-sm text-cream-300/70">{row.variantName}</span>
                <span className="font-mono text-xs text-cream-300/50 hidden md:block">{row.sku}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    value={row.stock}
                    onChange={(e) => handleStockChange(row, e.target.value)}
                    className="w-20 bg-navy-900 border border-cream-200/20 text-cream-200 px-3 py-2 text-sm font-mono focus:border-gold outline-none"
                  />
                  {low && <span className="text-[11px] font-mono uppercase text-gold">Low</span>}
                  {savingKey === key && <span className="text-[11px] text-cream-300/40">Saving…</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
