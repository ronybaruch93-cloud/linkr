import Stripe from 'stripe';
import { Experience } from '@/types/experience';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const isStripeConfigured = Boolean(stripeSecretKey && !stripeSecretKey.includes('placeholder'));

export const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey, { apiVersion: '2024-09-30.acacia' as any })
  : null;

export async function createStripeCheckoutSession(
  experience: Experience,
  baseUrl: string
): Promise<{ id: string; url: string } | null> {
  if (!stripe) {
    // Return mock session if not configured
    return {
      id: `mock-stripe-sess-${Date.now()}`,
      url: `${baseUrl}/download/${experience.id}?payment=demo_stripe`,
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Experiencia Digital QR: ${experience.title}`,
            description: 'Página personalizada con tarjeta de regalo vectorial PDF descargable',
          },
          unit_amount: 499, // $4.99 USD
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/download/${experience.id}?paid=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/${experience.id}?canceled=true`,
    metadata: {
      experience_id: experience.id,
      slug: experience.slug,
    },
  });

  return {
    id: session.id,
    url: session.url || '',
  };
}
