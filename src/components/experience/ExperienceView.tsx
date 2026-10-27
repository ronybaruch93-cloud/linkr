'use client';

import React, { useState } from 'react';
import { Experience, BlockType } from '@/types/experience';
import { ParticleCanvas } from './ParticleCanvas';
import { PasscodeGate } from './PasscodeGate';
import { HeroBlock } from './HeroBlock';
import { AudioPlayerBlock } from './AudioPlayerBlock';
import { SecretEnvelopeBlock } from './SecretEnvelopeBlock';
import { PhotoGalleryBlock } from './PhotoGalleryBlock';
import { TimelineBlock } from './TimelineBlock';
import { WhatsAppReplyBlock } from './WhatsAppReplyBlock';
import { MemoryVaultBlock } from './MemoryVaultBlock';

interface ExperienceViewProps {
  experience: Experience;
  isPreview?: boolean;
}

export function ExperienceView({ experience, isPreview = false }: ExperienceViewProps) {
  const [isUnlocked, setIsUnlocked] = useState(!experience.passcode || isPreview);

  const theme = experience.theme_config;
  const primaryColor = theme.primaryColor || '#e11d48';

  // Sort blocks by order
  const sortedBlocks = [...(experience.blocks || [])]
    .filter((b) => b.enabled)
    .sort((a, b) => a.order - b.order);

  // Font class mapping
  const getFontFamilyClass = () => {
    switch (theme.fontFamily) {
      case 'playfair':
        return 'font-serif';
      case 'montserrat':
        return 'font-modern';
      case 'caveat':
        return 'font-handwritten text-lg';
      case 'lora':
        return 'font-editorial';
      default:
        return 'font-sans';
    }
  };

  // Background style
  const getBackgroundStyle = () => {
    if (theme.customGradient) {
      return { background: theme.customGradient };
    }
    if (theme.backgroundStyle === 'solid') {
      return { backgroundColor: theme.backgroundColor };
    }
    // Gradient default
    return {
      background: `linear-gradient(180deg, ${theme.backgroundColor} 0%, ${theme.cardColor} 100%)`,
    };
  };

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden ${getFontFamilyClass()}`}
      style={{
        ...getBackgroundStyle(),
        color: theme.textColor || '#1e293b',
      }}
    >
      {/* Background Particle Animation */}
      <ParticleCanvas effect={theme.particles || 'hearts'} />

      {/* Passcode Gate if protected and not yet unlocked */}
      {!isUnlocked && experience.passcode && (
        <PasscodeGate
          correctPasscode={experience.passcode}
          onUnlocked={() => setIsUnlocked(true)}
          primaryColor={primaryColor}
        />
      )}

      {/* Main Container */}
      <main className="relative z-10 max-w-xl mx-auto py-8 pb-24 space-y-4">
        {sortedBlocks.map((block) => {
          switch (block.type as BlockType) {
            case 'hero':
              return (
                <HeroBlock
                  key={block.id}
                  data={block.data as any}
                  primaryColor={primaryColor}
                />
              );

            case 'audio_player':
              return (
                <AudioPlayerBlock
                  key={block.id}
                  data={block.data as any}
                  primaryColor={primaryColor}
                />
              );

            case 'secret_envelope':
              return (
                <SecretEnvelopeBlock
                  key={block.id}
                  data={block.data as any}
                  primaryColor={primaryColor}
                />
              );

            case 'photo_gallery':
              return (
                <PhotoGalleryBlock
                  key={block.id}
                  data={block.data as any}
                  primaryColor={primaryColor}
                />
              );

            case 'timeline':
              return (
                <TimelineBlock
                  key={block.id}
                  data={block.data as any}
                  primaryColor={primaryColor}
                />
              );

            case 'whatsapp_reply':
              return (
                <WhatsAppReplyBlock
                  key={block.id}
                  data={block.data as any}
                  primaryColor={primaryColor}
                />
              );

            case 'memory_vault':
              return (
                <MemoryVaultBlock
                  key={block.id}
                  experienceId={experience.id}
                  data={block.data as any}
                  primaryColor={primaryColor}
                />
              );

            default:
              return null;
          }
        })}

        {/* Footer Branding */}
        <div className="pt-10 text-center opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-xs font-medium tracking-wide">
            Creado con ❤️ en{' '}
            <span className="font-bold underline">QRGift</span>
          </p>
        </div>
      </main>
    </div>
  );
}
