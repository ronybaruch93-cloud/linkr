'use client';

import React from 'react';
import {
  Experience,
  ThemeConfig,
  ThemePreset,
  FontFamily,
  ParticleEffect,
} from '@/types/experience';
import { THEME_PRESETS } from '@/lib/mock-data';
import { Sparkles, Palette, Type, Wand2 } from 'lucide-react';

interface StylingTabProps {
  experience: Experience;
  onChange: (updated: Partial<Experience>) => void;
}

export function StylingTab({ experience, onChange }: StylingTabProps) {
  const currentTheme = experience.theme_config;

  const updateTheme = (updated: Partial<ThemeConfig>) => {
    onChange({
      theme_config: {
        ...currentTheme,
        ...updated,
      },
    });
  };

  const applyPreset = (presetKey: ThemePreset) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      updateTheme(preset);
    }
  };

  const fontOptions: Array<{ id: FontFamily; name: string; stylePreview: string }> = [
    { id: 'playfair', name: 'Playfair Display', stylePreview: 'Elegante & Romántico' },
    { id: 'inter', name: 'Inter Sans', stylePreview: 'Limpio & Moderno' },
    { id: 'montserrat', name: 'Montserrat', stylePreview: 'Contemporáneo' },
    { id: 'caveat', name: 'Caveat (Manuscrita)', stylePreview: 'Carta a Mano' },
    { id: 'lora', name: 'Lora', stylePreview: 'Editorial Clásico' },
  ];

  const particleOptions: Array<{ id: ParticleEffect; label: string; icon: string }> = [
    { id: 'hearts', label: 'Corazones Flotantes', icon: '❤️' },
    { id: 'stars', label: 'Estrellas Brillantes', icon: '⭐' },
    { id: 'confetti', label: 'Explosión Confeti', icon: '🎉' },
    { id: 'sparkles', label: 'Destellos Mágicos', icon: '✨' },
    { id: 'none', label: 'Sin Animación', icon: '🚫' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Presets */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-rose-500" />
          Paletas de Color Predefinidas
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
            const p = THEME_PRESETS[key];
            const isSelected = currentTheme.preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-semibold capitalize text-slate-800 dark:text-slate-200">
                  {key.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: p.primaryColor }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: p.backgroundColor }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: p.cardColor }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Color Pickers */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-rose-500" />
          Colores Personalizados
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Primary Color */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Color Primario
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentTheme.primaryColor}
              </span>
            </div>
            <input
              type="color"
              value={currentTheme.primaryColor}
              onChange={(e) => updateTheme({ primaryColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
          </div>

          {/* Background Color */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Fondo
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentTheme.backgroundColor}
              </span>
            </div>
            <input
              type="color"
              value={currentTheme.backgroundColor}
              onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
          </div>

          {/* Card / Surface Color */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Superficie Tarjetas
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentTheme.cardColor}
              </span>
            </div>
            <input
              type="color"
              value={currentTheme.cardColor}
              onChange={(e) => updateTheme({ cardColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
          </div>

          {/* Text Color */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Color de Texto
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentTheme.textColor}
              </span>
            </div>
            <input
              type="color"
              value={currentTheme.textColor}
              onChange={(e) => updateTheme({ textColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* 3. Typography Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-rose-500" />
          Tipografía Principal
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fontOptions.map((font) => {
            const isSelected = currentTheme.fontFamily === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => updateTheme({ fontFamily: font.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/30 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  {font.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{font.stylePreview}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Particle Animations */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          Partículas y Efectos de Fondo
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {particleOptions.map((item) => {
            const isSelected = currentTheme.particles === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateTheme({ particles: item.id })}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/30 ring-1 ring-rose-500 font-medium'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-xs text-slate-800 dark:text-slate-200">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
