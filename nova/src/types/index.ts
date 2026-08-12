// ---------------------------------------------------------------------------
// NOVA data models.
//
// These types describe the shape of data as it would come from a real
// database/API. The mock data layer in src/data + src/api conforms to these
// same shapes, so swapping the api/* modules for real network calls later
// does not require touching any component.
// ---------------------------------------------------------------------------

export type ProductType = 'clear' | 'gold-leaf' | 'glitter' | 'custom';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Red", "Black"
  sku: string;
  stock: number;
  /** hex swatch shown in the variant selector */
  swatch?: string;
  /** images specific to this variant — falls back to the parent product's images when absent */
  images?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string; // "NOVA T-Head — Glitter"
  shortName: string; // "Glitter"
  type: ProductType;
  price: number; // EGP
  weightGrams: number;
  processingDays: [number, number];
  description: string;
  images: string[]; // paths under /assets/products
  /** only the base/clear model needs this — the interactive viewer is shown once per product family */
  stlUrl?: string;
  variants: ProductVariant[];
  featured?: boolean;
}

export interface Governorate {
  code: string;
  name: string;
}

export interface CustomOrderDetails {
  description: string;
  referenceImageDataUrl?: string;
  referenceImageName?: string;
}

// A Custom order (250 EGP) requires a 100 EGP deposit before production
// starts. The deposit is part of the 250 EGP price, not an extra fee —
// remaining product balance = 250 - 100 = 150 EGP. Standard products never
// carry a deposit.
export const CUSTOM_DEPOSIT_AMOUNT = 100;

export type DepositStatus = 'Pending' | 'Paid';

export interface CartLine {
  id: string; // unique line id (product+variant+customization hash)
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  custom?: CustomOrderDetails;
}

export type PaymentMethod = 'cod' | 'card' | 'instapay';

export type OrderStatus =
  | 'New'
  | 'Confirmed'
  | 'Preparing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
  'New',
  'Confirmed',
  'Preparing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export interface OrderCustomer {
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  userId?: string;
}

export interface Order {
  id: string;
  createdAt: string; // ISO date
  customer: OrderCustomer;
  lines: CartLine[];
  subtotal: number;
  /** null = not yet confirmed with the shipping company ("According to location") */
  shipping: number | null;
  total: number; // subtotal only until shipping is confirmed; subtotal + shipping after
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  isCustom: boolean;
  /** Only set when isCustom is true. Custom orders start as 'Pending' and are
   *  not considered ready for production until this is marked 'Paid' by the
   *  store owner in Admin. */
  depositStatus?: DepositStatus;
  notes?: string;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  passwordHash: string; // mock only — never store plaintext, even here
  addresses: { governorate: string; address: string }[];
  isAdmin?: boolean;
}

export interface AuthSession {
  userId: string;
  fullName: string;
  isAdmin: boolean;
}
