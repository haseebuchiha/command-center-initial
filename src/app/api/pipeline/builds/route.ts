import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { buildValidator } from '@/validators/pipeline/buildValidator';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = buildValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const result = await prisma.build.upsert({
      where: { pipelineRunId: data.pipelineRunId },
      create: {
        pipelineRunId: data.pipelineRunId,
        projectName: data.projectName,
        status: data.status,
        liveUrl: data.liveUrl,
        platform: data.platform,
        neonProjectId: data.neonProjectId,
        durationMs: data.durationMs,
        errorLog: data.errorLog,
        fileCount: data.fileCount,
        userId: user.id,
      },
      update: {
        status: data.status,
        liveUrl: data.liveUrl,
        platform: data.platform,
        neonProjectId: data.neonProjectId,
        durationMs: data.durationMs,
        errorLog: data.errorLog,
        fileCount: data.fileCount,
      },
    });

    if (data.status === 'deployed' || data.status === 'failed') {
      await prisma.pipelineRun.update({
        where: { id: data.pipelineRunId },
        data: {
          status: data.status === 'deployed' ? 'completed' : 'failed',
          completedAt: new Date(),
        },
      });
    }

    revalidatePath('/dashboard');
    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error('Pipeline builds error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
