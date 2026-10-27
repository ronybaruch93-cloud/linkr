'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Experience } from '@/types/experience';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'mercadopago' | 'stripe'>('mercadopago');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/experiences?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setExperience(data.experience);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const handlePay = async (isDemo = false) => {
    if (!experience) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience_id: experience.id,
          provider: selectedProvider,
          is_demo: isDemo,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.redirect_url) {
          if (data.redirect_url.startsWith('http')) {
            window.location.href = data.redirect_url;
          } else {
            router.push(data.redirect_url);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-sm text-slate-500">Cargando detalles de compra...</p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-sm text-slate-500">Experiencia no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 dark:border-white/10 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Finalizar y Desbloquear Tarjeta QR
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tu página digital interactiva se alojará de por vida y podrás editarla cuando desees.
          </p>
        </div>

        {/* Order Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Experiencia</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
              {experience.title}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Destinatario</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {experience.recipient_name || 'Especial'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Incluye</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 text-right">
              Página Web + PDF Vectorial A6 / Cuadrado
            </span>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Total a pagar
            </span>
            <span className="text-lg font-black text-rose-600">
              $4.99 USD
            </span>
          </div>
        </div>

        {/* Payment Provider Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Selecciona tu Método de Pago
          </label>

          {/* Mercado Pago */}
          <div
            onClick={() => setSelectedProvider('mercadopago')}
            className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
              selectedProvider === 'mercadopago'
                ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                MP
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Mercado Pago (Latinoamérica)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Tarjetas de crédito/débito, Pix, Efectivo (Pago Fácil, Rapipago), Dinero en cuenta
                </p>
              </div>
            </div>
            {selectedProvider === 'mercadopago' && (
              <Check className="w-4 h-4 text-blue-600" />
            )}
          </div>

          {/* Stripe */}
          <div
            onClick={() => setSelectedProvider('stripe')}
            className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
              selectedProvider === 'stripe'
                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Stripe (Internacional)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Visa, Mastercard, American Express, Apple Pay, Google Pay
                </p>
              </div>
            </div>
            {selectedProvider === 'stripe' && (
              <Check className="w-4 h-4 text-indigo-600" />
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => handlePay(false)}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <span>{isProcessing ? 'Procesando...' : 'Pagar $4.99 y Obtener Tarjeta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Instant Sandbox / Demo Checkout */}
          <button
            type="button"
            onClick={() => handlePay(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-50 flex items-center justify-center gap-1.5 transition"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            Simular Pago Exitoso (Modo Demo sin Claves)
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Pago 100% seguro y encriptado</span>
        </div>
      </div>
    </div>
  );
}
