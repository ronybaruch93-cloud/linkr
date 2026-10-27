import { NextRequest, NextResponse } from 'next/server';
import { saveExperience, getExperienceById, getExperienceBySlug } from '@/lib/experience-store';
import { Experience } from '@/types/experience';

export async function POST(req: NextRequest) {
  try {
    const experienceData: Experience = await req.json();

    if (!experienceData.title || !experienceData.slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    const saved = await saveExperience(experienceData);
    return NextResponse.json({ experience: saved }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/experiences POST', error);
    return NextResponse.json({ error: 'Failed to save experience' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  if (slug) {
    const exp = await getExperienceBySlug(slug);
    if (!exp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ experience: exp });
  }

  if (id) {
    const exp = await getExperienceById(id);
    if (!exp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ experience: exp });
  }

  return NextResponse.json({ error: 'Provide slug or id' }, { status: 400 });
}
