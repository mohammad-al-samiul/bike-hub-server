/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const MY_DOMAIN = "http://localhost:5173"; // Updated domain
const createCheckoutSession = async (
  priceId: string
): Promise<Stripe.Checkout.Session> => {
  try {
    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${MY_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`, // Updated URL
    });

    // Return the session object
    return session;
  } catch (error: any) {
    // Handle and throw an error if the session creation fails
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
};

const getSessionStatus = async (
  sessionId: string
): Promise<{ status: string; customer_email: string | null }> => {
  try {
    // Retrieve the session details
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Return the session status and customer email
    return {
      status: session.status as string,
      customer_email: session.customer_details?.email || null,
    };
  } catch (error: any) {
    // Handle and throw an error if the session retrieval fails
    throw new Error(`Failed to retrieve session: ${error.message}`);
  }
};

export const paymentServices = {
  createCheckoutSession,
  getSessionStatus,
};
