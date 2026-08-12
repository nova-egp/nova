import type { PaymentMethod } from '@/types';

export interface PaymentResult {
  success: boolean;
  /** for methods that require an external step (e.g. redirect to a gateway) */
  redirectUrl?: string;
  message: string;
}

export interface PaymentContext {
  orderId: string;
  amountEgp: number;
  customerPhone: string;
}

// Each payment method implements this interface. Swap point: replace
// CardStrategy's body with a real Egyptian provider integration (Paymob,
// Fawry, etc.) — checkout.tsx never needs to change, it only calls
// processPayment(method, context).
interface PaymentStrategy {
  process(ctx: PaymentContext): Promise<PaymentResult>;
}

const CashOnDeliveryStrategy: PaymentStrategy = {
  async process(ctx) {
    return {
      success: true,
      message: `Order ${ctx.orderId} confirmed. Pay ${ctx.amountEgp} EGP in cash on delivery.`,
    };
  },
};

const CardStrategy: PaymentStrategy = {
  async process() {
    // Intentionally not implemented — no fake gateway. A real Egyptian
    // payment provider (Paymob, Fawry, etc.) should implement
    // PaymentStrategy and be swapped in here.
    return {
      success: false,
      message:
        'Card payment is not yet connected. Please choose Cash on Delivery or InstaPay for now.',
    };
  },
};

const InstaPayStrategy: PaymentStrategy = {
  async process(ctx) {
    return {
      success: true,
      message: `Order ${ctx.orderId} received. Send ${ctx.amountEgp} EGP via InstaPay and share the receipt on WhatsApp to confirm.`,
    };
  },
};

const STRATEGIES: Record<PaymentMethod, PaymentStrategy> = {
  cod: CashOnDeliveryStrategy,
  card: CardStrategy,
  instapay: InstaPayStrategy,
};

export async function processPayment(
  method: PaymentMethod,
  ctx: PaymentContext
): Promise<PaymentResult> {
  return STRATEGIES[method].process(ctx);
}
