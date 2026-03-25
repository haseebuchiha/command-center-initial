import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { tokenUsageValidator } from '@/validators/pipeline/tokenUsageValidator';
import { findOrCreateAgent } from '@/lib/findOrCreateAgent';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = tokenUsageValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const agent = await findOrCreateAgent({
      name: data.agentName,
      emoji: '\u{1F916}',
      userId: user.id,
    });

    const result = await prisma.tokenUsage.create({
      data: {
        agentId: agent.id,
        tokens: data.tokens,
        date: new Date(),
        model: data.model,
        costCents: data.costCents || 0,
        pipelineRunId: data.pipelineRunId,
        userId: user.id,
      },
    });

    if (data.pipelineRunId) {
      await prisma.pipelineRun.update({
        where: { id: data.pipelineRunId },
        data: { tokenTotal: { increment: data.tokens } },
      });
    }

    revalidatePath('/dashboard');
    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error('Pipeline usage error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
