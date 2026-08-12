import type { AuthSession, User } from '@/types';
import { readStore, writeStore, STORE_KEYS } from '@/lib/storage';

// Swap point: replace with real calls to /api/auth/*. The mock "hash" below
// is NOT secure — it exists only so the demo doesn't store plaintext
// passwords in localStorage. A real backend must do proper password
// hashing (bcrypt/argon2) server-side; this client should never see it.
async function mockHash(password: string): Promise<string> {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getUsers(): User[] {
  return readStore<User[]>(STORE_KEYS.users, []);
}

function saveUsers(users: User[]): void {
  writeStore(STORE_KEYS.users, users);
}

const ADMIN_PHONE = '01000000000'; // demo store-owner login, replace for production

// Dev-only password for the seeded admin account below. Never used in a
// production build (see ensureDevAdminAccount) and never a real production
// credential — replace the whole admin check with a proper role system
// backed by a real auth service before going live. See README →
// "Development admin".
const DEV_ADMIN_PASSWORD = 'NovaAdmin#Dev1';

// Seeds a local admin account for the documented demo phone number so
// `/admin/login` works out of the box in local development, without first
// registering a customer account by hand. Guarded by import.meta.env.DEV so
// it NEVER runs in a production build (`vite build` / `vite preview`) —
// production auth must go through a real backend, not this mock seed.
export async function ensureDevAdminAccount(): Promise<void> {
  if (!import.meta.env.DEV) return;

  const users = getUsers();
  const existing = users.find((u) => u.phone === ADMIN_PHONE);

  if (existing) {
    // If a matching account already exists (e.g. someone registered it by
    // hand) just make sure it's flagged as admin — never touch its password.
    if (!existing.isAdmin) {
      existing.isAdmin = true;
      saveUsers(users);
    }
    return;
  }

  const devAdmin: User = {
    id: 'user_dev_admin',
    fullName: 'NOVA Admin (Dev)',
    phone: ADMIN_PHONE,
    passwordHash: await mockHash(DEV_ADMIN_PASSWORD),
    addresses: [],
    isAdmin: true,
  };
  users.push(devAdmin);
  saveUsers(users);

  // eslint-disable-next-line no-console
  console.info(
    `[NOVA dev] Seeded local admin account — phone ${ADMIN_PHONE}, password ${DEV_ADMIN_PASSWORD}. ` +
      'Dev-only, see README → Development admin.'
  );
}

export async function register(params: {
  fullName: string;
  phone: string;
  password: string;
  email?: string;
}): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
  const users = getUsers();
  if (users.some((u) => u.phone === params.phone)) {
    return { ok: false, error: 'An account with this phone number already exists.' };
  }
  const user: User = {
    id: `user_${Date.now()}`,
    fullName: params.fullName,
    phone: params.phone,
    email: params.email,
    passwordHash: await mockHash(params.password),
    addresses: [],
    isAdmin: params.phone === ADMIN_PHONE,
  };
  users.push(user);
  saveUsers(users);
  const session: AuthSession = { userId: user.id, fullName: user.fullName, isAdmin: !!user.isAdmin };
  writeStore(STORE_KEYS.session, session);
  return { ok: true, session };
}

export async function login(params: {
  phone: string;
  password: string;
}): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
  const users = getUsers();
  const user = users.find((u) => u.phone === params.phone);
  if (!user) return { ok: false, error: 'No account found for this phone number.' };
  const hash = await mockHash(params.password);
  if (hash !== user.passwordHash) return { ok: false, error: 'Incorrect password.' };
  const session: AuthSession = { userId: user.id, fullName: user.fullName, isAdmin: !!user.isAdmin };
  writeStore(STORE_KEYS.session, session);
  return { ok: true, session };
}

export function logout(): void {
  writeStore(STORE_KEYS.session, null);
}

export function getSession(): AuthSession | null {
  return readStore<AuthSession | null>(STORE_KEYS.session, null);
}
