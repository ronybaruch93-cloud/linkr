'use client';

import React, { useState } from 'react';
import {
  Experience,
  ExperienceBlock,
  BlockType,
  GalleryPhoto,
  TimelineMilestone,
} from '@/types/experience';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Image as ImageIcon,
  Mail,
  Music,
  Clock,
  MessageCircle,
  Users,
  Upload,
  Loader2,
} from 'lucide-react';

interface BlocksTabProps {
  experience: Experience;
  onChange: (updated: Partial<Experience>) => void;
}

export function BlocksTab({ experience, onChange }: BlocksTabProps) {
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(
    experience.blocks?.[0]?.id || null
  );
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const uploadFileToServer = async (file: File, bucket: 'experiences-media' | 'experiences-audio' = 'experiences-media'): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return data.url;
      } else {
        alert(data.error || 'Error al subir archivo a Supabase Storage');
      }
    } catch (e) {
      console.error('Upload failed', e);
      alert('Error de conexión al subir el archivo');
    }
    return null;
  };

  const blocks = [...(experience.blocks || [])].sort((a, b) => a.order - b.order);

  const updateBlocks = (newBlocks: ExperienceBlock[]) => {
    onChange({ blocks: newBlocks });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const reordered = [...blocks];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Re-assign order numbers
    const updated = reordered.map((b, idx) => ({ ...b, order: idx + 1 }));
    updateBlocks(updated);
  };

  const toggleBlockEnabled = (blockId: string) => {
    const updated = blocks.map((b) =>
      b.id === blockId ? { ...b, enabled: !b.enabled } : b
    );
    updateBlocks(updated);
  };

  const updateBlockData = (blockId: string, dataUpdates: any) => {
    const updated = blocks.map((b) =>
      b.id === blockId ? { ...b, data: { ...b.data, ...dataUpdates } } : b
    );
    updateBlocks(updated as ExperienceBlock[]);
  };

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case 'hero':
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case 'secret_envelope':
        return <Mail className="w-4 h-4 text-rose-500" />;
      case 'audio_player':
        return <Music className="w-4 h-4 text-purple-500" />;
      case 'photo_gallery':
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case 'timeline':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'whatsapp_reply':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'memory_vault':
        return <Users className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getBlockTitle = (type: BlockType) => {
    switch (type) {
      case 'hero':
        return 'Encabezado Principal (Hero)';
      case 'secret_envelope':
        return 'Sobre Secreto / Carta con Cera';
      case 'audio_player':
        return 'Reproductor de Audio / Voz';
      case 'photo_gallery':
        return 'Galería de Fotos';
      case 'timeline':
        return 'Línea de Tiempo (Hitos)';
      case 'whatsapp_reply':
        return 'Botón de Respuesta WhatsApp';
      case 'memory_vault':
        return 'Muro Colectivo de Memorias';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Bloques Modulares (Orden & Contenido)
        </label>
        <span className="text-[11px] text-slate-400">
          Usa las flechas para reordenar
        </span>
      </div>

      <div className="space-y-3">
        {blocks.map((block, idx) => {
          const isExpanded = expandedBlockId === block.id;

          return (
            <div
              key={block.id}
              className={`rounded-2xl border transition-all ${
                block.enabled
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
                  : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-70'
              }`}
            >
              {/* Block Header Row */}
              <div className="flex items-center justify-between p-3.5">
                <div
                  className="flex items-center gap-2.5 cursor-pointer flex-1"
                  onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {getBlockIcon(block.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {getBlockTitle(block.type)}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {block.enabled ? 'Visible en la página' : 'Oculto'}
                    </span>
                  </div>
                </div>

                {/* Actions: Move, Toggle, Expand */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveBlock(idx, 'up')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === blocks.length - 1}
                    onClick={() => moveBlock(idx, 'down')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleBlockEnabled(block.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {block.enabled ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Block Content Editor (Accordion) */}
              {isExpanded && (
                <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  {/* HERO BLOCK EDITOR */}
                  {block.type === 'hero' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Insignia / Badge
                        </label>
                        <input
                          type="text"
                          value={block.data.badge || ''}
                          onChange={(e) => updateBlockData(block.id, { badge: e.target.value })}
                          placeholder="Ej. Feliz Cumpleaños 🎂 o Nuestro 2º Aniversario 💖"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Título Principal
                        </label>
                        <input
                          type="text"
                          value={block.data.title || ''}
                          onChange={(e) => updateBlockData(block.id, { title: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Subtítulo / Mensaje
                        </label>
                        <textarea
                          rows={2}
                          value={block.data.subtitle || ''}
                          onChange={(e) => updateBlockData(block.id, { subtitle: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 resize-none"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-500">
                            Foto de Portada
                          </label>
                          <label className="cursor-pointer text-[11px] text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1">
                            {uploadingKey === `hero-${block.id}` ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" /> Subiendo...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3 h-3" /> Subir archivo
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingKey === `hero-${block.id}`}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingKey(`hero-${block.id}`);
                                const url = await uploadFileToServer(file, 'experiences-media');
                                if (url) updateBlockData(block.id, { coverImage: url });
                                setUploadingKey(null);
                              }}
                            />
                          </label>
                        </div>
                        <input
                          type="url"
                          value={block.data.coverImage || ''}
                          onChange={(e) => updateBlockData(block.id, { coverImage: e.target.value })}
                          placeholder="URL o sube un archivo desde tu dispositivo..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {/* SECRET ENVELOPE EDITOR */}
                  {block.type === 'secret_envelope' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            De (Remitente)
                          </label>
                          <input
                            type="text"
                            value={block.data.senderName || ''}
                            onChange={(e) => updateBlockData(block.id, { senderName: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Para (Destinatario)
                          </label>
                          <input
                            type="text"
                            value={block.data.recipientName || ''}
                            onChange={(e) => updateBlockData(block.id, { recipientName: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Ícono del Sello de Cera
                          </label>
                          <select
                            value={block.data.waxSealIcon || 'heart'}
                            onChange={(e) => updateBlockData(block.id, { waxSealIcon: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          >
                            <option value="heart">Corazón ❤️</option>
                            <option value="star">Estrella ⭐</option>
                            <option value="rose">Rosa / Destello ✨</option>
                            <option value="initials">Iniciales</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Estilo Tipográfico
                          </label>
                          <select
                            value={block.data.fontStyle || 'handwritten'}
                            onChange={(e) => updateBlockData(block.id, { fontStyle: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          >
                            <option value="handwritten">Manuscrita (Carta a mano)</option>
                            <option value="serif">Serif Clásica</option>
                            <option value="sans">Sans Limpia</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Contenido de la Carta Secreta
                        </label>
                        <textarea
                          rows={5}
                          value={block.data.letterText || ''}
                          onChange={(e) => updateBlockData(block.id, { letterText: e.target.value })}
                          className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* AUDIO PLAYER EDITOR */}
                  {block.type === 'audio_player' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Título del Audio / Canción
                        </label>
                        <input
                          type="text"
                          value={block.data.title || ''}
                          onChange={(e) => updateBlockData(block.id, { title: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Artista / Dedicatoria
                        </label>
                        <input
                          type="text"
                          value={block.data.artist || ''}
                          onChange={(e) => updateBlockData(block.id, { artist: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-500">
                            Archivo de Audio (MP3 o Voz)
                          </label>
                          <label className="cursor-pointer text-[11px] text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-1">
                            {uploadingKey === `audio-${block.id}` ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" /> Subiendo...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3 h-3" /> Subir MP3
                              </>
                            )}
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              disabled={uploadingKey === `audio-${block.id}`}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingKey(`audio-${block.id}`);
                                const url = await uploadFileToServer(file, 'experiences-audio');
                                if (url) updateBlockData(block.id, { audioUrl: url });
                                setUploadingKey(null);
                              }}
                            />
                          </label>
                        </div>
                        <input
                          type="url"
                          value={block.data.audioUrl || ''}
                          onChange={(e) => updateBlockData(block.id, { audioUrl: e.target.value })}
                          placeholder="URL o sube un archivo MP3 desde tu dispositivo..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {/* PHOTO GALLERY EDITOR */}
                  {block.type === 'photo_gallery' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Modo de Visualización
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => updateBlockData(block.id, { layout: 'swiper' })}
                            className={`py-2 text-xs font-semibold rounded-xl border ${
                              block.data.layout === 'swiper'
                                ? 'border-rose-500 bg-rose-50/50 text-rose-600'
                                : 'border-slate-200'
                            }`}
                          >
                            Carrusel Táctil (Swiper)
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBlockData(block.id, { layout: 'grid' })}
                            className={`py-2 text-xs font-semibold rounded-xl border ${
                              block.data.layout === 'grid'
                                ? 'border-rose-500 bg-rose-50/50 text-rose-600'
                                : 'border-slate-200'
                            }`}
                          >
                            Cuadrícula (Grid)
                          </button>
                        </div>
                      </div>

                      {/* Photo list */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-500">
                          Fotos ({block.data.photos?.length || 0})
                        </label>
                        {(block.data.photos || []).map((photo: GalleryPhoto, pIdx: number) => (
                          <div
                            key={photo.id || pIdx}
                            className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          >
                            <img
                              src={photo.url}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                placeholder="Pie de foto..."
                                value={photo.caption || ''}
                                onChange={(e) => {
                                  const updatedPhotos = [...block.data.photos];
                                  updatedPhotos[pIdx] = { ...photo, caption: e.target.value };
                                  updateBlockData(block.id, { photos: updatedPhotos });
                                }}
                                className="w-full text-xs bg-transparent border-0 focus:outline-none"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedPhotos = block.data.photos.filter((_: any, i: number) => i !== pIdx);
                                updateBlockData(block.id, { photos: updatedPhotos });
                              }}
                              className="text-slate-400 hover:text-rose-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <label className="py-2 px-3 rounded-xl border border-dashed border-rose-400 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center gap-1.5 cursor-pointer font-medium">
                            {uploadingKey === `gallery-${block.id}` ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Subiendo...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" /> Subir desde mi equipo
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingKey === `gallery-${block.id}`}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingKey(`gallery-${block.id}`);
                                const url = await uploadFileToServer(file, 'experiences-media');
                                if (url) {
                                  const newPhoto: GalleryPhoto = {
                                    id: `p-${Date.now()}`,
                                    url,
                                    caption: file.name.replace(/\.[^/.]+$/, ''),
                                    date: 'Hoy',
                                  };
                                  updateBlockData(block.id, {
                                    photos: [...(block.data.photos || []), newPhoto],
                                  });
                                }
                                setUploadingKey(null);
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const newPhoto: GalleryPhoto = {
                                id: `p-${Date.now()}`,
                                url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800',
                                caption: 'Nuevo momento especial',
                                date: 'Hoy',
                              };
                              updateBlockData(block.id, {
                                photos: [...(block.data.photos || []), newPhoto],
                              });
                            }}
                            className="py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" /> Agregar URL Unsplash
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TIMELINE EDITOR */}
                  {block.type === 'timeline' && (
                    <div className="space-y-3">
                      <label className="block text-[11px] font-semibold text-slate-500">
                        Hitos de la Línea de Tiempo
                      </label>
                      {(block.data.milestones || []).map(
                        (ms: TimelineMilestone, mIdx: number) => (
                          <div
                            key={ms.id || mIdx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                placeholder="Fecha (ej. 15 Marzo 2023)"
                                value={ms.date || ''}
                                onChange={(e) => {
                                  const updated = [...block.data.milestones];
                                  updated[mIdx] = { ...ms, date: e.target.value };
                                  updateBlockData(block.id, { milestones: updated });
                                }}
                                className="w-1/2 text-xs font-semibold px-2 py-1 rounded-lg border bg-white dark:bg-slate-900"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = block.data.milestones.filter(
                                    (_: any, i: number) => i !== mIdx
                                  );
                                  updateBlockData(block.id, { milestones: updated });
                                }}
                                className="text-slate-400 hover:text-rose-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Título del momento"
                              value={ms.title || ''}
                              onChange={(e) => {
                                const updated = [...block.data.milestones];
                                updated[mIdx] = { ...ms, title: e.target.value };
                                updateBlockData(block.id, { milestones: updated });
                              }}
                              className="w-full text-xs px-2 py-1 rounded-lg border bg-white dark:bg-slate-900"
                            />
                            <textarea
                              rows={2}
                              placeholder="Descripción o recuerdo..."
                              value={ms.description || ''}
                              onChange={(e) => {
                                const updated = [...block.data.milestones];
                                updated[mIdx] = { ...ms, description: e.target.value };
                                updateBlockData(block.id, { milestones: updated });
                              }}
                              className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 resize-none"
                            />
                          </div>
                        )
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const newMilestone: TimelineMilestone = {
                            id: `m-${Date.now()}`,
                            date: 'Nueva fecha',
                            title: 'Nuevo hito inolvidable',
                            description: 'Escribe aquí la anécdota o lo que sintieron ese día.',
                            icon: 'heart',
                          };
                          updateBlockData(block.id, {
                            milestones: [...(block.data.milestones || []), newMilestone],
                          });
                        }}
                        className="w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agregar Hito
                      </button>
                    </div>
                  )}

                  {/* WHATSAPP REPLY EDITOR */}
                  {block.type === 'whatsapp_reply' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Tu Número de Teléfono (con código de país sin +)
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. 5491123456789 o 15551234567"
                          value={block.data.phoneNumber || ''}
                          onChange={(e) => updateBlockData(block.id, { phoneNumber: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Texto del Botón
                        </label>
                        <input
                          type="text"
                          value={block.data.buttonText || ''}
                          onChange={(e) => updateBlockData(block.id, { buttonText: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Mensaje Predeterminado
                        </label>
                        <input
                          type="text"
                          value={block.data.defaultMessage || ''}
                          onChange={(e) => updateBlockData(block.id, { defaultMessage: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
