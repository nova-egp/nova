import type { CartLine, DepositStatus, Order, OrderCustomer, OrderStatus, PaymentMethod } from '@/types';
import { readStore, writeStore, STORE_KEYS } from '@/lib/storage';

// Swap point: replace localStorage reads/writes with real API calls
// (fetch('/api/orders', ...)). Function signatures are designed to match
// a REST resource so the swap is mechanical.

function generateOrderId(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `NV-${Date.now().toString().slice(-6)}${n}`;
}

export async function createOrder(params: {
  lines: CartLine[];
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  notes?: string;
}): Promise<Order> {
  // Shipping is NEVER calculated or assumed here — it depends on the
  // customer's governorate/area and is confirmed separately with the
  // shipping company. It starts as null ("According to location") and the
  // order total is the product subtotal only, until the store owner sets
  // a confirmed shipping cost via updateOrderShipping below.
  const subtotal = params.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const isCustom = params.lines.some((l) => !!l.custom);
  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    customer: params.customer,
    lines: params.lines,
    subtotal,
    shipping: null,
    total: subtotal,
    paymentMethod: params.paymentMethod,
    status: 'New',
    isCustom,
    // Custom orders start with the 100 EGP deposit unpaid; not ready for
    // production until the store owner marks it Paid in Admin.
    depositStatus: isCustom ? 'Pending' : undefined,
    notes: params.notes,
  };

  const orders = readStore<Order[]>(STORE_KEYS.orders, []);
  orders.unshift(order);
  writeStore(STORE_KEYS.orders, orders);
  return order;
}

export async function fetchAllOrders(): Promise<Order[]> {
  return readStore<Order[]>(STORE_KEYS.orders, []);
}

export async function fetchOrdersForUser(userId: string): Promise<Order[]> {
  const orders = readStore<Order[]>(STORE_KEYS.orders, []);
  return orders.filter((o) => o.customer.userId === userId);
}

export async function fetchOrderById(id: string): Promise<Order | undefined> {
  const orders = readStore<Order[]>(STORE_KEYS.orders, []);
  return orders.find((o) => o.id === id);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const orders = readStore<Order[]>(STORE_KEYS.orders, []);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    writeStore(STORE_KEYS.orders, orders);
  }
}

// Called from the admin Order Detail screen once the store owner confirms
// the 100 EGP Custom order deposit has actually been received. A Custom
// order is not considered ready for production until this is 'Paid'.
export async function updateOrderDepositStatus(id: string, depositStatus: DepositStatus): Promise<Order | undefined> {
  const orders = readStore<Order[]>(STORE_KEYS.orders, []);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  orders[idx].depositStatus = depositStatus;
  writeStore(STORE_KEYS.orders, orders);
  return orders[idx];
}

// Called from the admin Order Detail screen once the store owner has
// confirmed the real shipping cost with the shipping company for this
// order's governorate/area. This is the ONLY place a shipping amount is
// ever attached to an order — never calculated or defaulted automatically.
export async function updateOrderShipping(id: string, shipping: number): Promise<Order | undefined> {
  const orders = readStore<Order[]>(STORE_KEYS.orders, []);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  orders[idx].shipping = shipping;
  orders[idx].total = orders[idx].subtotal + shipping;
  writeStore(STORE_KEYS.orders, orders);
  return orders[idx];
}
