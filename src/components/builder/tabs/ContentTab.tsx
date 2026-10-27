'use client';

import React from 'react';
import { Experience, Archetype } from '@/types/experience';
import { Heart, Users, Sparkles, RefreshCw } from 'lucide-react';
import { generateShortSlug } from '@/lib/utils';

interface ContentTabProps {
  experience: Experience;
  onChange: (updated: Partial<Experience>) => void;
}

export function ContentTab({ experience, onChange }: ContentTabProps) {
  const archetypes: Array<{
    id: Archetype;
    name: string;
    description: string;
    icon: React.ReactNode;
    tag: string;
  }> = [
    {
      id: 'classic',
      name: 'Classic Memory / Amor / Cumpleaños',
      description: 'Línea de tiempo individual con fotos, carta secreta con sello de cera, música y mensaje de voz.',
      icon: <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />,
      tag: 'Más popular',
    },
    {
      id: 'memory_vault',
      name: 'MemoryVault (Homenaje Colectivo)',
      description: 'Muro participativo donde familiares y amigos suben fotos, mensajes y audios sin registrarse.',
      icon: <Users className="w-5 h-5 text-amber-500" />,
      tag: 'Grupal / Cumpleaños 50+',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Archetype Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          1. Tipo de Experiencia (Arquetipo)
        </label>
        <div className="grid grid-cols-1 gap-3">
          {archetypes.map((arch) => {
            const isSelected = experience.archetype === arch.id;
            return (
              <div
                key={arch.id}
                onClick={() => onChange({ archetype: arch.id })}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-md ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {arch.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {arch.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {arch.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {arch.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recipient & Creator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Nombre del Destinatario
          </label>
          <input
            type="text"
            placeholder="Ej. Sophia o Papá"
            value={experience.recipient_name || ''}
            onChange={(e) => onChange({ recipient_name: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Tu Correo (Para Enlace Mágico)
          </label>
          <input
            type="email"
            placeholder="tu-email@ejemplo.com"
            value={experience.creator_email || ''}
            onChange={(e) => onChange({ creator_email: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Experience Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Título de la Experiencia
        </label>
        <input
          type="text"
          placeholder="Ej. Para Sophia, con todo mi amor ✨"
          value={experience.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Descripción Breve
        </label>
        <textarea
          rows={2}
          placeholder="Una frase dedicatoria que acompañará la experiencia..."
          value={experience.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
        />
      </div>

      {/* Custom URL Slug */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Enlace Corto QR (/e/[slug])
          </label>
          <button
            type="button"
            onClick={() => onChange({ slug: generateShortSlug(6) })}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
          >
            <RefreshCw className="w-3 h-3" /> Generar aleatorio
          </button>
        </div>
        <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
          <span className="px-3 text-xs text-slate-400 font-mono select-none">
            qrgift.com/e/
          </span>
          <input
            type="text"
            value={experience.slug}
            onChange={(e) =>
              onChange({
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
              })
            }
            className="w-full py-2.5 pr-3 text-sm font-mono bg-transparent text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">
          Este será el enlace que se grabará permanentemente en el código QR impreso.
        </p>
      </div>
    </div>
  );
}
