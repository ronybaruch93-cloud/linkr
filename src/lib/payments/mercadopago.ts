import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Experience } from '@/types/experience';

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';

export const isMercadoPagoConfigured = Boolean(accessToken && !accessToken.includes('placeholder'));

export function getMercadoPagoClient() {
  if (!isMercadoPagoConfigured) return null;
  return new MercadoPagoConfig({ accessToken });
}

export async function createMercadoPagoPreference(
  experience: Experience,
  baseUrl: string
): Promise<{ id: string; init_point: string } | null> {
  const client = getMercadoPagoClient();
  if (!client) {
    // Return mock preference if not configured
    return {
      id: `mock-mp-pref-${Date.now()}`,
      init_point: `${baseUrl}/download/${experience.id}?payment=demo_mp`,
    };
  }

  const preference = new Preference(client);
  const response = await preference.create({
    body: {
      items: [
        {
          id: experience.id,
          title: `Tarjeta Digital QR: ${experience.title}`,
          quantity: 1,
          unit_price: 4.99,
          currency_id: 'USD',
        },
      ],
      back_urls: {
        success: `${baseUrl}/download/${experience.id}?paid=true`,
        failure: `${baseUrl}/checkout/${experience.id}?status=failed`,
        pending: `${baseUrl}/download/${experience.id}?status=pending`,
      },
      auto_return: 'approved',
      external_reference: experience.id,
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
    },
  });

  return {
    id: response.id || '',
    init_point: response.init_point || '',
  };
}
