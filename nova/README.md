# NOVA — Resin. Reimagined.

A functional e-commerce MVP for NOVA, an Egyptian resin accessory brand.
Built with React + TypeScript + Vite + Tailwind, with an interactive
Three.js/react-three-fiber viewer rendering the real NOVA T-Head STL file.

## Running it

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

## What's real vs. what's mocked

This is a genuine MVP architecture, not a static mockup — routing, cart
state, checkout, order creation, and the admin dashboard all work end to
end. What's mocked is the **backend**: there is no server here, so data is
persisted to the browser's `localStorage` instead of a real database. Every
data-access function lives in `src/api/*.ts` and is written to look exactly
like it's calling a real API (`async`, returns the same shapes a REST
endpoint would) — swapping mock storage for real HTTP calls means editing
those few files, not the pages or components that use them.

| Concern | Current MVP | To go live |
|---|---|---|
| Product catalog | Static array in `src/data/products.ts` | Point `src/api/products.ts` at a real products endpoint |
| Orders / cart / inventory | `localStorage`, see `src/lib/storage.ts` | Point `src/api/orders.ts` and `src/api/inventory.ts` at a real backend + database |
| Auth | Mock phone+password accounts in `localStorage`, SHA-256'd client-side only for demo purposes | Real auth service with server-side password hashing (bcrypt/argon2) and proper session tokens |
| Payments | Cash on Delivery and InstaPay (manual) work today. Card is intentionally **not implemented** — no fake gateway | Implement the `PaymentStrategy` interface in `src/lib/payment.ts` with a real Egyptian provider (Paymob, Fawry, etc.) |
| Shipping cost | Not calculated — `null` until the store owner manually enters the confirmed amount in Admin → Order Detail (see "Shipping cost" below) | Optionally point a "Shipping cost" step at a real carrier rate API (Bosta, Mylerz, etc.) if you want it automated later |

## Admin dashboard

Visit `/admin/login`.

### Development admin

In local development (`npm run dev`), the app automatically seeds a demo
admin account the first time it loads — you do **not** need to register a
customer account first. Credentials:

```
Phone:    01000000000
Password: NovaAdmin#Dev1
```

This happens in `ensureDevAdminAccount()` in `src/api/auth.ts`, called once
from `AuthContext` on startup. It's guarded by `import.meta.env.DEV`, which
Vite hard-codes to `false` in a production build — so this seeding code
(and the dev password) is dead-code-eliminated and **never ships** in
`npm run build` / `npm run preview`. You can confirm this yourself: build
the app and `grep` `dist/assets/*.js` for `NovaAdmin` — it won't be there.

If you manually register a real account with the phone number
`01000000000` (e.g. `/account/register`), the seed step detects it already
exists and just makes sure it's flagged as admin — it never overwrites a
password you set yourself.

`01000000000` is also still hardcoded as `ADMIN_PHONE` in `src/api/auth.ts`
— the single source of truth for "which phone number is the store owner."
Change it to your real number, or replace the whole check with a proper
role system backed by a real auth service, before going live. There is no
production password anywhere in this codebase; production auth needs a
real backend.

### Dashboard features

- Order overview with revenue/new-order metrics
- Full order list with search + status filter
- Order detail with a status dropdown (New → Confirmed → Preparing →
  Shipped → Delivered → Cancelled) and a one-tap WhatsApp link to the
  customer
- Manual shipping confirmation per order (see "Shipping cost" below) —
  enter the confirmed EGP amount once you've checked with the shipping
  company; the order total updates automatically
- A dedicated Custom Orders view showing each customer's description and
  uploaded reference image
- Inventory management (stock per colour variant)

## Shipping cost

Shipping is **never calculated or assumed** anywhere in this codebase.
Product prices are flat (200 EGP standard / 250 EGP custom); shipping
depends on the customer's governorate/area and the shipping company's
actual rate for it, which varies and isn't known at order time.

- At checkout, the customer picks their governorate and enters their
  address — both are saved with the order — but no shipping figure is
  shown or added. The order is created with `shipping: null` and
  `total = subtotal` (product cost only).
- In Admin → Order Detail, `shipping: null` displays as "According to
  location". Once you've confirmed the real cost with the shipping
  company, enter it in the "Shipping cost" field on that page — this
  calls `updateOrderShipping()` in `src/api/orders.ts`, which sets
  `order.shipping` and recomputes `order.total = subtotal + shipping`.
- There is no fallback or default shipping fee in the code. `GOVERNORATES`
  in `src/data/governorates.ts` is just the list of governorate names for
  the address form now — it carries no price.

## Project structure

```
src/
  api/         data-access layer — the swap point for a real backend
  components/  layout, ui primitives, product, cart
  context/     CartContext, AuthContext
  data/        static catalog + governorate list (address form only, no shipping prices)
  lib/         payment strategy, storage, formatting
  pages/       one file per route, plus account/ and admin/ subtrees
  types/       shared data model definitions
public/
  assets/      logo, product photography, and the NOVA T-Head STL
```

## Notes on the hero 3D model

The homepage hero (`src/components/product/HeroViewer3D.tsx`) loads
`/public/assets/glb/hero-gold.glb` — the Gold Leaf T-Head — via drei's
`useGLTF`, with the same rotate/zoom/studio-lighting interaction as the
per-product viewer. It's a separate component from the product viewer
because the hero asset is a pre-authored GLB with its own materials,
while the product viewer loads a raw STL and applies material/color
per variant. No price is shown in the hero — it's brand/CTA-only.

## Notes on the per-product 3D viewer

`src/components/product/ProductViewer3D.tsx` loads
`/public/assets/stl/nova-t-head.stl` with three.js's `STLLoader`, centers
and auto-scales it, and renders it with a glass-like `meshPhysicalMaterial`
(transmission for the clear/gold-leaf pieces, higher opacity for glitter)
under studio lighting from `@react-three/drei`'s `Environment`. It's shown
on the product page as a toggle alongside the photography — press the "3D"
thumbnail.
