declare module "@cashfreepayments/cashfree-js" {
  type CashfreeCheckoutResult = {
    error?: { code?: string; message?: string };
    paymentDetails?: { cf_payment_id?: number };
  };

  type CashfreeClient = {
    checkout: (options: { paymentSessionId: string; redirectTarget: "_modal" | "_self" }) => Promise<CashfreeCheckoutResult>;
  };

  export function load(options: { mode: "sandbox" | "production" }): Promise<CashfreeClient | null>;
}