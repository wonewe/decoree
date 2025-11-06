import { loadStripe, Stripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const checkoutEndpoint =
  import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT ?? "/api/create-checkout-session";

let stripePromise: Promise<Stripe | null> | null = null;

type CheckoutSessionPayload = {
  email: string;
  planId: string;
};

type CheckoutSessionResponse =
  | { sessionId: string; url?: string }
  | { url: string; sessionId?: string };

function ensureStripe() {
  if (!publishableKey) {
    throw new Error(
      "Stripe publishable key is missing. Define VITE_STRIPE_PUBLISHABLE_KEY in your environment."
    );
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}

async function requestCheckoutSession(
  payload: CheckoutSessionPayload
): Promise<CheckoutSessionResponse> {
  const response = await fetch(checkoutEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create Stripe checkout session.");
  }

  return (await response.json()) as CheckoutSessionResponse;
}

export async function redirectToStripeCheckout(payload: CheckoutSessionPayload) {
  const stripe = await ensureStripe();
  if (!stripe) {
    throw new Error("Stripe failed to initialise.");
  }

  const session = await requestCheckoutSession(payload);

  if (session.url) {
    window.location.href = session.url;
    return;
  }

  if (session.sessionId) {
    const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
    if (error) {
      throw error;
    }
    return;
  }

  throw new Error("Stripe session response missing sessionId or url.");
}
