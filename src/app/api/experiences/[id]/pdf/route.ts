import { NextRequest, NextResponse } from 'next/server';
import { getExperienceById } from '@/lib/experience-store';
import { generatePrintCardPdf } from '@/lib/pdf/generator';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experience = await getExperienceById(params.id);

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const format = (searchParams.get('format') as 'a6' | 'square') || 'a6';
    const includeCropMarks = searchParams.get('cropMarks') !== 'false';
    const isDownload = searchParams.get('download') === 'true';

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const pdfBytes = await generatePrintCardPdf(
      experience,
      {
        format,
        includeCropMarks,
      },
      baseUrl
    );

    const filename = `Tarjeta-QR-${experience.slug}-${format}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${isDownload ? 'attachment' : 'inline'}; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('PDF generation error', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
