import type { Governorate } from '@/types';

// Egypt's governorates, for the customer address form. Shipping cost is NOT
// derived from this list — it depends on the shipping company's rate for
// the customer's specific area and is confirmed manually by the store
// owner after the order is placed. See src/api/orders.ts (createOrder /
// updateOrderShipping) and src/pages/admin/OrderDetail.tsx.
export const GOVERNORATES: Governorate[] = [
  { code: 'CAI', name: 'Cairo' },
  { code: 'GIZ', name: 'Giza' },
  { code: 'ALX', name: 'Alexandria' },
  { code: 'QLY', name: 'Qalyubia' },
  { code: 'SHR', name: 'Sharqia' },
  { code: 'DKH', name: 'Dakahlia' },
  { code: 'GHR', name: 'Gharbia' },
  { code: 'MNF', name: 'Monufia' },
  { code: 'KFS', name: 'Kafr El Sheikh' },
  { code: 'DMT', name: 'Damietta' },
  { code: 'PTS', name: 'Port Said' },
  { code: 'ISM', name: 'Ismailia' },
  { code: 'SUZ', name: 'Suez' },
  { code: 'BSW', name: 'Beheira' },
  { code: 'FYM', name: 'Fayoum' },
  { code: 'BNS', name: 'Beni Suef' },
  { code: 'MNY', name: 'Minya' },
  { code: 'AST', name: 'Asyut' },
  { code: 'SHG', name: 'Sohag' },
  { code: 'QNA', name: 'Qena' },
  { code: 'LXR', name: 'Luxor' },
  { code: 'ASW', name: 'Aswan' },
  { code: 'RSA', name: 'Red Sea' },
  { code: 'NVL', name: 'New Valley' },
  { code: 'MTR', name: 'Matrouh' },
  { code: 'NSI', name: 'North Sinai' },
  { code: 'SSI', name: 'South Sinai' },
];

export function findGovernorate(code: string): Governorate | undefined {
  return GOVERNORATES.find((g) => g.code === code);
}
