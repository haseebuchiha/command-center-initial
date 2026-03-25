import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { pipelineRunValidator } from '@/validators/pipeline/pipelineRunValidator';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = pipelineRunValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    if (data.status === 'running' && !data.pipelineRunId) {
      const result = await prisma.pipelineRun.create({
        data: {
          projectName: data.projectName,
          phase: data.phase,
          status: data.status,
          userId: user.id,
        },
      });

      revalidatePath('/dashboard');
      return NextResponse.json({ id: result.id });
    }

    if (data.pipelineRunId) {
      await prisma.pipelineRun.update({
        where: { id: data.pipelineRunId },
        data: {
          status: data.status,
          ...(data.tokenTotal !== undefined && { tokenTotal: data.tokenTotal }),
          ...(data.costCents !== undefined && { costCents: data.costCents }),
          ...(data.errorMessage && { errorMessage: data.errorMessage }),
          ...((data.status === 'completed' || data.status === 'failed') && {
            completedAt: new Date(),
          }),
        },
      });

      revalidatePath('/dashboard');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Provide pipelineRunId for updates, or status=running to create' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Pipeline runs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
