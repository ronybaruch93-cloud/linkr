import React from 'react';
import Link from 'next/link';
import {
  QrCode,
  Heart,
  Users,
  Sparkles,
  Printer,
  Music,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Mail,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
            <QrCode className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            QRGift
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/e/love-story-sophia"
            target="_blank"
            className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 transition hidden sm:inline-block"
          >
            Ver Demo en Vivo ✨
          </Link>
          <Link
            href="/create"
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <span>Crear Experiencia</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-100/80 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 mb-6 border border-rose-200 dark:border-rose-900/40">
          <Sparkles className="w-4 h-4 text-rose-500" />
          Plataforma SaaS para Experiencias Digitales & Tarjetas QR
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white max-w-4xl mx-auto">
          Convierte tus recuerdos en una{' '}
          <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
            experiencia interactiva
          </span>{' '}
          con código QR.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Diseña páginas web emotivas con música de fondo, cartas secretas con sello de cera, líneas de tiempo y muros colectivos. Genera tarjetas PDF de alta resolución listas para imprimir.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/create"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-base shadow-xl shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>Crear Regalo de Amor / Cumpleaños</span>
          </Link>

          <Link
            href="/create?type=memory_vault"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-white font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <Users className="w-5 h-5 text-amber-400" />
            <span>Crear Homenaje Grupal (MemoryVault)</span>
          </Link>
        </div>

        {/* Value Props */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Tarjetas PDF Vectoriales (A6 y Cuadradas)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Edición posterior al imprimir (Enlace Mágico)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Pagos Mercado Pago & Stripe
          </span>
        </div>
      </header>

      {/* Live Interactive Demos Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Explora las Experiencias Disponibles
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Pruébalas en vivo tal como las experimentará quien escanee tu tarjeta física.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Demo 1: Classic Love */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent border border-rose-200 dark:border-rose-900/50 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 rounded-2xl bg-rose-500 text-white shadow-md">
                  <Heart className="w-6 h-6 fill-white" />
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  Arquetipo 1
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Classic Memory (Amor & Aniversario)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Línea de tiempo individual con fotos, reproductor de música de fondo o nota de voz, lluvia de corazones flotantes y una carta secreta interactiva con sello de cera 3D.
              </p>

              <div className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rose-500" /> Sobre secreto que se abre al tocar con confeti
                </div>
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-rose-500" /> Visualizador de ondas de audio reactivo
                </div>
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-rose-500" /> Tarjeta con QR lista para imprimir
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-rose-200/60 dark:border-rose-900/40">
              <Link
                href="/e/love-story-sophia"
                target="_blank"
                className="flex-1 py-3 px-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-rose-600 font-semibold text-xs text-center hover:bg-rose-50 transition"
              >
                Ver Página Demo
              </Link>
              <Link
                href="/create"
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 text-white font-semibold text-xs text-center hover:bg-rose-500 shadow-md transition"
              >
                Personalizar este diseño
              </Link>
            </div>
          </div>

          {/* Demo 2: Memory Vault */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200 dark:border-amber-900/50 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 rounded-2xl bg-amber-500 text-white shadow-md">
                  <Users className="w-6 h-6" />
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  Arquetipo 2
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                MemoryVault (Homenaje Colectivo)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Un muro colaborativo para cumpleaños de 50, despedidas o bodas. Cualquier persona puede sumar un mensaje, anécdota o foto simplemente abriendo el enlace sin necesidad de registrarse.
              </p>

              <div className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" /> Múltiples personas contribuyen recuerdos
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" /> Sin registro requerido para invitados
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Botón directo de agradecimiento por WhatsApp
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-amber-200/60 dark:border-amber-900/40">
              <Link
                href="/e/tributo-carlos-50"
                target="_blank"
                className="flex-1 py-3 px-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-amber-600 font-semibold text-xs text-center hover:bg-amber-50 transition"
              >
                Ver Página Demo
              </Link>
              <Link
                href="/create?type=memory_vault"
                className="flex-1 py-3 px-4 rounded-xl bg-amber-600 text-white font-semibold text-xs text-center hover:bg-amber-500 shadow-md transition"
              >
                Personalizar este diseño
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Paso a Paso
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            ¿Cómo Funciona QRGift?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-black text-lg mx-auto mb-4">
              1
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Personaliza en Vivo
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Elige tu paleta de colores, sube tus fotos, escribe la carta secreta y añade tu música favorita con vista previa simultánea para iPhone.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-black text-lg mx-auto mb-4">
              2
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Descarga e Imprime
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Obtén el PDF vectorial en tamaño A6 o Cuadrado con código QR de alta resolución y marcas de corte para guillotina profesional.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-black text-lg mx-auto mb-4">
              3
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Regala & Emociona
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              El agasajado escanea el código con su teléfono y descubre la experiencia digital. ¡Y puedes seguir editando el contenido cuando quieras!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 text-center text-xs text-slate-400">
        <p>© 2026 QRGift Platform — Todos los derechos reservados.</p>
        <p className="mt-1">Hecho con Next.js 14, Supabase, Tailwind CSS & pdf-lib.</p>
      </footer>
    </div>
  );
}
