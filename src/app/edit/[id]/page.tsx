import React from 'react';
import { notFound } from 'next/navigation';
import { getExperienceById } from '@/lib/experience-store';
import { BuilderEditor } from '@/components/builder/BuilderEditor';

interface EditPageProps {
  params: { id: string };
  searchParams: { token?: string };
}

export default async function EditPage({ params }: EditPageProps) {
  const experience = await getExperienceById(params.id);

  if (!experience) {
    notFound();
  }

  return <BuilderEditor initialExperience={experience} isEditing={true} />;
}
