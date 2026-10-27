'use client';

import React from 'react';
import { WhatsAppReplyBlockData } from '@/types/experience';
import { MessageCircle } from 'lucide-react';

interface WhatsAppReplyBlockProps {
  data: WhatsAppReplyBlockData;
  primaryColor?: string;
}

export function WhatsAppReplyBlock({ data }: WhatsAppReplyBlockProps) {
  if (!data.phoneNumber) return null;

  const cleanPhone = data.phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(
    data.defaultMessage || '¡Hola! Acabo de abrir la tarjeta y me encantó la sorpresa... ❤️'
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return (
    <div className="w-full max-w-lg mx-auto my-8 px-4 text-center">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-600/20 transition-all"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        {data.buttonText || 'Enviar agradecimiento por WhatsApp'}
      </a>
      <p className="mt-2 text-xs text-slate-400">
        Se abrirá una conversación directa con el creador del regalo.
      </p>
    </div>
  );
}
