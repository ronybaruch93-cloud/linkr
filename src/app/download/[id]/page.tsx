'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Experience } from '@/types/experience';
import {
  Download,
  Printer,
  QrCode,
  Sparkles,
  ExternalLink,
  Edit,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function DownloadCardPage() {
  const params = useParams();
  const id = params?.id as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [format, setFormat] = useState<'a6' | 'square'>('a6');
  const [cropMarks, setCropMarks] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExp() {
      try {
        const res = await fetch(`/api/experiences?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setExperience(data.experience);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadExp();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Preparando tu tarjeta de regalo...</p>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-sm text-slate-500">Experiencia no encontrada.</p>
      </div>
    );
  }

  const pdfUrl = `/api/experiences/${experience.id}/pdf?format=${format}&cropMarks=${cropMarks}`;
  const downloadUrl = `${pdfUrl}&download=true`;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ¡Tu experiencia está lista para imprimir!
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Descarga tu Tarjeta QR Lista para Imprenta
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            Generamos un archivo vectorial PDF de alta resolución con el código QR integrado que conecta directamente con la experiencia digital.
          </p>
        </div>

        {/* Main Grid: Controls & Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Controls Column (col-span-5) */}
          <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-black/5 dark:border-white/10 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Formato de Impresión
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('a6')}
                  className={`p-3 rounded-2xl border text-center transition ${
                    format === 'a6'
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 font-semibold text-rose-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-sm">Tarjeta A6</div>
                  <div className="text-[11px] text-slate-400">105 × 148 mm</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('square')}
                  className={`p-3 rounded-2xl border text-center transition ${
                    format === 'square'
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 font-semibold text-rose-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-sm">Cuadrada</div>
                  <div className="text-[11px] text-slate-400">120 × 120 mm</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Opciones de Impresión
              </label>
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cropMarks}
                  onChange={(e) => setCropMarks(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Incluir marcas de corte / sangría (Para guillotina profesional)
                </span>
              </label>
            </div>

            {/* Download Button */}
            <div className="pt-2 space-y-3">
              <a
                href={downloadUrl}
                download
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-rose-600/20 transition-all text-center"
              >
                <Download className="w-4 h-4" />
                Descargar PDF para Impresión
              </a>

              <a
                href={`/e/${experience.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ver Experiencia Digital en Vivo
              </a>
            </div>

            {/* Print recommendations */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5" /> Recomendación de Papel
              </div>
              <p className="text-[11px] leading-relaxed">
                Recomendamos imprimir en papel opalina o cartulina texturada de <strong>250g a 300g</strong> para un acabado premium de regalo.
              </p>
            </div>

            {/* Post-print editing */}
            <div className="text-center pt-2">
              <a
                href={`/edit/${experience.id}?token=${experience.edit_token}`}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 underline"
              >
                <Edit className="w-3.5 h-3.5" />
                Volver al editor para modificar contenido
              </a>
            </div>
          </div>

          {/* PDF Visual Preview Column (col-span-7) */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div className="w-full bg-slate-900/10 dark:bg-black/40 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-inner">
              <span className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-rose-500" /> Vista previa del PDF ({format.toUpperCase()})
              </span>

              {/* Embedded PDF iframe preview */}
              <div className="w-full max-w-sm aspect-[105/148] rounded-2xl overflow-hidden shadow-2xl border border-white/40 bg-white">
                <iframe
                  src={pdfUrl}
                  title="PDF Preview"
                  className="w-full h-full border-0"
                />
              </div>

              <p className="text-[11px] text-slate-400 mt-4 text-center">
                El código QR está optimizado con corrección de error 'H' (High) para escanearse sin fallos incluso bajo luz tenue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
