'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SecretEnvelopeBlockData } from '@/types/experience';
import { Heart, Star, Sparkles, Mail, MailOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SecretEnvelopeBlockProps {
  data: SecretEnvelopeBlockData;
  primaryColor?: string;
}

export function SecretEnvelopeBlock({ data, primaryColor = '#e11d48' }: SecretEnvelopeBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: [primaryColor, '#fb7185', '#ffd700', '#ffffff'],
      });
    }
  };

  const getSealIcon = () => {
    switch (data.waxSealIcon) {
      case 'star':
        return <Star className="h-6 w-6 text-amber-200 fill-amber-200" />;
      case 'rose':
        return <Sparkles className="h-6 w-6 text-rose-200" />;
      case 'initials':
        return <span className="font-serif font-bold text-amber-100 text-sm">{data.senderName?.[0] || 'A'}</span>;
      default:
        return <Heart className="h-6 w-6 text-red-100 fill-red-100" />;
    }
  };

  const fontClass =
    data.fontStyle === 'handwritten'
      ? 'font-handwritten text-xl leading-relaxed'
      : data.fontStyle === 'serif'
      ? 'font-serif text-base leading-relaxed'
      : 'font-sans text-sm leading-relaxed';

  return (
    <div className="w-full max-w-lg mx-auto my-8 px-4">
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-100/80 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
          {isOpen ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
          Mensaje Confidencial
        </span>
      </div>

      <div className="relative flex flex-col items-center">
        {/* ENVELOPE CONTAINER */}
        <div 
          onClick={handleOpen}
          className={`relative w-full max-w-md h-56 rounded-2xl transition-all duration-500 cursor-pointer select-none shadow-xl border border-amber-900/10 ${
            isOpen ? 'bg-amber-100/90' : 'bg-amber-50 hover:shadow-2xl hover:scale-[1.01]'
          }`}
          style={{
            perspective: '1000px',
          }}
        >
          {/* Top Envelope Flap */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-28 origin-top rounded-t-2xl z-20 flex items-center justify-center shadow-md"
            style={{
              backgroundColor: '#fef3c7',
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              borderBottom: '1px solid rgba(180, 83, 9, 0.2)',
            }}
            animate={{
              rotateX: isOpen ? 180 : 0,
              zIndex: isOpen ? 5 : 20,
            }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />

          {/* Envelope Pocket (Front folds) */}
          <div
            className="absolute inset-0 rounded-2xl z-15 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #fde68a 0%, #fef3c7 100%)',
              clipPath: 'polygon(0% 100%, 50% 45%, 100% 100%)',
              borderBottom: '2px solid rgba(217, 119, 6, 0.3)',
            }}
          />

          {/* Left and Right Pocket Folds */}
          <div
            className="absolute inset-0 rounded-2xl z-14 pointer-events-none opacity-80"
            style={{
              background: 'linear-gradient(to right, #fde68a, #fef3c7)',
              clipPath: 'polygon(0% 0%, 0% 100%, 50% 55%)',
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl z-14 pointer-events-none opacity-80"
            style={{
              background: 'linear-gradient(to left, #fde68a, #fef3c7)',
              clipPath: 'polygon(100% 0%, 100% 100%, 50% 55%)',
            }}
          />

          {/* Wax Seal (unopened) */}
          {!isOpen && (
            <motion.div
              className="absolute left-1/2 top-24 -translate-x-1/2 z-30 flex flex-col items-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white/40 cursor-pointer"
                style={{
                  backgroundColor: data.waxSealColor || primaryColor,
                  boxShadow: '0 8px 16px -2px rgba(0,0,0,0.3)',
                }}
              >
                {getSealIcon()}
              </div>
              <span className="mt-2 text-xs font-semibold tracking-wide text-amber-950 bg-amber-200/90 px-2.5 py-0.5 rounded-full shadow-sm">
                Toca para abrir ✨
              </span>
            </motion.div>
          )}

          {/* Unopened hint text */}
          {!isOpen && (
            <div className="absolute bottom-4 inset-x-0 text-center text-xs text-amber-800/80 font-medium">
              De: <span className="font-semibold">{data.senderName}</span> • Para: <span className="font-semibold">{data.recipientName}</span>
            </div>
          )}
        </div>

        {/* REVEALED LETTER (Slide out & Expand) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 16, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
              className="w-full max-w-md bg-[#fffdfa] rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-200 relative text-slate-800"
              style={{
                backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Decorative stamp in corner */}
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-70">
                <div className="w-8 h-8 rounded-full border border-amber-500/40 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                </div>
              </div>

              <div className="mb-4 text-xs font-medium uppercase tracking-wider text-amber-700">
                Querida/o {data.recipientName},
              </div>

              <div className={`whitespace-pre-line text-slate-800 ${fontClass}`}>
                {data.letterText}
              </div>

              <div className="mt-6 pt-4 border-t border-amber-100 flex items-center justify-between">
                <span className="font-handwritten text-xl font-bold text-amber-900">
                  Con cariño, {data.senderName}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Guardar carta
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
