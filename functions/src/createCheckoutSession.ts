import {config} from "firebase-functions";
import {https} from "firebase-functions/v2";
import Stripe from "stripe";
import type {Request, Response} from "express";

const stripeSecretKey =
  config().stripe?.secret_key ?? process.env.STRIPE_SECRET_KEY ?? "";
const defaultPriceId =
  config().stripe?.price_id ?? process.env.STRIPE_PRICE_ID ?? "";
const successHost =
  config().app?.host ?? process.env.APP_HOST ?? "";

export const createCheckoutSession = https.onRequest(
  {region: "us-central1", cors: true},
  async (req: Request, res: Response) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const {email, planId} = req.body as {email?: string; planId?: string};

      if (!email) {
        res.status(400).send("Missing email");
        return;
      }

      if (!stripeSecretKey || !defaultPriceId || !successHost) {
        res
          .status(500)
          .send([
            "Stripe configuration missing.",
            "Set secret_key, price_id and app.host via",
            "`firebase functions:config:set` or environment variables.",
          ].join(" "));
        return;
      }

      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2024-06-20",
      });

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: email,
        line_items: [
          {
            price: planId ?? defaultPriceId,
            quantity: 1,
          },
        ],
        success_url: `${successHost}/subscribe?status=success`,
        cancel_url: `${successHost}/subscribe?status=cancelled`,
        metadata: {
          source: "decoree-web",
        },
      });

      res.status(200).json({sessionId: session.id, url: session.url});
    } catch (error) {
      console.error("[Stripe] createCheckoutSession error", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).send(message);
    }
  }
);
