import { Experience, ContributorContent } from '@/types/experience';
import { SAMPLE_CLASSIC_EXPERIENCE, SAMPLE_MEMORY_VAULT_EXPERIENCE } from './mock-data';
import { createServerClient } from './supabase/server';

// In-memory store for instant zero-config fallback
const memoryExperiences: Map<string, Experience> = new Map([
  [SAMPLE_CLASSIC_EXPERIENCE.id, SAMPLE_CLASSIC_EXPERIENCE],
  [SAMPLE_CLASSIC_EXPERIENCE.slug, SAMPLE_CLASSIC_EXPERIENCE],
  [SAMPLE_MEMORY_VAULT_EXPERIENCE.id, SAMPLE_MEMORY_VAULT_EXPERIENCE],
  [SAMPLE_MEMORY_VAULT_EXPERIENCE.slug, SAMPLE_MEMORY_VAULT_EXPERIENCE],
]);

const memoryContributions: Map<string, ContributorContent[]> = new Map([
  [
    SAMPLE_MEMORY_VAULT_EXPERIENCE.id,
    [
      {
        id: 'contrib-1',
        experience_id: SAMPLE_MEMORY_VAULT_EXPERIENCE.id,
        author_name: 'Lucía (Hija)',
        message: '¡Feliz cumple papá! Gracias por enseñarme siempre a no rendirme y por tu amor incondicional.',
        image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'contrib-2',
        experience_id: SAMPLE_MEMORY_VAULT_EXPERIENCE.id,
        author_name: 'Marcos & Andrea',
        message: '¡Brindamos por tus 50 años! Que sigan los asados, los viajes y las buenas anécdotas. ¡Un gran abrazo!',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  ],
]);

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (data && !error) {
        return data as Experience;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local memory store:', e);
    }
  }

  // Fallback
  return memoryExperiences.get(slug) || null;
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data && !error) {
        return data as Experience;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local memory store:', e);
    }
  }

  return memoryExperiences.get(id) || null;
}

export async function saveExperience(experience: Experience): Promise<Experience> {
  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .upsert(experience, { onConflict: 'id' })
        .select()
        .single();

      if (data && !error) {
        memoryExperiences.set(experience.id, data as Experience);
        memoryExperiences.set(experience.slug, data as Experience);
        return data as Experience;
      }
    } catch (e) {
      console.warn('Supabase save failed, falling back to local memory store:', e);
    }
  }

  // Fallback
  memoryExperiences.set(experience.id, experience);
  memoryExperiences.set(experience.slug, experience);
  return experience;
}

export async function getContributions(experienceId: string): Promise<ContributorContent[]> {
  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contributors_content')
        .select('*')
        .eq('experience_id', experienceId)
        .order('created_at', { ascending: false });

      if (data && !error) {
        return data as ContributorContent[];
      }
    } catch (e) {
      console.warn('Supabase fetch contributions failed, falling back:', e);
    }
  }

  return memoryContributions.get(experienceId) || [];
}

export async function addContribution(
  contribution: Omit<ContributorContent, 'id' | 'created_at'>
): Promise<ContributorContent> {
  const newEntry: ContributorContent = {
    ...contribution,
    id: `contrib-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
  };

  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contributors_content')
        .insert(newEntry)
        .select()
        .single();

      if (data && !error) {
        const list = memoryContributions.get(contribution.experience_id) || [];
        memoryContributions.set(contribution.experience_id, [data as ContributorContent, ...list]);
        return data as ContributorContent;
      }
    } catch (e) {
      console.warn('Supabase insert contribution failed, falling back:', e);
    }
  }

  const list = memoryContributions.get(contribution.experience_id) || [];
  memoryContributions.set(contribution.experience_id, [newEntry, ...list]);
  return newEntry;
}
