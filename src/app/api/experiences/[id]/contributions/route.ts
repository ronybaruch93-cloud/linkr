import { NextRequest, NextResponse } from 'next/server';
import { getContributions, addContribution } from '@/lib/experience-store';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contributions = await getContributions(params.id);
    return NextResponse.json({ contributions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { author_name, message, image_url, audio_url } = body;

    if (!author_name || !message) {
      return NextResponse.json(
        { error: 'Author name and message are required' },
        { status: 400 }
      );
    }

    const newContrib = await addContribution({
      experience_id: params.id,
      author_name,
      message,
      image_url,
      audio_url,
    });

    return NextResponse.json({ contribution: newContrib }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add contribution' }, { status: 500 });
  }
}
