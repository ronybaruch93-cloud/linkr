'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  HardDrive,
} from 'lucide-react';

interface HealthReport {
  configured: boolean;
  supabaseUrl: string;
  hasAnonKey: boolean;
  hasServiceKey: boolean;
  tables: {
    experiences: boolean;
    contributors_content: boolean;
    orders: boolean;
  };
  buckets: {
    experiencesMedia: boolean;
    experiencesAudio: boolean;
  };
  status: 'healthy' | 'warning' | 'error' | 'unconfigured';
  message: string;
}

export default function SetupPage() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSql, setCopiedSql] = useState(false);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const copyMigrationPath = () => {
    navigator.clipboard.writeText('supabase/migrations/20261024000000_init_schema.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 text-slate-800 dark:text-slate-100">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <Database className="w-3.5 h-3.5" />
            Paso 1: Configuración de Base de Datos Real
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Panel de Conexión Supabase
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Verifica el estado de conexión con tu base de datos PostgreSQL, las tablas del esquema y los buckets de almacenamiento multimedia.
          </p>
        </div>

        {/* Live Status Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Database className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-base">Estado de Supabase</h3>
                <p className="text-xs text-slate-500">
                  {report?.message || 'Comprobando estado...'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={checkHealth}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Verificar</span>
            </button>
          </div>

          {/* Diagnostic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Variables de Entorno */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Variables de Entorno (.env.local)
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span>NEXT_PUBLIC_SUPABASE_URL</span>
                  {report?.supabaseUrl === 'Configured (Set)' ? (
                    <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1 font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> Pendiente
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  {report?.hasAnonKey ? (
                    <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Configurada
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1 font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> Pendiente
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>SUPABASE_SERVICE_ROLE_KEY</span>
                  {report?.hasServiceKey ? (
                    <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Configurada
                    </span>
                  ) : (
                    <span className="text-amber-500 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" /> Opcional (Usa Anon)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tablas PostgreSQL */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tablas del Esquema
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono">public.experiences</span>
                  {report?.tables.experiences ? (
                    <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Activa
                    </span>
                  ) : (
                    <span className="text-slate-400">No detectada</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono">public.contributors_content</span>
                  {report?.tables.contributors_content ? (
                    <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Activa
                    </span>
                  ) : (
                    <span className="text-slate-400">No detectada</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono">public.orders</span>
                  {report?.tables.orders ? (
                    <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Activa
                    </span>
                  ) : (
                    <span className="text-slate-400">No detectada</span>
                  )}
                </div>
              </div>
            </div>

            {/* Buckets de Storage */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" /> Buckets de Almacenamiento (Supabase Storage)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border">
                  <span>experiences-media (Fotos/Videos)</span>
                  {report?.buckets.experiencesMedia ? (
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Creado
                    </span>
                  ) : (
                    <span className="text-slate-400">Pendiente</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border">
                  <span>experiences-audio (Música/Audios)</span>
                  {report?.buckets.experiencesAudio ? (
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Creado
                    </span>
                  ) : (
                    <span className="text-slate-400">Pendiente</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Guide */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-lg font-bold">Guía Rápida para Conectar tu Proyecto (3 Minutos)</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Crea un proyecto en Supabase</h4>
                <p className="text-xs text-slate-500">
                  Ingresa a{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-600 hover:underline inline-flex items-center gap-1"
                  >
                    supabase.com <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  y crea un proyecto nuevo (nivel gratuito).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-semibold">Ejecuta el Script SQL de Migración</h4>
                <p className="text-xs text-slate-500">
                  En el panel de Supabase, ve a <strong>SQL Editor</strong>, crea una nueva consulta (New Query), pega el contenido de nuestra migración y presiona <strong>RUN</strong>:
                </p>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs flex items-center justify-between text-slate-700 dark:text-slate-200">
                  <span>supabase/migrations/20261024000000_init_schema.sql</span>
                  <button
                    type="button"
                    onClick={copyMigrationPath}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 text-xs font-sans flex items-center gap-1"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSql ? 'Copiado' : 'Copiar ruta'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Copia tus claves al archivo .env.local</h4>
                <p className="text-xs text-slate-500">
                  En Supabase ve a <strong>Project Settings &gt; API</strong> y copia el <strong>Project URL</strong> y la clave <strong>anon public</strong> en el archivo <code className="text-rose-600 font-mono">.env.local</code> del proyecto.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              ← Volver al inicio
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-500 transition"
            >
              <span>Ir al Creador de Experiencias</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
