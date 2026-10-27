import { NextRequest, NextResponse } from 'next/server';
import { getExperienceById, saveExperience } from '@/lib/experience-store';
import { createMercadoPagoPreference } from '@/lib/payments/mercadopago';
import { createStripeCheckoutSession } from '@/lib/payments/stripe';

export async function POST(req: NextRequest) {
  try {
    const { experience_id, provider, is_demo } = await req.json();

    const experience = await getExperienceById(experience_id);
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    // Demo payment flow
    if (is_demo) {
      experience.is_paid = true;
      experience.payment_provider = provider || 'stripe';
      experience.payment_id = `demo-payment-${Date.now()}`;
      await saveExperience(experience);
      return NextResponse.json({ redirect_url: `/download/${experience.id}?paid=true` });
    }

    if (provider === 'mercadopago') {
      const pref = await createMercadoPagoPreference(experience, baseUrl);
      return NextResponse.json({ redirect_url: pref?.init_point || `/download/${experience.id}` });
    }

    if (provider === 'stripe') {
      const session = await createStripeCheckoutSession(experience, baseUrl);
      return NextResponse.json({ redirect_url: session?.url || `/download/${experience.id}` });
    }

    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  } catch (error) {
    console.error('Checkout error', error);
    return NextResponse.json({ error: 'Checkout initialization failed' }, { status: 500 });
  }
}
