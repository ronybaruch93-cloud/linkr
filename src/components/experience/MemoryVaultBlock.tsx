'use client';

import React, { useState, useEffect } from 'react';
import { MemoryVaultBlockData, ContributorContent } from '@/types/experience';
import { PlusCircle, Heart, Image as ImageIcon, Send, X, Mic, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MemoryVaultBlockProps {
  experienceId: string;
  data: MemoryVaultBlockData;
  primaryColor?: string;
}

export function MemoryVaultBlock({
  experienceId,
  data,
  primaryColor = '#ea580c',
}: MemoryVaultBlockProps) {
  const [contributions, setContributions] = useState<ContributorContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  // Fetch contributions
  const fetchContributions = async () => {
    try {
      const res = await fetch(`/api/experiences/${experienceId}/contributions`);
      if (res.ok) {
        const json = await res.json();
        setContributions(json.contributions || []);
      }
    } catch (e) {
      console.error('Failed to load contributions', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, [experienceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/experiences/${experienceId}/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: authorName,
          message,
          image_url: imageUrl || undefined,
          audio_url: audioUrl || undefined,
        }),
      });

      if (res.ok) {
        const newContrib = await res.json();
        setContributions((prev) => [newContrib.contribution, ...prev]);
        setAuthorName('');
        setMessage('');
        setImageUrl('');
        setAudioUrl('');
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error submitting contribution', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-8 px-4">
      {/* Header & Prompt */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-black/5 dark:border-white/10 text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {data.promptTitle || 'Muro de Recuerdos Colectivo'}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          {data.promptDescription || 'Comparte un mensaje, anécdota o foto para sumar a este homenaje especial.'}
        </p>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          <PlusCircle className="w-4 h-4" />
          Dejar mi recuerdo (Sin registro)
        </button>
      </div>

      {/* Contributions Wall */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Cargando dedicatorias...
          </div>
        ) : contributions.length === 0 ? (
          <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
            <Heart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">Sé el primero en dejar un mensaje o anécdota.</p>
          </div>
        ) : (
          contributions.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-black/5 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {item.author_name?.[0] || 'U'}
                  </div>
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                    {item.author_name}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(item.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {item.message}
              </p>

              {item.image_url && (
                <div className="mt-3 rounded-xl overflow-hidden aspect-video">
                  <img
                    src={item.image_url}
                    alt="Foto recuerdo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {item.audio_url && (
                <div className="mt-3">
                  <audio src={item.audio_url} controls className="w-full h-9" />
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Contribution Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-black/10 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Deja tu Recuerdo
                </h4>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Tu Nombre o Apodo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Tía Marta o Mateo (Amigo de la facu)"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Tu Mensaje o Anécdota *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Escribe algo emotivo o una divertida anécdota..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  />
                </div>

                {data.allowImageUpload && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      URL de una Foto (Opcional)
                    </label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/foto.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                )}

                {data.allowAudioUpload && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      URL de un Audio / Nota de voz (Opcional)
                    </label>
                    <div className="relative">
                      <Mic className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/audio.mp3"
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Publicando...' : 'Publicar Recuerdo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
