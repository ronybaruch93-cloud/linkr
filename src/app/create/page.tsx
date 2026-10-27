import React from 'react';
import { BuilderEditor } from '@/components/builder/BuilderEditor';
import { SAMPLE_CLASSIC_EXPERIENCE, SAMPLE_MEMORY_VAULT_EXPERIENCE } from '@/lib/mock-data';
import { generateShortSlug, generateEditToken } from '@/lib/utils';
import { Experience } from '@/types/experience';

interface CreatePageProps {
  searchParams: { type?: string };
}

export default function CreatePage({ searchParams }: CreatePageProps) {
  const isVault = searchParams.type === 'memory_vault';
  const baseTemplate = isVault ? SAMPLE_MEMORY_VAULT_EXPERIENCE : SAMPLE_CLASSIC_EXPERIENCE;

  const initialExperience: Experience = {
    ...baseTemplate,
    id: `exp-${Date.now()}-${generateShortSlug(4)}`,
    slug: generateShortSlug(6),
    edit_token: generateEditToken(),
    is_paid: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return <BuilderEditor initialExperience={initialExperience} isEditing={false} />;
}
