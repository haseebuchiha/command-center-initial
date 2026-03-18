import { jobHandler } from '@/services/jobs/JobHandler';
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

async function handler(req: NextRequest) {
  const body = await req.json();

  const jobName = body.job;
  const payload = body.payload;

  await jobHandler.handle(jobName, payload);

  return NextResponse.json('success');
}

export const POST = verifySignatureAppRouter(handler);
