import { NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerClient();

  const report = {
    configured: isServerSupabaseConfigured,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured (Set)' : 'Missing',
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    tables: {
      experiences: false,
      contributors_content: false,
      orders: false,
    },
    buckets: {
      experiencesMedia: false,
      experiencesAudio: false,
    },
    status: 'unconfigured',
    message: '',
  };

  if (!supabase) {
    report.message = 'Supabase environment variables not detected. Running in local fallback mode.';
    return NextResponse.json(report, { status: 200 });
  }

  try {
    // 1. Check tables
    const expCheck = await supabase.from('experiences').select('id', { count: 'exact', head: true });
    report.tables.experiences = !expCheck.error;

    const contribCheck = await supabase.from('contributors_content').select('id', { count: 'exact', head: true });
    report.tables.contributors_content = !contribCheck.error;

    const orderCheck = await supabase.from('orders').select('id', { count: 'exact', head: true });
    report.tables.orders = !orderCheck.error;

    // 2. Check buckets
    const mediaBucket = await supabase.storage.getBucket('experiences-media');
    report.buckets.experiencesMedia = !mediaBucket.error;

    const audioBucket = await supabase.storage.getBucket('experiences-audio');
    report.buckets.experiencesAudio = !audioBucket.error;

    const allTablesOk = report.tables.experiences && report.tables.contributors_content && report.tables.orders;
    const allBucketsOk = report.buckets.experiencesMedia && report.buckets.experiencesAudio;

    if (allTablesOk && allBucketsOk) {
      report.status = 'healthy';
      report.message = 'Supabase fully connected with all tables and storage buckets!';
    } else if (allTablesOk) {
      report.status = 'warning';
      report.message = 'Database tables connected, but storage buckets need to be created.';
    } else {
      report.status = 'error';
      report.message = 'Connected to Supabase, but SQL migration has not been executed yet.';
    }

    return NextResponse.json(report, { status: 200 });
  } catch (error: any) {
    report.status = 'error';
    report.message = `Database query error: ${error?.message || error}`;
    return NextResponse.json(report, { status: 500 });
  }
}
