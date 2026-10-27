'use client';

import React from 'react';
import { TimelineBlockData } from '@/types/experience';
import { Heart, Star, Calendar, Gift, Music, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineBlockProps {
  data: TimelineBlockData;
  primaryColor?: string;
}

export function TimelineBlock({ data, primaryColor = '#e11d48' }: TimelineBlockProps) {
  const milestones = data.milestones || [];

  if (milestones.length === 0) return null;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'star':
        return <Star className="w-3.5 h-3.5" />;
      case 'gift':
        return <Gift className="w-3.5 h-3.5" />;
      case 'music':
        return <Music className="w-3.5 h-3.5" />;
      case 'flag':
        return <Flag className="w-3.5 h-3.5" />;
      case 'calendar':
        return <Calendar className="w-3.5 h-3.5" />;
      default:
        return <Heart className="w-3.5 h-3.5 fill-current" />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-8 px-4">
      {data.title && (
        <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-6 text-center">
          {data.title}
        </h3>
      )}

      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-8">
        {milestones.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative group"
          >
            {/* Timeline Node Bullet */}
            <div
              className="absolute -left-[35px] top-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md ring-4 ring-white dark:ring-slate-900 transition-transform group-hover:scale-110"
              style={{ backgroundColor: primaryColor }}
            >
              {renderIcon(item.icon)}
            </div>

            {/* Milestone Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-black/5 dark:border-white/10 hover:shadow-md transition">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {item.date}
              </span>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-2">
                {item.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {item.description}
              </p>

              {item.image && (
                <div className="mt-3 rounded-xl overflow-hidden aspect-video">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
