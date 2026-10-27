import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { getExperienceById, saveExperience } from '@/lib/experience-store';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    if (stripe && webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error(`[Stripe Webhook Signature Failed]`, err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      // In development or when keys aren't yet configured, parse payload directly
      event = JSON.parse(rawBody);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const experienceId = session.metadata?.experience_id;

      if (experienceId) {
        const exp = await getExperienceById(experienceId);
        if (exp) {
          exp.is_paid = true;
          exp.payment_provider = 'stripe';
          exp.payment_id = session.id;
          await saveExperience(exp);
          console.log(`[Stripe Webhook] Experience ${experienceId} successfully marked as paid.`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[Stripe Webhook Error]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
