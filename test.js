import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const account = await stripe.accounts.retrieve();

console.log("LMS Stripe Account:", account.id);
