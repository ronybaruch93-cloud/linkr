'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Experience } from '@/types/experience';
import { ContentTab } from './tabs/ContentTab';
import { StylingTab } from './tabs/StylingTab';
import { BlocksTab } from './tabs/BlocksTab';
import { SecurityTab } from './tabs/SecurityTab';
import { MobilePreviewFrame } from './MobilePreviewFrame';
import {
  FileText,
  Palette,
  Layers,
  Lock,
  ArrowRight,
  Save,
  CheckCircle2,
  ExternalLink,
  QrCode,
} from 'lucide-react';

interface BuilderEditorProps {
  initialExperience: Experience;
  isEditing?: boolean;
}

type TabKey = 'content' | 'styling' | 'blocks' | 'security';

export function BuilderEditor({ initialExperience, isEditing = false }: BuilderEditorProps) {
  const router = useRouter();
  const [experience, setExperience] = useState<Experience>(initialExperience);
  const [activeTab, setActiveTab] = useState<TabKey>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpdate = (updates: Partial<Experience>) => {
    setExperience((prev) => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
    }));
  };

  const handleSave = async (redirectTarget?: 'checkout' | 'download' | 'preview') => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);

        if (redirectTarget === 'checkout') {
          router.push(`/checkout/${experience.id}`);
        } else if (redirectTarget === 'download') {
          router.push(`/download/${experience.id}`);
        } else if (redirectTarget === 'preview') {
          window.open(`/e/${experience.slug}`, '_blank');
        }
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: Array<{ id: TabKey; label: string; icon: React.ReactNode }> = [
    { id: 'content', label: 'Contenido', icon: <FileText className="w-4 h-4" /> },
    { id: 'styling', label: 'Diseño & Colores', icon: <Palette className="w-4 h-4" /> },
    { id: 'blocks', label: 'Bloques Modulares', icon: <Layers className="w-4 h-4" /> },
    { id: 'security', label: 'PIN & Enlace', icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Editor en Vivo</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                {experience.archetype === 'memory_vault' ? 'MemoryVault' : 'Classic'}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              /e/{experience.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => handleSave('preview')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Abrir URL
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Guardado</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-500" />
                <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSave('download')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 active:scale-95 transition"
          >
            <span>Generar Tarjeta QR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT CONFIGURATOR PANEL (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto max-h-[calc(100vh-64px)]">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 pt-2 gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Body */}
          <div className="p-6 flex-1">
            {activeTab === 'content' && (
              <ContentTab experience={experience} onChange={handleUpdate} />
            )}
            {activeTab === 'styling' && (
              <StylingTab experience={experience} onChange={handleUpdate} />
            )}
            {activeTab === 'blocks' && (
              <BlocksTab experience={experience} onChange={handleUpdate} />
            )}
            {activeTab === 'security' && (
              <SecurityTab experience={experience} onChange={handleUpdate} />
            )}
          </div>
        </div>

        {/* RIGHT LIVE MOBILE PREVIEW PANEL (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
          <MobilePreviewFrame experience={experience} />
        </div>
      </div>
    </div>
  );
}
