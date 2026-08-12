import type { Order } from '@/types';
import { CUSTOM_DEPOSIT_AMOUNT } from '@/types';
import { formatEGP } from './format';

// Builds the ready-to-send WhatsApp order-confirmation message shown in
// Admin → Order Detail. Always reflects the order's latest saved state —
// shipping is NEVER estimated or hardcoded here. Until the store owner
// confirms a real shipping cost (order.shipping !== null), the message says
// "According to location" and the total is shown as "subtotal + shipping"
// rather than a final number.
export function buildOrderWhatsAppMessage(order: Order): string {
  const customLines = order.lines.filter((l) => !!l.custom);
  const customTotal = customLines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const remainingBalance = Math.max(customTotal - CUSTOM_DEPOSIT_AMOUNT, 0);

  const lines: string[] = [];
  lines.push('Nova');
  lines.push('');
  lines.push(`Order Number: ${order.id}`);
  lines.push(`Customer Name: ${order.customer.fullName}`);
  lines.push(`Phone: ${order.customer.phone}`);
  lines.push(`Address: ${order.customer.address}`);
  lines.push('');

  order.lines.forEach((l) => {
    const variant = l.variantName ? ` (${l.variantName})` : '';
    lines.push(`${l.quantity}x ${l.productName}${variant} — ${formatEGP(l.unitPrice * l.quantity)}`);
  });

  if (order.isCustom) {
    lines.push('');
    lines.push('Custom Order');
    lines.push(`Deposit: ${formatEGP(CUSTOM_DEPOSIT_AMOUNT)}`);
    lines.push(`Deposit Status: ${order.depositStatus ?? 'Pending'}`);
    lines.push(`Remaining Product Balance: ${formatEGP(remainingBalance)}`);
  }

  lines.push('');
  lines.push(`Product subtotal: ${formatEGP(order.subtotal)}`);
  if (order.shipping === null) {
    lines.push('Shipping: According to location');
    lines.push(`Total: ${formatEGP(order.subtotal)} + shipping`);
  } else {
    lines.push(`Shipping: ${formatEGP(order.shipping)}`);
    lines.push(`Total: ${formatEGP(order.total)}`);
  }

  return lines.join('\n');
}

// Egyptian numbers are stored as 01xxxxxxxxx; WhatsApp needs the country code.
export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '').replace(/^0/, '');
  const intl = `20${digits}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}
