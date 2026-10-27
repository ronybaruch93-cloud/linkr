'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AudioPlayerBlockData } from '@/types/experience';
import { Play, Pause, Volume2, VolumeX, Mic, Music } from 'lucide-react';

interface AudioPlayerBlockProps {
  data: AudioPlayerBlockData;
  primaryColor?: string;
}

export function AudioPlayerBlock({ data, primaryColor = '#e11d48' }: AudioPlayerBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => console.log('Audio playback initiated:', e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress(total ? (current / total) * 100 : 0);
    setCurrentTime(formatTime(current));
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(formatTime(audioRef.current.duration));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTo = (parseFloat(e.target.value) / 100) * (audioRef.current.duration || 0);
    audioRef.current.currentTime = seekTo;
    setProgress(parseFloat(e.target.value));
  };

  // Generate 24 waveform bar heights
  const waveformBars = [
    35, 60, 45, 80, 95, 60, 40, 75, 100, 85, 55, 90, 70, 45, 80, 65, 40, 85,
    95, 70, 50, 65, 40, 25,
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-6 px-4">
      <audio
        ref={audioRef}
        src={data.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-black/5 dark:border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="p-2 rounded-xl text-white shadow-sm flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              {data.audioType === 'voice_note' ? (
                <Mic className="w-4 h-4" />
              ) : (
                <Music className="w-4 h-4" />
              )}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {data.title || (data.audioType === 'voice_note' ? 'Mensaje de Voz' : 'Canción Especial')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {data.artist || (data.audioType === 'voice_note' ? 'Grabado con amor' : 'Banda sonora')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Waveform Visualizer */}
        <div className="my-4 flex items-center justify-between gap-1 h-12 px-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          {waveformBars.map((height, i) => {
            const barProgress = (i / waveformBars.length) * 100;
            const isPassed = progress >= barProgress;

            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-all duration-150"
                style={{
                  height: `${isPlaying ? Math.max(15, (height * (Math.sin(i + Date.now() / 200) + 1.2)) / 2) : height * 0.5}%`,
                  backgroundColor: isPassed ? primaryColor : '#cbd5e1',
                  opacity: isPassed ? 1 : 0.6,
                }}
              />
            );
          })}
        </div>

        {/* Progress & Controls */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            style={{ accentColor: primaryColor }}
          />

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Big Play / Pause Button */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-medium shadow-md hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" /> Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Reproducir Audio
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
