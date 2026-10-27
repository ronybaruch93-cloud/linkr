import React from 'react';
import { notFound } from 'next/navigation';
import { getExperienceBySlug } from '@/lib/experience-store';
import { ExperienceView } from '@/components/experience/ExperienceView';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const experience = await getExperienceBySlug(params.slug);
  if (!experience) {
    return {
      title: 'Experiencia no encontrada — QRGift',
    };
  }

  return {
    title: `${experience.title} — QRGift`,
    description: experience.description || 'Una experiencia interactiva creada especialmente para ti.',
    openGraph: {
      title: experience.title,
      description: experience.description,
    },
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  const experience = await getExperienceBySlug(params.slug);

  if (!experience) {
    notFound();
  }

  return <ExperienceView experience={experience} />;
}
