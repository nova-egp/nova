// A tiny typed wrapper around localStorage. This is the "database" for the
// MVP — every read/write goes through here so the storage strategy can be
// swapped (e.g. for real API calls) in one place without touching callers
// in api/*.ts.

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can throw in private-browsing / quota-exceeded cases.
    // Failing silently here is acceptable for an MVP mock store.
  }
}

export const STORE_KEYS = {
  orders: 'nova_orders',
  users: 'nova_users',
  session: 'nova_session',
  cart: 'nova_cart',
  inventory: 'nova_inventory_overrides',
} as const;
