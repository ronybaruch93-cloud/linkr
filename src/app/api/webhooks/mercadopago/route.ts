import { NextRequest, NextResponse } from 'next/server';
import { getExperienceById, saveExperience } from '@/lib/experience-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);

    // Mercado Pago passes topic/type and data.id or id
    const topic = searchParams.get('topic') || searchParams.get('type') || body.type;
    const paymentId = searchParams.get('data.id') || searchParams.get('id') || body.data?.id;

    console.log(`[MercadoPago Webhook] Received notification for topic: ${topic}, id: ${paymentId}`);

    // If external_reference was sent in body or can be resolved
    const experienceId = body.external_reference || searchParams.get('external_reference');

    if (experienceId) {
      const exp = await getExperienceById(experienceId);
      if (exp) {
        exp.is_paid = true;
        exp.payment_provider = 'mercadopago';
        exp.payment_id = String(paymentId || 'mp-ipn');
        await saveExperience(exp);
        console.log(`[MercadoPago Webhook] Experience ${experienceId} successfully marked as paid.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[MercadoPago Webhook Error]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
