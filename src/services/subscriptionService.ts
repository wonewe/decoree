type CheckoutSessionPayload = {
  email: string;
  planId: string;
};

type CheckoutSessionResponse = {
  checkoutUrl: string;
};

/**
 * Mimics the request to a Stripe Checkout session endpoint for MVP validation.
 * Replace with a real API call when the backend endpoint is ready.
 */
export async function createMockCheckoutSession(
  payload: CheckoutSessionPayload
): Promise<CheckoutSessionResponse> {
  console.info("Simulating Stripe checkout session with payload:", payload);
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          checkoutUrl: "https://dashboard.stripe.com/test/checkout/session/mock"
        }),
      400
    )
  );
}
