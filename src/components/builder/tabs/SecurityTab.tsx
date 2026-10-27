'use client';

import React, { useState } from 'react';
import { Experience } from '@/types/experience';
import { Lock, KeyRound, Copy, Check, ShieldCheck, Link2 } from 'lucide-react';

interface SecurityTabProps {
  experience: Experience;
  onChange: (updated: Partial<Experience>) => void;
}

export function SecurityTab({ experience, onChange }: SecurityTabProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://qrgift.com';
  const magicEditUrl = `${baseUrl}/edit/${experience.id}?token=${experience.edit_token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(magicEditUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Passcode Protection */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Protección por Contraseña / PIN (Opcional)
            </h4>
            <p className="text-xs text-slate-500">
              Si defines un PIN, el destinatario deberá ingresarlo antes de ver el contenido.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Código PIN (Déjalo en blanco para acceso público instantáneo)
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Ej. 1234 o fecha especial"
              value={experience.passcode || ''}
              onChange={(e) => onChange({ passcode: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Magic Link Post-Print Editing */}
      <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Enlace Mágico de Edición Instantánea
            </h4>
            <p className="text-xs text-slate-500">
              Puedes modificar el contenido, fotos y música en cualquier momento, ¡incluso después de haber impreso la tarjeta física con el código QR!
            </p>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5" /> Tu Enlace Privado
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={magicEditUrl}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-emerald-500 transition shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Guarda este enlace o envíatelo por correo para volver a editar esta página cuando quieras.
          </p>
        </div>
      </div>
    </div>
  );
}
