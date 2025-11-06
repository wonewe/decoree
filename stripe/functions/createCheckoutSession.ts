/**
 * Example Firebase Cloud Function to create a Stripe Checkout session.
 *
 * 1. `npm install firebase-admin firebase-functions stripe`
 * 2. Set the following environment config:
 *    `firebase functions:config:set stripe.secret_key="sk_test_123"`
 *    `firebase functions:config:set stripe.price_id="price_XXXX"`
 * 3. Deploy with `firebase deploy --only functions:createCheckoutSession`
 */

import * as functions from "firebase-functions";
import Stripe from "stripe";

const stripeSecretKey = functions.config().stripe.secret_key;
const defaultPriceId = functions.config().stripe.price_id;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16"
});

export const createCheckoutSession = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { email, planId } = req.body as { email?: string; planId?: string };
    if (!email) {
      res.status(400).send("Missing email");
      return;
    }

    const priceId = planId ?? defaultPriceId;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${functions.config().app.host}/subscribe?status=success`,
      cancel_url: `${functions.config().app.host}/subscribe?status=cancelled}`,
      metadata: {
        source: "decoree-web"
      }
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).send(message);
  }
});
