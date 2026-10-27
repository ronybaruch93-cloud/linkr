'use client';

import React, { useState } from 'react';
import { Smartphone, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { Experience } from '@/types/experience';
import { ExperienceView } from '@/components/experience/ExperienceView';

interface MobilePreviewFrameProps {
  experience: Experience;
}

export function MobilePreviewFrame({ experience }: MobilePreviewFrameProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full py-4 px-2">
      {/* Frame Top Toolbar */}
      <div className="flex items-center justify-between w-full max-w-sm mb-3 px-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-rose-500" />
          <span>Vista Previa en Vivo</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Recargar vista previa"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title={isFullscreen ? 'Modo teléfono' : 'Pantalla completa'}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-1"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px]">{isFullscreen ? 'Móvil' : 'Expandir'}</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      {isFullscreen ? (
        <div className="w-full h-[85vh] rounded-2xl overflow-y-auto shadow-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
          <ExperienceView key={refreshKey} experience={experience} isPreview={true} />
        </div>
      ) : (
        /* Realistic iPhone Mockup Frame */
        <div className="relative w-[375px] h-[740px] max-h-[85vh] rounded-[48px] p-3 bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border-4 border-slate-700 ring-1 ring-slate-900/50 flex flex-col select-none">
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700/80" />
          </div>

          {/* Screen Content */}
          <div className="relative w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden bg-white dark:bg-slate-950 scroll-smooth">
            <ExperienceView key={refreshKey} experience={experience} isPreview={true} />
          </div>

          {/* Home Indicator bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-30 pointer-events-none" />
        </div>
      )}
    </div>
  );
}
