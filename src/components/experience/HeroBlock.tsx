'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HeroBlockData } from '@/types/experience';
import { Calendar, Sparkles } from 'lucide-react';

interface HeroBlockProps {
  data: HeroBlockData;
  primaryColor?: string;
}

export function HeroBlock({ data, primaryColor = '#e11d48' }: HeroBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-lg mx-auto text-center px-4 pt-6 pb-4"
    >
      {/* Cover Image */}
      {data.coverImage && (
        <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden shadow-2xl mb-6 group border border-white/20">
          <img
            src={data.coverImage}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Badge over image */}
          {data.badge && (
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-slate-800 backdrop-blur-md shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                {data.badge}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Badge if no cover image */}
      {!data.coverImage && data.badge && (
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            {data.badge}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white leading-tight">
        {data.title}
      </h1>

      {/* Subtitle */}
      {data.subtitle && (
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
          {data.subtitle}
        </p>
      )}

      {/* Date */}
      {data.date && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{data.date}</span>
        </div>
      )}
    </motion.div>
  );
}
