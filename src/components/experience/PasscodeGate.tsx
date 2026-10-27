'use client';

import React, { useState } from 'react';
import { Lock, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

interface PasscodeGateProps {
  correctPasscode: string;
  onUnlocked: () => void;
  primaryColor?: string;
}

export function PasscodeGate({
  correctPasscode,
  onUnlocked,
  primaryColor = '#e11d48',
}: PasscodeGateProps) {
  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === correctPasscode.trim()) {
      onUnlocked();
    } else {
      setHasError(true);
      setTimeout(() => setHasError(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg">
      <motion.div
        animate={hasError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-black/10 dark:border-white/10 text-center"
      >
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg mb-5"
          style={{ backgroundColor: primaryColor }}
        >
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Experiencia Protegida
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Ingresa el código PIN o contraseña de 4 dígitos para acceder a este regalo digital.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
            <input
              type="password"
              maxLength={12}
              placeholder="Código de acceso"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-center text-lg font-mono tracking-widest border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {hasError && (
            <p className="text-xs font-semibold text-rose-500 animate-pulse">
              Código incorrecto. Vuelve a intentarlo.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl text-white font-semibold text-sm shadow-md hover:opacity-95 active:scale-98 transition"
            style={{ backgroundColor: primaryColor }}
          >
            Desbloquear Regalo
          </button>
        </form>
      </motion.div>
    </div>
  );
}
