'use client';

import React, { useState } from 'react';
import { PhotoGalleryBlockData } from '@/types/experience';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoGalleryBlockProps {
  data: PhotoGalleryBlockData;
  primaryColor?: string;
}

export function PhotoGalleryBlock({ data, primaryColor = '#e11d48' }: PhotoGalleryBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const photos = data.photos || [];

  if (photos.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="w-full max-w-lg mx-auto my-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-rose-500" />
          Galería de Fotos
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {photos.length} recuerdos
        </span>
      </div>

      {data.layout === 'swiper' ? (
        /* SWIPER MODE */
        <div className="relative overflow-hidden rounded-3xl shadow-xl bg-slate-900 group">
          <div className="relative aspect-[4/5] sm:aspect-[4/3] w-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={photos[currentIndex].url}
                alt={photos[currentIndex].caption || 'Foto de recuerdo'}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActivePhoto(photos[currentIndex].url)}
                className="w-full h-full object-cover cursor-zoom-in"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Caption */}
            {photos[currentIndex].caption && (
              <div className="absolute bottom-12 inset-x-4 text-center z-10">
                <p className="text-white text-sm sm:text-base font-medium drop-shadow-md">
                  {photos[currentIndex].caption}
                </p>
                {photos[currentIndex].date && (
                  <span className="text-xs text-white/70 block mt-1">
                    {photos[currentIndex].date}
                  </span>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIndex
                          ? 'w-6 bg-white'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* GRID MODE */
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id || idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActivePhoto(photo.url)}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-md cursor-zoom-in bg-slate-100 group border border-black/5"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Foto'}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              {photo.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <p className="text-white text-xs line-clamp-2">{photo.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activePhoto}
              alt="Ampliada"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
